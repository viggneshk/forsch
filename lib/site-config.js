export const SITE_ORIGIN = "https://forsch.io";
export const SITE_NAME = "Forsch";
export const BRAND_EMAIL = "hello@forsch.io";
export const BRAND_LOGO_PATH = "/forsch.svg";
export const DEFAULT_AUTHOR_NAME = "Forsch";
export const DEFAULT_AUTHOR_ROLE = "AI Implementation Partner";

export const APPROVED_BRAND_NAMES = [SITE_NAME];
export const APPROVED_CONTACT_EMAILS = [BRAND_EMAIL];
export const APPROVED_SITE_HOSTS = ["forsch.io", "www.forsch.io"];

export const CONTENT_CONFIG = {
  "use-case": {
    collectionKey: "useCases",
    basePath: "/use-cases",
    label: "Use Case",
    hubLabel: "Use Cases",
    defaultHeroLabel: "Use Case",
    schemaType: "Service",
    openGraphType: "article",
    defaultPriority: 0.8,
    defaultChangeFrequency: "monthly"
  },
  blog: {
    collectionKey: "blogPosts",
    basePath: "/blog",
    label: "Blog",
    hubLabel: "Blog",
    defaultHeroLabel: "Blog",
    schemaType: "BlogPosting",
    openGraphType: "article",
    defaultPriority: 0.7,
    defaultChangeFrequency: "monthly"
  },
  article: {
    collectionKey: "articles",
    basePath: "/articles",
    label: "Article",
    hubLabel: "Articles",
    defaultHeroLabel: "Article",
    schemaType: "Article",
    openGraphType: "article",
    defaultPriority: 0.7,
    defaultChangeFrequency: "monthly"
  }
};

export function getContentConfig(type) {
  const config = CONTENT_CONFIG[type];

  if (!config) {
    throw new Error(`Unsupported content type: ${type}`);
  }

  return config;
}

export function getContentCollectionKey(type) {
  return getContentConfig(type).collectionKey;
}

export function getCollectionPath(type) {
  return getContentConfig(type).basePath;
}

export function getContentPath(type, slug) {
  return `${getCollectionPath(type)}/${slug}`;
}

export function ensureLeadingSlash(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function buildPublicUrl(path = "/") {
  return new URL(ensureLeadingSlash(path), SITE_ORIGIN).toString();
}

export function getCanonicalPath(type, item) {
  const configuredPath = String(item?.canonicalPath || "").trim();

  if (!configuredPath) {
    return item?.slug ? getContentPath(type, item.slug) : getCollectionPath(type);
  }

  if (configuredPath.startsWith("http://") || configuredPath.startsWith("https://")) {
    return ensureLeadingSlash(new URL(configuredPath).pathname);
  }

  return ensureLeadingSlash(configuredPath);
}
