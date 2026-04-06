import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabase-server";

const contentTypeMap = {
  "use-case": "useCases",
  blog: "blogPosts",
  article: "articles"
};

function normalizeLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeFaqs(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [question, ...answerParts] = item.split("|");

      return {
        question: (question || "").trim(),
        answer: answerParts.join("|").trim()
      };
    })
    .filter((item) => item.question && item.answer);
}

export async function readContentStore() {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const contentFilePath = path.join(process.cwd(), "data", "content-library.json");
  const file = await readFile(contentFilePath, "utf8");
  return JSON.parse(file);
}

export async function writeContentStore(content) {
  const { writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const contentFilePath = path.join(process.cwd(), "data", "content-library.json");
  await writeFile(contentFilePath, JSON.stringify(content, null, 2) + "\n", "utf8");
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
  return content[contentTypeMap[type]] || [];
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

export async function saveContentItem(type, formData) {
  const originalId = String(formData.get("originalId") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  const baseItem = {
    id: slug,
    type,
    slug,
    title: String(formData.get("title") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    seoTitle: String(formData.get("seoTitle") || "").trim() || String(formData.get("title") || "").trim(),
    metaDescription: String(formData.get("metaDescription") || "").trim() || String(formData.get("summary") || "").trim(),
    cta: String(formData.get("cta") || "").trim()
  };

  let nextItem = baseItem;

  if (type === "use-case") {
    nextItem = {
      ...baseItem,
      shortTitle: String(formData.get("shortTitle") || "").trim() || baseItem.title,
      audience: normalizeLines(String(formData.get("audience") || "")),
      problem: String(formData.get("problem") || "").trim(),
      whatItDoes: normalizeLines(String(formData.get("whatItDoes") || "")),
      implementation: normalizeLines(String(formData.get("implementation") || "")),
      workflow: normalizeLines(String(formData.get("workflow") || "")),
      outcomes: normalizeLines(String(formData.get("outcomes") || "")),
      integrations: normalizeLines(String(formData.get("integrations") || "")),
      faqs: normalizeFaqs(String(formData.get("faqs") || ""))
    };
  } else {
    nextItem = {
      ...baseItem,
      category: String(formData.get("category") || "").trim(),
      publishedAt: String(formData.get("publishedAt") || "").trim(),
      heroLabel: type === "blog" ? "Blog" : "Article",
      body: normalizeLines(String(formData.get("body") || "")),
      takeaways: normalizeLines(String(formData.get("takeaways") || ""))
    };
  }

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

  const content = await readContentStore();
  const collectionKey = contentTypeMap[type];
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

  const content = await readContentStore();
  const collectionKey = contentTypeMap[type];
  content[collectionKey] = (content[collectionKey] || []).filter((item) => item.id !== id);
  await writeContentStore(content);
}

function sortContentItems(a, b) {
  const aDate = a.publishedAt || "";
  const bDate = b.publishedAt || "";

  if (aDate && bDate && aDate !== bDate) {
    return bDate.localeCompare(aDate);
  }

  return a.title.localeCompare(b.title);
}

function mapRowToContentItem(row) {
  const payload = row.payload || {};

  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    seoTitle: row.seo_title || row.title,
    metaDescription: row.meta_description || row.summary,
    category: row.category || payload.category || "",
    publishedAt: row.published_at || payload.publishedAt || "",
    heroLabel: row.hero_label || payload.heroLabel || "",
    shortTitle: row.short_title || payload.shortTitle || row.title,
    cta: row.cta || payload.cta || "",
    ...payload
  };
}

function mapContentItemToRow(item) {
  return {
    id: item.id,
    type: item.type,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    seo_title: item.seoTitle || item.title,
    meta_description: item.metaDescription || item.summary,
    category: item.category || null,
    published_at: item.publishedAt || null,
    hero_label: item.heroLabel || null,
    short_title: item.shortTitle || null,
    cta: item.cta || null,
    payload: item
  };
}
