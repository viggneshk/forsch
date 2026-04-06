import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "forsch_admin_session";

function getConfig() {
  const username = process.env.ADMIN_USERNAME || "";
  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || password;

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

export function isAdminConfigured() {
  return getConfig().configured;
}

export async function isAdminAuthenticated() {
  const config = getConfig();

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
  const configured = isAdminConfigured();

  if (!configured) {
    redirect("/admin/login?error=missing-config");
  }

  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}

export async function createAdminSession() {
  const config = getConfig();
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

export function validateAdminCredentials(username, password) {
  const config = getConfig();

  return config.configured && username === config.username && password === config.password;
}
