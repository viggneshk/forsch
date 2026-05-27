import {
  APPROVED_BRAND_NAMES,
  APPROVED_CONTACT_EMAILS,
  APPROVED_SITE_HOSTS
} from "./site-config.js";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"')]+/gi;

function trimText(value) {
  return String(value || "").trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeHost(value) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function collectText(value, bucket) {
  if (!value) {
    return;
  }

  if (typeof value === "string") {
    const trimmed = trimText(value);

    if (trimmed) {
      bucket.push(trimmed);
    }

    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, bucket));
    return;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectText(item, bucket));
  }
}

function extractMatches(pattern, values) {
  const matches = [];

  values.forEach((value) => {
    const results = value.match(pattern) || [];
    matches.push(...results);
  });

  return unique(matches);
}

export function validateForschBrandConsistency(entry = {}) {
  const errors = [];
  const warnings = [];
  const textSegments = [];

  [
    entry.summary,
    entry.metaDescription,
    entry.cta,
    entry.body,
    entry.sections,
    entry.takeaways,
    entry.faqs
  ].forEach((value) => collectText(value, textSegments));

  [
    ["brandName", entry.brandName],
    ["organizationName", entry.organizationName],
    ["publisherName", entry.publisherName],
    ["siteName", entry.siteName]
  ].forEach(([label, value]) => {
    const normalizedValue = trimText(value);

    if (normalizedValue && !APPROVED_BRAND_NAMES.includes(normalizedValue)) {
      errors.push(`${label} must use an approved Forsch brand name.`);
    }
  });

  const contactEmail = trimText(entry.contactEmail).toLowerCase();

  if (contactEmail && !APPROVED_CONTACT_EMAILS.includes(contactEmail)) {
    errors.push("contactEmail must use an approved Forsch inbox.");
  }

  [entry.organizationUrl, entry.publisherUrl, entry.canonicalPath]
    .map((value) => trimText(value))
    .filter((value) => value.startsWith("http://") || value.startsWith("https://"))
    .forEach((value) => {
      if (!APPROVED_SITE_HOSTS.includes(normalizeHost(value))) {
        errors.push(`Absolute URL "${value}" must point to an approved Forsch host.`);
      }
    });

  const emailReferences = extractMatches(EMAIL_PATTERN, textSegments)
    .map((value) => value.toLowerCase())
    .filter((value) => !APPROVED_CONTACT_EMAILS.includes(value));

  if (emailReferences.length > 0) {
    errors.push(`Content references unapproved email address(es): ${emailReferences.join(", ")}.`);
  }

  const urlReferences = extractMatches(URL_PATTERN, textSegments).filter((value) => {
    const host = normalizeHost(value);
    return host && !APPROVED_SITE_HOSTS.includes(host);
  });

  if (urlReferences.length > 0) {
    warnings.push(`Content references external URL(s): ${urlReferences.join(", ")}.`);
  }

  return {
    errors,
    warnings,
    valid: errors.length === 0
  };
}
