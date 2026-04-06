import { createClient } from "@supabase/supabase-js";
import { getRuntimeEnv } from "./runtime-env";

export async function getSupabaseConfig() {
  const env = await getRuntimeEnv();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    url,
    serviceRoleKey,
    configured: Boolean(url && serviceRoleKey)
  };
};
export async function isSupabaseConfigured() {
  return (await getSupabaseConfig()).configured;
}

export async function getSupabaseAdminClient() {
  const config = await getSupabaseConfig();

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
