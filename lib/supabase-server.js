import { createClient } from "@supabase/supabase-js";

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    url,
    serviceRoleKey,
    configured: Boolean(url && serviceRoleKey)
  };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig().configured;
}

export function getSupabaseAdminClient() {
  const config = getSupabaseConfig();

  if (!config.configured) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
