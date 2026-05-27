import {
  getContentLastModified
} from "../lib/content-model";
import { getPublicContentCollection } from "../lib/content-store";
import {
  buildPublicUrl,
  getCanonicalPath,
  getCollectionPath
} from "../lib/site-config";

function getLatestModifiedDate(items = []) {
  const timestamps = items
    .map((item) => getContentLastModified(item))
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return new Date();
  }

  return new Date(Math.max(...timestamps));
}

function buildCollectionEntry(path, items, priority) {
  return {
    url: buildPublicUrl(path),
    lastModified: getLatestModifiedDate(items),
    changeFrequency: "weekly",
    priority
  };
}

function buildContentEntries(type, items) {
  return items.map((item) => ({
    url: buildPublicUrl(getCanonicalPath(type, item)),
    lastModified: new Date(getContentLastModified(item) || Date.now()),
    changeFrequency: item.sitemapChangeFrequency,
    priority: item.sitemapPriority
  }));
}

export default async function sitemap() {
  const useCases = await getPublicContentCollection("use-case", {
    indexableOnly: true
  });
  const blogPosts = await getPublicContentCollection("blog", {
    indexableOnly: true
  });
  const articles = await getPublicContentCollection("article", {
    indexableOnly: true
  });

  return [
    {
      url: buildPublicUrl("/"),
      lastModified: getLatestModifiedDate([...useCases, ...blogPosts, ...articles]),
      changeFrequency: "weekly",
      priority: 1
    },
    buildCollectionEntry(getCollectionPath("use-case"), useCases, 0.9),
    buildCollectionEntry(getCollectionPath("blog"), blogPosts, 0.8),
    buildCollectionEntry(getCollectionPath("article"), articles, 0.8),
    ...buildContentEntries("use-case", useCases),
    ...buildContentEntries("blog", blogPosts),
    ...buildContentEntries("article", articles)
  ];
}
