import { useCaseLibrary } from "./use-cases/data";

export default function sitemap() {
  const baseEntries = [
    {
      url: "https://forsch.io",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: "https://forsch.io/use-cases",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9
    }
  ];

  const useCaseEntries = useCaseLibrary.map((item) => ({
    url: `https://forsch.io/use-cases/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...baseEntries, ...useCaseEntries];
}
