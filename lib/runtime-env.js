import { getCloudflareContext } from "@opennextjs/cloudflare";

async function loadCloudflareEnv() {
  try {
    const context = await getCloudflareContext({ async: true });
    return context?.env || {};
  } catch {
    return {};
  }
}

export async function getRuntimeEnv() {
  const processEnv = typeof process !== "undefined" ? process.env || {} : {};
  const cloudflareEnv = await loadCloudflareEnv();

  return {
    ...processEnv,
    ...cloudflareEnv
  };
}
