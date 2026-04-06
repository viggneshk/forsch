import { getContentCollection } from "../lib/content-store";

export default async function sitemap() {
  const useCases = await getContentCollection("use-case");
  const blogPosts = await getContentCollection("blog");
  const articles = await getContentCollection("article");

  const baseEntries = [
    {
      url: "https://forsch.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://forsch.io/use-cases",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: "https://forsch.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: "https://forsch.io/articles",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];

  const contentEntries = [
    ...useCases.map((item) => ({
      url: `https://forsch.io/use-cases/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    })),
    ...blogPosts.map((item) => ({
      url: `https://forsch.io/blog/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    })),
    ...articles.map((item) => ({
      url: `https://forsch.io/articles/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    }))
  ];

  return [...baseEntries, ...contentEntries];
}
