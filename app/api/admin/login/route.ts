import {
  adminIsConfigured,
  adminSessionCookieName,
  createAdminSession,
  validSameOriginMutation,
  verifyAdminPassword,
} from "../../../admin/owner";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const attempts = new Map<string, { failures: number; resetAt: number }>();

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function clientKey(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}

export async function POST(request: Request) {
  if (!adminIsConfigured()) {
    return json(
      { error: "The admin password has not been configured yet." },
      503,
    );
  }
  if (!validSameOriginMutation(request)) {
    return json({ error: "Invalid request origin." }, 403);
  }

  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.failures >= MAX_FAILURES) {
    return json(
      { error: "Too many attempts. Try again in about 15 minutes." },
      429,
    );
  }
  if (current && current.resetAt <= now) attempts.delete(key);

  let payload: { password?: string };
  try {
    payload = (await request.json()) as { password?: string };
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (
    typeof payload.password !== "string" ||
    payload.password.length > 256
  ) {
    return json({ error: "Incorrect password." }, 401);
  }
  if (!payload.password || !(await verifyAdminPassword(payload.password))) {
    const previous =
      attempts.get(key)?.resetAt && attempts.get(key)!.resetAt > now
        ? attempts.get(key)!.failures
        : 0;
    attempts.set(key, {
      failures: previous + 1,
      resetAt: now + WINDOW_MS,
    });
    await new Promise((resolve) => setTimeout(resolve, 400));
    return json({ error: "Incorrect password." }, 401);
  }

  attempts.delete(key);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const session = await createAdminSession();
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `${adminSessionCookieName()}=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure}`,
      "cache-control": "no-store",
    },
  });
}
