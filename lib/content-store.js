import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabase-server.js";
import {
  getContentCollectionKey,
  getContentConfig
} from "./site-config.js";
import {
  getContentLastModified,
  isIndexableContentItem,
  isPublishedContentItem,
  normalizeContentCollection,
  normalizeContentEntry,
  normalizeContentLibrary,
  sortContentItems,
  validateContentEntry,
  validateContentLibrary
} from "./content-model.js";

function isFormDataLike(value) {
  return value && typeof value.get === "function" && typeof value.has === "function";
}

function trimText(value) {
  return String(value || "").trim();
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function hasInputValue(source, key) {
  if (isFormDataLike(source)) {
    return source.has(key);
  }

  return Object.prototype.hasOwnProperty.call(source || {}, key);
}

function getInputValue(source, key) {
  if (isFormDataLike(source)) {
    return source.get(key);
  }

  return source?.[key];
}

function setIfPresent(target, source, key, aliases = [key]) {
  const match = aliases.find((alias) => hasInputValue(source, alias));

  if (!match) {
    return;
  }

  target[key] = getInputValue(source, match);
}

async function getContentFilePath() {
  const path = await import("node:path");
  return path.join(process.cwd(), "data", "content-library.json");
}

async function readRawContentStore() {
  const { readFile, stat } = await import("node:fs/promises");
  const contentFilePath = await getContentFilePath();
  const [file, fileStats] = await Promise.all([
    readFile(contentFilePath, "utf8"),
    stat(contentFilePath)
  ]);

  return {
    content: JSON.parse(file),
    fileUpdatedAt: fileStats.mtime.toISOString()
  };
}

function buildInputEntry(type, source, existingItem = {}) {
  const nextEntry = {
    ...existingItem
  };

  [
    "slug",
    "title",
    "summary",
    "seoTitle",
    "metaDescription",
    "cta",
    "status",
    "category",
    "publishedAt",
    "updatedAt",
    "heroLabel",
    "focusKeyword",
    "keywords",
    "canonicalPath",
    "noIndex",
    "socialImage",
    "socialImageAlt",
    "heroImage",
    "heroImageAlt",
    "heroImageCaption",
    "inlineImageSuggestions",
    "authorName",
    "authorRole",
    "intro",
    "readingTimeMinutes",
    "shortTitle",
    "problem",
    "audience",
    "integrations",
    "whatItDoes",
    "implementation",
    "workflow",
    "outcomes",
    "body",
    "sections",
    "takeaways",
    "faqs"
  ].forEach((key) => setIfPresent(nextEntry, source, key));

  if (!nextEntry.publishedAt && !existingItem.publishedAt) {
    const shouldPublishDate =
      type !== "use-case" || trimText(nextEntry.status || existingItem.status || "published") !== "draft";

    if (shouldPublishDate && hasInputValue(source, "title")) {
      nextEntry.publishedAt = todayDate();
    }
  }

  nextEntry.updatedAt = new Date().toISOString();

  return nextEntry;
}

export async function readContentStore() {
  const { content, fileUpdatedAt } = await readRawContentStore();
  return normalizeContentLibrary(content, {
    fallbackUpdatedAt: fileUpdatedAt
  });
}

export async function writeContentStore(content) {
  const { writeFile } = await import("node:fs/promises");
  const contentFilePath = await getContentFilePath();
  const diagnostics = validateContentLibrary(content, {
    fallbackUpdatedAt: new Date().toISOString()
  });

  if (!diagnostics.valid) {
    throw new Error(`Cannot write content library: ${diagnostics.errors.join(" ")}`);
  }

  await writeFile(contentFilePath, JSON.stringify(content, null, 2) + "\n", "utf8");
}

export async function getContentStoreDiagnostics() {
  const { content, fileUpdatedAt } = await readRawContentStore();
  return validateContentLibrary(content, {
    fallbackUpdatedAt: fileUpdatedAt
  });
}

export async function getContentCollection(type) {
  if (await isSupabaseConfigured()) {
    const supabase = await getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("content_entries")
      .select("*")
      .eq("type", type);

    if (error) {
      throw new Error(`Failed to load ${type} collection from Supabase: ${error.message}`);
    }

    return (data || []).map(mapRowToContentItem).sort(sortContentItems);
  }

  const content = await readContentStore();
  return content[getContentCollectionKey(type)] || [];
}

export async function getPublicContentCollection(type, options = {}) {
  const now = options.now || new Date();
  const items = await getContentCollection(type);

  return items.filter((item) =>
    options.indexableOnly ? isIndexableContentItem(item, now) : isPublishedContentItem(item, now)
  );
}

export async function getContentItem(type, slug) {
  if (await isSupabaseConfigured()) {
    const supabase = await getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("content_entries")
      .select("*")
      .eq("type", type)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load ${type} item from Supabase: ${error.message}`);
    }

    return data ? mapRowToContentItem(data) : undefined;
  }

  const collection = await getContentCollection(type);
  return collection.find((item) => item.slug === slug);
}

export async function getPublicContentItem(type, slug, options = {}) {
  const item = await getContentItem(type, slug);

  if (!item) {
    return undefined;
  }

  return isPublishedContentItem(item, options.now || new Date()) ? item : undefined;
}

export async function saveContentItem(type, formData) {
  const originalId = trimText(getInputValue(formData, "originalId"));
  const existingItem = originalId ? await getContentItem(type, originalId) : undefined;
  const nextEntry = buildInputEntry(type, formData, existingItem);
  const validation = validateContentEntry(type, nextEntry, {
    fallbackUpdatedAt: new Date().toISOString()
  });

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const nextItem = validation.normalized;

  if (await isSupabaseConfigured()) {
    const supabase = await getSupabaseAdminClient();
    const row = mapContentItemToRow(nextItem);

    const { error } = await supabase.from("content_entries").upsert(row, {
      onConflict: "id"
    });

    if (error) {
      throw new Error(`Failed to save ${type} item to Supabase: ${error.message}`);
    }

    if (originalId && originalId !== nextItem.id) {
      const { error: deleteError } = await supabase
        .from("content_entries")
        .delete()
        .eq("id", originalId)
        .eq("type", type);

      if (deleteError) {
        throw new Error(`Saved item but failed to remove old record: ${deleteError.message}`);
      }
    }

    return nextItem;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Local file content editing is disabled in production. Configure Supabase for CMS writes.");
  }

  const { content } = await readRawContentStore();
  const collectionKey = getContentCollectionKey(type);
  const existingCollection = content[collectionKey] || [];
  const filteredCollection = existingCollection.filter((item) =>
    originalId ? item.id !== originalId : item.id !== nextItem.id
  );

  content[collectionKey] = [nextItem, ...filteredCollection];

  await writeContentStore(content);

  return nextItem;
}

export async function deleteContentItem(type, id) {
  if (await isSupabaseConfigured()) {
    const supabase = await getSupabaseAdminClient();
    const { error } = await supabase
      .from("content_entries")
      .delete()
      .eq("id", id)
      .eq("type", type);

    if (error) {
      throw new Error(`Failed to delete ${type} item from Supabase: ${error.message}`);
    }

    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Local file content deletion is disabled in production. Configure Supabase for CMS writes.");
  }

  const { content } = await readRawContentStore();
  const collectionKey = getContentCollectionKey(type);
  content[collectionKey] = (content[collectionKey] || []).filter((item) => item.id !== id);
  await writeContentStore(content);
}

function mapRowToContentItem(row) {
  const payload = row.payload || {};

  return normalizeContentEntry(row.type, {
    ...payload,
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    seoTitle: row.seo_title || payload.seoTitle || row.title,
    metaDescription: row.meta_description || payload.metaDescription || row.summary,
    category: row.category || payload.category,
    publishedAt: row.published_at || payload.publishedAt,
    heroLabel: row.hero_label || payload.heroLabel,
    shortTitle: row.short_title || payload.shortTitle,
    cta: row.cta || payload.cta,
    createdAt: row.created_at || payload.createdAt,
    updatedAt: row.updated_at || payload.updatedAt || row.published_at
  }, {
    fallbackUpdatedAt: row.updated_at || row.published_at || row.created_at
  });
}

function mapContentItemToRow(item) {
  const normalized = normalizeContentEntry(item.type, item, {
    fallbackUpdatedAt: getContentLastModified(item)
  });
  const config = getContentConfig(normalized.type);

  return {
    id: normalized.id,
    type: normalized.type,
    slug: normalized.slug,
    title: normalized.title,
    summary: normalized.summary,
    seo_title: normalized.seoTitle || normalized.title,
    meta_description: normalized.metaDescription || normalized.summary,
    category: normalized.category || null,
    published_at: normalized.publishedAt || null,
    hero_label: normalized.heroLabel || config.defaultHeroLabel,
    short_title: normalized.shortTitle || null,
    cta: normalized.cta || null,
    payload: normalized
  };
}
