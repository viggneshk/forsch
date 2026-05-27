import {
  BRAND_LOGO_PATH,
  SITE_NAME,
  buildPublicUrl,
  getCanonicalPath,
  getContentConfig
} from "./site-config.js";
import { getContentLastModified, getReadableContentText } from "./content-model.js";

function cleanValue(value) {
  if (Array.isArray(value)) {
    const cleanedItems = value
      .map((item) => cleanValue(item))
      .filter((item) => item !== undefined && item !== null && item !== "");

    return cleanedItems.length > 0 ? cleanedItems : undefined;
  }

  if (value && typeof value === "object") {
    const cleanedEntries = Object.entries(value)
      .map(([key, item]) => [key, cleanValue(item)])
      .filter(([, item]) => item !== undefined && item !== null && item !== "");

    if (cleanedEntries.length === 0) {
      return undefined;
    }

    return Object.fromEntries(cleanedEntries);
  }

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return value;
}

function withBrandSuffix(value) {
  if (!value) {
    return SITE_NAME;
  }

  return value.includes(SITE_NAME) ? value : `${value} | ${SITE_NAME}`;
}

function getSocialImageUrl(item) {
  const socialImage = String(item?.socialImage || item?.heroImage || "").trim();

  if (!socialImage) {
    return undefined;
  }

  if (socialImage.startsWith("http://") || socialImage.startsWith("https://")) {
    return socialImage;
  }

  return buildPublicUrl(socialImage);
}

function getPublishedTime(item) {
  return item?.publishedAt ? new Date(item.publishedAt).toISOString() : undefined;
}

function getModifiedTime(item) {
  return getContentLastModified(item);
}

function buildAuthorSchema(item) {
  if (item.authorName === SITE_NAME) {
    return {
      "@type": "Organization",
      name: SITE_NAME,
      url: buildPublicUrl("/")
    };
  }

  return {
    "@type": "Person",
    name: item.authorName,
    jobTitle: item.authorRole,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME
    }
  };
}

function buildPublisherSchema() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: buildPublicUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: buildPublicUrl(BRAND_LOGO_PATH)
    }
  };
}

function buildKeywords(item) {
  const values = [...(item.keywords || [])];

  if (item.focusKeyword) {
    values.unshift(item.focusKeyword);
  }

  return [...new Set(values.filter(Boolean))];
}

export function buildRobotsMetadata(item) {
  if (item?.noIndex) {
    return {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-image-preview": "none",
        "max-snippet": 0,
        "max-video-preview": 0
      }
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  };
}

export function buildContentMetadata(type, item) {
  const config = getContentConfig(type);
  const canonicalPath = getCanonicalPath(type, item);
  const canonicalUrl = buildPublicUrl(canonicalPath);
  const title = item.seoTitle || item.title;
  const description = item.metaDescription || item.summary;
  const keywords = buildKeywords(item);
  const socialImage = getSocialImageUrl(item);
  const publishedTime = getPublishedTime(item);
  const modifiedTime = getModifiedTime(item);

  return cleanValue({
    title,
    description,
    keywords,
    authors: [
      {
        name: item.authorName || SITE_NAME,
        url: buildPublicUrl("/")
      }
    ],
    alternates: {
      canonical: canonicalPath
    },
    robots: buildRobotsMetadata(item),
    openGraph: {
      title: withBrandSuffix(item.openGraphTitle || title),
      description: item.openGraphDescription || description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type: config.openGraphType,
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: item.socialImageAlt || item.title
            }
          ]
        : undefined,
      publishedTime,
      modifiedTime,
      section: item.category,
      tags: keywords
    },
    twitter: {
      card: "summary_large_image",
      title: item.twitterTitle || item.openGraphTitle || title,
      description: item.twitterDescription || item.openGraphDescription || description,
      images: socialImage ? [socialImage] : undefined
    }
  });
}

export function buildCollectionMetadata({
  title,
  description,
  path,
  keywords = [],
  openGraphTitle,
  openGraphDescription
}) {
  return cleanValue({
    title,
    description,
    keywords,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: withBrandSuffix(openGraphTitle || title),
      description: openGraphDescription || description,
      url: buildPublicUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  });
}

export function buildBreadcrumbStructuredData(items = []) {
  return cleanValue({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  });
}

export function buildFaqStructuredData(faqs = []) {
  if (!faqs.length) {
    return undefined;
  }

  return cleanValue({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  });
}

export function buildArticleStructuredData(type, item) {
  const keywords = buildKeywords(item);
  const canonicalPath = getCanonicalPath(type, item);
  const canonicalUrl = buildPublicUrl(canonicalPath);
  const socialImage = getSocialImageUrl(item);
  const bodyText = getReadableContentText(item);
  const wordCount = bodyText ? bodyText.split(/\s+/g).filter(Boolean).length : undefined;

  return cleanValue({
    "@context": "https://schema.org",
    "@type": item.schemaType || getContentConfig(type).schemaType,
    headline: item.title,
    name: item.title,
    description: item.metaDescription || item.summary,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    image: socialImage ? [socialImage] : undefined,
    datePublished: getPublishedTime(item),
    dateModified: getModifiedTime(item),
    author: buildAuthorSchema(item),
    publisher: buildPublisherSchema(),
    articleSection: item.category,
    keywords: keywords.join(", "),
    about: item.focusKeyword ? [item.focusKeyword] : keywords,
    wordCount,
    timeRequired: item.readingTimeMinutes ? `PT${item.readingTimeMinutes}M` : undefined,
    isAccessibleForFree: true
  });
}

export function buildUseCaseStructuredData(item) {
  const canonicalUrl = buildPublicUrl(getCanonicalPath("use-case", item));
  const keywords = buildKeywords(item);
  const socialImage = getSocialImageUrl(item);

  return cleanValue({
    "@context": "https://schema.org",
    "@type": item.schemaType || "Service",
    name: item.title,
    serviceType: item.shortTitle || item.title,
    description: item.metaDescription || item.summary,
    url: canonicalUrl,
    provider: buildPublisherSchema(),
    areaServed: "Worldwide",
    audience: (item.audience || []).map((group) => ({
      "@type": "Audience",
      audienceType: group
    })),
    image: socialImage ? [socialImage] : undefined,
    category: item.category,
    keywords: keywords.join(", "),
    termsOfService: canonicalUrl
  });
}

export function buildCollectionStructuredData({ title, description, path, items = [] }) {
  return cleanValue({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: buildPublicUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: buildPublicUrl(getCanonicalPath(item.type, item)),
        description: item.summary
      }))
    }
  });
}
