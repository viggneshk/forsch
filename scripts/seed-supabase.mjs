import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const contentFilePath = path.join(process.cwd(), "data", "content-library.json");
const raw = await readFile(contentFilePath, "utf8");
const content = JSON.parse(raw);

const rows = [
  ...(content.useCases || []).map((item) => mapItemToRow(item)),
  ...(content.blogPosts || []).map((item) => mapItemToRow(item)),
  ...(content.articles || []).map((item) => mapItemToRow(item))
];

const { error } = await supabase.from("content_entries").upsert(rows, {
  onConflict: "id"
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} content entries into Supabase.`);

function mapItemToRow(item) {
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
