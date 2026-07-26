import {
  adminSessionCookieName,
  validSameOriginMutation,
} from "../../../admin/owner";

export async function POST(request: Request) {
  if (!validSameOriginMutation(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `${adminSessionCookieName()}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
      "cache-control": "no-store",
    },
  });
}
