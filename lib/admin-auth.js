import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRuntimeEnv } from "./runtime-env";

const ADMIN_COOKIE_NAME = "forsch_admin_session";

async function getConfig() {
  const env = await getRuntimeEnv();
  const username = env.ADMIN_USERNAME || "";
  const password = env.ADMIN_PASSWORD || "";
  const secret = env.ADMIN_SESSION_SECRET || password;

  return {
    username,
    password,
    secret,
    configured: Boolean(username && password)
  };
}

function buildToken(username, password, secret) {
  return createHmac("sha256", secret).update(`${username}:${password}`).digest("hex");
}

export async function isAdminConfigured() {
  return (await getConfig()).configured;
}

export async function isAdminAuthenticated() {
  const config = await getConfig();

  if (!config.configured) {
    return false;
  }

  const sessionCookie = (await cookies()).get(ADMIN_COOKIE_NAME)?.value || "";
  const expected = buildToken(config.username, config.password, config.secret);

  if (!sessionCookie || sessionCookie.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(sessionCookie), Buffer.from(expected));
}

export async function requireAdminAuth() {
  const configured = await isAdminConfigured();

  if (!configured) {
    redirect("/admin/login?error=missing-config");
  }

  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}

export async function createAdminSession() {
  const config = await getConfig();
  const token = buildToken(config.username, config.password, config.secret);

  (await cookies()).set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  (await cookies()).set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
}

export async function validateAdminCredentials(username, password) {
  const config = await getConfig();

  return config.configured && username === config.username && password === config.password;
}
