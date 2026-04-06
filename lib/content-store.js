import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const contentFilePath = path.join(process.cwd(), "data", "content-library.json");

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
  const file = await readFile(contentFilePath, "utf8");
  return JSON.parse(file);
}

export async function writeContentStore(content) {
  await writeFile(contentFilePath, JSON.stringify(content, null, 2) + "\n", "utf8");
}

export async function getContentCollection(type) {
  const content = await readContentStore();
  return content[contentTypeMap[type]] || [];
}

export async function getContentItem(type, slug) {
  const collection = await getContentCollection(type);
  return collection.find((item) => item.slug === slug);
}

export async function saveContentItem(type, formData) {
  const content = await readContentStore();
  const collectionKey = contentTypeMap[type];
  const existingCollection = content[collectionKey] || [];
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

  const filteredCollection = existingCollection.filter((item) =>
    originalId ? item.id !== originalId : item.id !== nextItem.id
  );

  content[collectionKey] = [nextItem, ...filteredCollection];
  await writeContentStore(content);

  return nextItem;
}

export async function deleteContentItem(type, id) {
  const content = await readContentStore();
  const collectionKey = contentTypeMap[type];
  content[collectionKey] = (content[collectionKey] || []).filter((item) => item.id !== id);
  await writeContentStore(content);
}
