async function loadCloudflareEnv() {
  try {
    // Avoid a hard dependency during local Node builds while still supporting
    // Cloudflare Worker bindings at runtime.
    const dynamicImport = new Function("specifier", "return import(specifier)");
    const cloudflareModule = await dynamicImport("@opennextjs/cloudflare");
    const context = await cloudflareModule.getCloudflareContext?.({ async: true });

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

