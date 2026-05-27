import fs from "node:fs";
import path from "node:path";
import {
  BRAND_EMAIL,
  DEFAULT_AUTHOR_NAME,
  DEFAULT_AUTHOR_ROLE,
  SITE_NAME,
  buildPublicUrl,
  ensureLeadingSlash,
  getCanonicalPath,
  getCollectionPath,
  getContentCollectionKey,
  getContentConfig,
  getContentPath
} from "./site-config.js";
import { validateForschBrandConsistency } from "./brand-validation.js";

const VALID_STATUSES = new Set(["draft", "published", "scheduled", "archived"]);
const VALID_CHANGE_FREQUENCIES = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never"
]);

function trimText(value) {
  return String(value || "").trim();
}

function sanitizeLine(value) {
  return trimText(value).replace(/^[-*]\s+/, "");
}

function normalizeParagraphs(value) {
  if (Array.isArray(value)) {
    return value.map((item) => trimText(item)).filter(Boolean);
  }

  const trimmed = trimText(value);

  if (!trimmed) {
    return [];
  }

  const blocks = trimmed
    .split(/\r?\n\s*\r?\n/g)
    .map((item) => trimText(item.replace(/\s*\r?\n\s*/g, " ")))
    .filter(Boolean);

  if (blocks.length > 1) {
    return blocks;
  }

  return trimmed
    .split(/\r?\n/g)
    .map((item) => trimText(item))
    .filter(Boolean);
}

function normalizeLines(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLine(item)).filter(Boolean);
  }

  return trimText(value)
    .split(/\r?\n/g)
    .map((item) => sanitizeLine(item))
    .filter(Boolean);
}

function normalizePublicAssetPath(value, fallbackFolder = "/images/content") {
  const trimmed = trimText(value);

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }

  return `${fallbackFolder}/${trimmed}`;
}

function publicAssetExists(value) {
  const normalized = normalizePublicAssetPath(value);

  if (!normalized || normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return false;
  }

  return fs.existsSync(path.join(process.cwd(), "public", normalized.replace(/^\//, "")));
}

function normalizeKeywords(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => trimText(item)).filter(Boolean))];
  }

  return [...new Set(trimText(value)
    .split(/[\n,]/g)
    .map((item) => trimText(item))
    .filter(Boolean))];
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = trimText(value).toLowerCase();

  return ["1", "true", "yes", "on"].includes(normalized);
}

function normalizeInteger(value) {
  const number = Number.parseInt(String(value || ""), 10);

  return Number.isFinite(number) && number > 0 ? number : null;
}

function normalizePriority(value, fallback) {
  const number = Number.parseFloat(String(value || ""));

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, Math.min(1, number));
}

function normalizeChangeFrequency(value, fallback) {
  const normalized = trimText(value).toLowerCase();
  return VALID_CHANGE_FREQUENCIES.has(normalized) ? normalized : fallback;
}

function normalizeDate(value) {
  const trimmed = trimText(value);

  if (!trimmed) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
}

function normalizeDateTime(value) {
  const trimmed = trimText(value);

  if (!trimmed) {
    return "";
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

function normalizeStatus(value) {
  const normalized = trimText(value).toLowerCase();

  if (!normalized) {
    return "published";
  }

  return VALID_STATUSES.has(normalized) ? normalized : "published";
}

function normalizeSlug(value, fallbackTitle = "") {
  const raw = trimText(value || fallbackTitle)
    .replace(/^https?:\/\/[^/]+/i, "")
    .split("/")
    .filter(Boolean)
    .pop();

  return String(raw || "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeFaqs(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const [question, ...answerParts] = item.split("|");

          return {
            question: trimText(question),
            answer: trimText(answerParts.join("|"))
          };
        }

        return {
          question: trimText(item?.question || item?.title),
          answer: trimText(item?.answer || item?.response)
        };
      })
      .filter((item) => item.question && item.answer);
  }

  return trimText(value)
    .split(/\r?\n/g)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [question, ...answerParts] = item.split("|");

      return {
        question: trimText(question),
        answer: trimText(answerParts.join("|"))
      };
    })
    .filter((item) => item.question && item.answer);
}

function normalizeInlineImageSuggestions(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      placement: trimText(item?.placement || item?.position),
      alt: trimText(item?.alt || item?.altText || item?.caption),
      brief: trimText(item?.brief || item?.prompt || item?.description),
      src: normalizePublicAssetPath(item?.src || item?.filename),
      assetExists: publicAssetExists(item?.src || item?.filename)
    }))
    .filter((item) => item.placement || item.alt || item.src || item.brief);
}

function parseSectionsFromMarkdown(value) {
  const lines = trimText(value).split(/\r?\n/g);
  const sections = [];
  let current = {
    heading: "",
    paragraphs: [],
    bullets: []
  };
  let paragraphBuffer = [];

  function flushParagraphBuffer() {
    if (paragraphBuffer.length === 0) {
      return;
    }

    current.paragraphs.push(trimText(paragraphBuffer.join(" ")));
    paragraphBuffer = [];
  }

  function flushSection() {
    flushParagraphBuffer();

    if (!current.heading && current.paragraphs.length === 0 && current.bullets.length === 0) {
      return;
    }

    sections.push({
      heading: current.heading,
      paragraphs: current.paragraphs.filter(Boolean),
      bullets: current.bullets.filter(Boolean)
    });
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraphBuffer();
      return;
    }

    const headingMatch = trimmed.match(/^##+\s+(.+)$/);

    if (headingMatch) {
      flushSection();
      current = {
        heading: trimText(headingMatch[1]),
        paragraphs: [],
        bullets: []
      };
      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);

    if (bulletMatch) {
      flushParagraphBuffer();
      current.bullets.push(trimText(bulletMatch[1]));
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushSection();

  return sections;
}

function normalizeSections(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return {
            heading: "",
            paragraphs: [trimText(item)],
            bullets: []
          };
        }

        return {
          heading: trimText(item?.heading || item?.title),
          paragraphs: normalizeParagraphs(item?.paragraphs || item?.body || item?.content),
          bullets: normalizeLines(item?.bullets || item?.points || item?.list)
        };
      })
      .filter((item) => item.heading || item.paragraphs.length > 0 || item.bullets.length > 0);
  }

  const trimmed = trimText(value);

  if (!trimmed) {
    return [];
  }

  return parseSectionsFromMarkdown(trimmed);
}

function normalizeCanonicalPath(type, value, slug) {
  const trimmed = trimText(value);

  if (!trimmed) {
    return getContentPath(type, slug);
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return ensureLeadingSlash(new URL(trimmed).pathname);
  }

  return ensureLeadingSlash(trimmed);
}

function getDefaultCta(type) {
  if (type === "use-case") {
    return "Talk through your workflow";
  }

  if (type === "article") {
    return "Talk through your production AI workflow";
  }

  return "Talk through your AI roadmap";
}

function buildArticleBody(entry) {
  const segments = [];
  const intro = trimText(entry.intro);

  if (intro) {
    segments.push(intro);
  }

  segments.push(...(entry.body || []));
  (entry.sections || []).forEach((section) => {
    if (section.heading) {
      segments.push(section.heading);
    }

    segments.push(...(section.paragraphs || []));
    segments.push(...(section.bullets || []));
  });

  segments.push(...(entry.takeaways || []));
  (entry.faqs || []).forEach((faq) => {
    segments.push(faq.question, faq.answer);
  });

  return segments.filter(Boolean).join(" ");
}

function inferReadingTimeMinutes(entry) {
  const bodyText = buildArticleBody(entry);

  if (!bodyText) {
    return null;
  }

  const wordCount = bodyText.split(/\s+/g).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function sortContentItems(a, b) {
  const aDate = a.publishedAt || "";
  const bDate = b.publishedAt || "";

  if (aDate && bDate && aDate !== bDate) {
    return bDate.localeCompare(aDate);
  }

  const aUpdated = a.updatedAt || "";
  const bUpdated = b.updatedAt || "";

  if (aUpdated && bUpdated && aUpdated !== bUpdated) {
    return bUpdated.localeCompare(aUpdated);
  }

  return a.title.localeCompare(b.title);
}

export function normalizeContentEntry(type, entry = {}, options = {}) {
  const config = getContentConfig(type);
  const title = trimText(entry.title);
  const slug = normalizeSlug(entry.slug || entry.id, title);
  const publishedAt = normalizeDate(entry.publishedAt || entry.datePublished || entry.publishDate);
  const fallbackUpdatedAt = normalizeDateTime(options.fallbackUpdatedAt || publishedAt);
  const canonicalPath = normalizeCanonicalPath(
    type,
    entry.canonicalPath || entry.canonicalUrl || entry.url,
    slug
  );

  const normalized = {
    ...entry,
    id: slug,
    type,
    slug,
    status: normalizeStatus(entry.status),
    title,
    summary: trimText(entry.summary || entry.excerpt || entry.description),
    excerpt: trimText(entry.excerpt || entry.summary || entry.description),
    seoTitle: trimText(entry.seoTitle || entry.metaTitle || entry.title),
    metaDescription: trimText(entry.metaDescription || entry.summary || entry.description),
    openGraphTitle: trimText(entry.openGraphTitle || entry.ogTitle || entry.seoTitle || entry.title),
    openGraphDescription: trimText(
      entry.openGraphDescription || entry.ogDescription || entry.metaDescription || entry.summary
    ),
    twitterTitle: trimText(entry.twitterTitle || entry.openGraphTitle || entry.seoTitle || entry.title),
    twitterDescription: trimText(
      entry.twitterDescription || entry.openGraphDescription || entry.metaDescription || entry.summary
    ),
    keywords: normalizeKeywords(entry.keywords || entry.seoKeywords || entry.tags),
    focusKeyword: trimText(entry.focusKeyword || entry.targetKeyword),
    canonicalPath,
    noIndex: normalizeBoolean(entry.noIndex ?? entry.noindex),
    socialImage: trimText(
      entry.socialImage || entry.ogImage || entry.openGraphImage || entry.featuredImage
    ),
    socialImageAlt: trimText(
      entry.socialImageAlt || entry.ogImageAlt || entry.featuredImageAlt || entry.title
    ),
    heroImage: normalizePublicAssetPath(entry.heroImage || entry.featuredHeroImage),
    heroImageAlt: trimText(entry.heroImageAlt || entry.featuredHeroImageAlt || entry.title),
    heroImageCaption: trimText(entry.heroImageCaption || entry.featuredHeroImageCaption),
    heroImageExists: publicAssetExists(entry.heroImage || entry.featuredHeroImage),
    heroLabel: trimText(entry.heroLabel || config.defaultHeroLabel),
    category: trimText(entry.category),
    publishedAt,
    updatedAt:
      normalizeDateTime(entry.updatedAt || entry.dateModified || entry.lastModified) || fallbackUpdatedAt,
    createdAt:
      normalizeDateTime(entry.createdAt || entry.dateCreated) ||
      normalizeDateTime(entry.updatedAt || entry.dateModified || entry.lastModified) ||
      fallbackUpdatedAt,
    cta: trimText(entry.cta) || getDefaultCta(type),
    authorName: trimText(entry.authorName || entry.author) || DEFAULT_AUTHOR_NAME,
    authorRole: trimText(entry.authorRole || entry.authorTitle) || DEFAULT_AUTHOR_ROLE,
    contactEmail: trimText(entry.contactEmail) || BRAND_EMAIL,
    publisherName: trimText(entry.publisherName) || SITE_NAME,
    publisherUrl: trimText(entry.publisherUrl) || buildPublicUrl("/"),
    schemaType: trimText(entry.schemaType) || config.schemaType,
    sitemapPriority: normalizePriority(entry.sitemapPriority, config.defaultPriority),
    sitemapChangeFrequency: normalizeChangeFrequency(
      entry.sitemapChangeFrequency,
      config.defaultChangeFrequency
    )
  };

  if (type === "use-case") {
    normalized.shortTitle = trimText(entry.shortTitle) || normalized.title;
    normalized.audience = normalizeLines(entry.audience);
    normalized.problem = trimText(entry.problem);
    normalized.whatItDoes = normalizeLines(entry.whatItDoes);
    normalized.implementation = normalizeLines(entry.implementation);
    normalized.workflow = normalizeLines(entry.workflow);
    normalized.outcomes = normalizeLines(entry.outcomes);
    normalized.integrations = normalizeLines(entry.integrations);
    normalized.faqs = normalizeFaqs(entry.faqs);
  } else {
    normalized.intro = trimText(entry.intro);
    normalized.body = normalizeParagraphs(entry.body || entry.paragraphs || entry.content);
    normalized.sections = normalizeSections(
      entry.sections || entry.bodySections || entry.contentSections || entry.markdownBody || entry.markdown
    );
    normalized.takeaways = normalizeLines(entry.takeaways || entry.keyTakeaways || entry.highlights);
    normalized.faqs = normalizeFaqs(entry.faqs || entry.faq);
    normalized.readingTimeMinutes =
      normalizeInteger(entry.readingTimeMinutes || entry.readTimeMinutes || entry.readingTime) ||
      inferReadingTimeMinutes(normalized);
  }

  normalized.inlineImageSuggestions = normalizeInlineImageSuggestions(
    entry.inlineImageSuggestions || entry.inlineImages
  );

  if (!normalized.seoTitle) {
    normalized.seoTitle = normalized.title;
  }

  if (!normalized.metaDescription) {
    normalized.metaDescription = normalized.summary;
  }

  if (!normalized.socialImage && normalized.heroImage) {
    normalized.socialImage = normalized.heroImage;
  }

  if (!normalized.socialImageAlt && normalized.heroImageAlt) {
    normalized.socialImageAlt = normalized.heroImageAlt;
  }

  if (!normalized.openGraphTitle) {
    normalized.openGraphTitle = normalized.seoTitle || normalized.title;
  }

  if (!normalized.openGraphDescription) {
    normalized.openGraphDescription = normalized.metaDescription || normalized.summary;
  }

  if (!normalized.twitterTitle) {
    normalized.twitterTitle = normalized.openGraphTitle;
  }

  if (!normalized.twitterDescription) {
    normalized.twitterDescription = normalized.openGraphDescription;
  }

  if (!normalized.canonicalPath) {
    normalized.canonicalPath = getCanonicalPath(type, normalized);
  }

  return normalized;
}

export function normalizeContentCollection(type, entries = [], options = {}) {
  return (entries || [])
    .map((entry) => normalizeContentEntry(type, entry, options))
    .sort(sortContentItems);
}

export function normalizeContentLibrary(library = {}, options = {}) {
  return {
    ...library,
    useCases: normalizeContentCollection("use-case", library.useCases || [], options),
    blogPosts: normalizeContentCollection("blog", library.blogPosts || [], options),
    articles: normalizeContentCollection("article", library.articles || [], options)
  };
}

function getPublicationTimestamp(item) {
  return item.publishedAt ? new Date(item.publishedAt).getTime() : null;
}

export function isPublishedContentItem(item, now = new Date()) {
  if (!item || item.status === "draft" || item.status === "archived") {
    return false;
  }

  const publishTimestamp = getPublicationTimestamp(item);

  if (publishTimestamp && publishTimestamp > now.getTime()) {
    return false;
  }

  return item.status === "published" || item.status === "scheduled";
}

export function isIndexableContentItem(item, now = new Date()) {
  return isPublishedContentItem(item, now) && !item.noIndex;
}

export function getContentLastModified(item, fallbackValue = "") {
  return normalizeDateTime(item?.updatedAt || item?.publishedAt || item?.createdAt || fallbackValue);
}

export function getContentCollectionPath(type) {
  return getCollectionPath(type);
}

export function getReadableContentText(item = {}) {
  if (item.type === "use-case") {
    return [
      item.summary,
      item.problem,
      ...(item.audience || []),
      ...(item.whatItDoes || []),
      ...(item.implementation || []),
      ...(item.workflow || []),
      ...(item.outcomes || []),
      ...(item.integrations || []),
      ...(item.faqs || []).flatMap((faq) => [faq.question, faq.answer])
    ]
      .filter(Boolean)
      .join(" ");
  }

  return buildArticleBody(item);
}

function validateCanonicalPath(type, item, errors) {
  const expectedBasePath = getCollectionPath(type);

  if (!item.canonicalPath.startsWith(expectedBasePath)) {
    errors.push(`canonicalPath must stay under ${expectedBasePath}.`);
  }
}

function validateSeoLengths(item, warnings) {
  if (item.seoTitle && item.seoTitle.length > 70) {
    warnings.push("seoTitle is longer than 70 characters.");
  }

  if (item.metaDescription && item.metaDescription.length > 165) {
    warnings.push("metaDescription is longer than 165 characters.");
  }
}

export function validateContentEntry(type, entry, options = {}) {
  const normalized = normalizeContentEntry(type, entry, options);
  const errors = [];
  const warnings = [];

  if (!normalized.slug) {
    errors.push("slug is required.");
  }

  if (!normalized.title) {
    errors.push("title is required.");
  }

  if (!normalized.summary) {
    errors.push("summary is required.");
  }

  if (!normalized.seoTitle) {
    warnings.push("seoTitle is missing; the page title will be reused.");
  }

  if (!normalized.metaDescription) {
    warnings.push("metaDescription is missing; the summary will be reused.");
  }

  if (entry?.status && !VALID_STATUSES.has(trimText(entry.status).toLowerCase())) {
    errors.push(`status must be one of: ${[...VALID_STATUSES].join(", ")}.`);
  }

  validateCanonicalPath(type, normalized, errors);
  validateSeoLengths(normalized, warnings);

  if (type === "use-case") {
    if (!normalized.problem) {
      warnings.push("problem should be filled in for use-case entries.");
    }

    if ((normalized.whatItDoes || []).length === 0) {
      warnings.push("whatItDoes should include at least one workflow bullet.");
    }
  } else {
    if ((normalized.body || []).length === 0 && (normalized.sections || []).length === 0) {
      warnings.push("Add body paragraphs or sections so article routes have page content.");
    }

    if ((normalized.takeaways || []).length === 0) {
      warnings.push("Add takeaways to strengthen article SEO summaries.");
    }
  }

  if (!normalized.focusKeyword) {
    warnings.push("focusKeyword is missing.");
  }

  if ((normalized.keywords || []).length === 0) {
    warnings.push("keywords is empty.");
  }

  if (!normalized.socialImage) {
    warnings.push("socialImage is missing.");
  }

  if (!normalized.heroImage) {
    warnings.push("heroImage is missing.");
  }

  if (normalized.status === "scheduled" && !normalized.publishedAt) {
    errors.push("scheduled entries must include publishedAt.");
  }

  const brandValidation = validateForschBrandConsistency(normalized);
  errors.push(...brandValidation.errors);
  warnings.push(...brandValidation.warnings);

  return {
    normalized,
    errors,
    warnings,
    valid: errors.length === 0
  };
}

export function validateContentLibrary(library = {}, options = {}) {
  const normalizedLibrary = normalizeContentLibrary(library, options);
  const errors = [];
  const warnings = [];
  const seenIds = new Map();
  const seenSlugs = new Map();

  Object.entries({
    "use-case": normalizedLibrary[getContentCollectionKey("use-case")],
    blog: normalizedLibrary[getContentCollectionKey("blog")],
    article: normalizedLibrary[getContentCollectionKey("article")]
  }).forEach(([type, entries]) => {
    entries.forEach((entry) => {
      const validation = validateContentEntry(type, entry, options);
      const entryKey = `${type}:${entry.slug || entry.id || "missing-slug"}`;

      validation.errors.forEach((message) => errors.push(`${entryKey} ${message}`));
      validation.warnings.forEach((message) => warnings.push(`${entryKey} ${message}`));

      if (seenIds.has(entry.id)) {
        errors.push(`${entryKey} id duplicates ${seenIds.get(entry.id)}.`);
      } else if (entry.id) {
        seenIds.set(entry.id, entryKey);
      }

      if (seenSlugs.has(entry.slug)) {
        errors.push(`${entryKey} slug duplicates ${seenSlugs.get(entry.slug)}.`);
      } else if (entry.slug) {
        seenSlugs.set(entry.slug, entryKey);
      }
    });
  });

  return {
    normalized: normalizedLibrary,
    errors,
    warnings,
    valid: errors.length === 0
  };
}
