"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  requireAdminAuth,
  validateAdminCredentials
} from "../../lib/admin-auth";
import { deleteContentItem, saveContentItem } from "../../lib/content-store";

const sectionToType = {
  "use-cases": "use-case",
  blog: "blog",
  articles: "article"
};

function getPublicBasePath(type) {
  if (type === "use-case") return "/use-cases";
  if (type === "blog") return "/blog";
  return "/articles";
}

export async function saveContentAction(formData) {
  await requireAdminAuth();

  const section = String(formData.get("section") || "").trim();
  const type = sectionToType[section];

  if (!type) {
    redirect("/admin");
  }

  const savedItem = await saveContentItem(type, formData);
  const publicBasePath = getPublicBasePath(type);

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/use-cases");
  revalidatePath("/blog");
  revalidatePath("/articles");
  revalidatePath("/admin");
  revalidatePath(`/admin/${section}`);
  revalidatePath(publicBasePath);
  revalidatePath(`${publicBasePath}/${savedItem.slug}`);

  redirect(`/admin/${section}`);
}

export async function deleteContentAction(formData) {
  await requireAdminAuth();

  const section = String(formData.get("section") || "").trim();
  const id = String(formData.get("id") || "").trim();
  const type = sectionToType[section];

  if (!type || !id) {
    redirect("/admin");
  }

  await deleteContentItem(type, id);

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/use-cases");
  revalidatePath("/blog");
  revalidatePath("/articles");
  revalidatePath("/admin");
  revalidatePath(`/admin/${section}`);

  redirect(`/admin/${section}`);
}

export async function loginAdminAction(formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!validateAdminCredentials(username, password)) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
