import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "project_library_admin";
const SESSION_SECONDS = 8 * 60 * 60;

type AdminSecrets = {
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
};

function secrets(): AdminSecrets {
  return {
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  };
}

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function passwordHash(password: string) {
  return bytesToHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
  );
}

async function sessionSignature(expires: string) {
  const secret = secrets().ADMIN_SESSION_SECRET;
  if (!secret) return "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToHex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(expires)),
  );
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

export function adminIsConfigured() {
  return Boolean(
    secrets().ADMIN_PASSWORD_HASH && secrets().ADMIN_SESSION_SECRET,
  );
}

export async function verifyAdminPassword(password: string) {
  const expected = secrets().ADMIN_PASSWORD_HASH;
  if (!expected) return false;
  return constantTimeEqual(await passwordHash(password), expected);
}

export async function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${await sessionSignature(expires)}`;
}

export async function validAdminSession(value?: string | null) {
  if (!value || !adminIsConfigured()) return false;
  const [expires, signature, extra] = value.split(".");
  if (!expires || !signature || extra) return false;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  return constantTimeEqual(signature, await sessionSignature(expires));
}

export async function requireSiteOwner(returnTo = "/admin") {
  const cookieStore = await cookies();
  const valid = await validAdminSession(
    cookieStore.get(SESSION_COOKIE)?.value,
  );
  if (!valid) {
    redirect(`/admin/login?return_to=${encodeURIComponent(returnTo)}`);
  }
  return { displayName: "Site owner", email: "admin" };
}

export async function requireApiOwner(request?: Request) {
  const cookieHeader =
    request?.headers.get("cookie") ??
    (await cookies()).get(SESSION_COOKIE)?.value ??
    "";
  const value = request
    ? cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${SESSION_COOKIE}=`))
        ?.slice(SESSION_COOKIE.length + 1)
    : cookieHeader;
  return (await validAdminSession(value))
    ? { displayName: "Site owner", email: "admin" }
    : null;
}

export function adminSessionCookieName() {
  return SESSION_COOKIE;
}

export function validSameOriginMutation(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}
