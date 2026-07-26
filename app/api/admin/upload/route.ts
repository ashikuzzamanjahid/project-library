import { env } from "cloudflare:workers";
import {
  requireApiOwner,
  validSameOriginMutation,
} from "../../../admin/owner";

const MAX_IMAGE_BYTES = 900 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const owner = await requireApiOwner(request);
  if (!owner) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!validSameOriginMutation(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const slug = String(formData.get("slug") ?? "");
  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));

  if (!(file instanceof File) || !slug) {
    return Response.json(
      { error: "Choose an image and project first." },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
    return Response.json(
      { error: "Use a PNG, JPEG, WebP, or GIF image under 900 KB." },
      { status: 400 },
    );
  }

  const safeSlug = slug.replace(/[^a-z0-9-]/g, "");
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
  const key = `projects/${safeSlug}/${crypto.randomUUID()}-${safeName}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { owner: owner.email },
  });

  return Response.json({
    screenshot: {
      src: `/api/media?key=${encodeURIComponent(key)}`,
      alt: "",
      caption: "",
      width: Number.isFinite(width) && width > 0 ? Math.round(width) : 1600,
      height: Number.isFinite(height) && height > 0 ? Math.round(height) : 1000,
    },
  });
}
