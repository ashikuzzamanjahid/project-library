import { env } from "cloudflare:workers";
import type { Project } from "../../../data/projects";
import {
  deleteProject,
  getAllProjects,
  getLibraryProject,
  saveProject,
} from "../../../data/project-store";
import {
  requireApiOwner,
  validSameOriginMutation,
} from "../../../admin/owner";

function hasProjectTitle(value: unknown): value is Partial<Project> & {
  title: string;
} {
  if (!value || typeof value !== "object") return false;
  return Boolean((value as Partial<Project>).title?.trim());
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `project-${Date.now()}`
  );
}

function cleanList(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function safePublicUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeProject(value: Partial<Project> & { title: string }): Project {
  const features = Array.isArray(value.features)
    ? value.features
        .map((item) => ({
          title: typeof item?.title === "string" ? item.title.trim() : "",
          description:
            typeof item?.description === "string"
              ? item.description.trim()
              : "",
        }))
        .filter((item) => item.title || item.description)
    : [];
  const questions = Array.isArray(value.questions)
    ? value.questions
        .map((item) => ({
          question:
            typeof item?.question === "string" ? item.question.trim() : "",
          answer: typeof item?.answer === "string" ? item.answer.trim() : "",
        }))
        .filter((item) => item.question && item.answer)
    : [];
  const screenshots = Array.isArray(value.screenshots)
    ? value.screenshots.filter(
        (item) =>
          typeof item?.src === "string" &&
          (item.src.startsWith("/api/media?key=") ||
            item.src.startsWith("/projects/") ||
            item.src.startsWith("https://")),
      )
    : [];

  return {
    slug:
      value.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)
        ? value.slug
        : slugify(value.title),
    number: value.number || "00",
    title: value.title.trim(),
    summary: value.summary?.trim() || "Project notes are being prepared.",
    category: value.category?.trim() || "Uncategorized",
    status: value.status ?? "Prototype",
    technologies: cleanList(value.technologies),
    capabilities: cleanList(value.capabilities),
    proof: value.proof?.trim() ?? "",
    year: value.year?.trim() || String(new Date().getFullYear()),
    accent: value.accent ?? "blue",
    problem: value.problem?.trim() ?? "",
    solution: value.solution?.trim() ?? "",
    contribution: value.contribution?.trim() ?? "",
    result: value.result?.trim() ?? "",
    repository: safePublicUrl(value.repository),
    demo: safePublicUrl(value.demo),
    documentation: safePublicUrl(value.documentation),
    role: value.role?.trim() || undefined,
    updatedAt: value.updatedAt?.trim() || undefined,
    overview: cleanList(value.overview),
    features,
    screenshots,
    architecture: cleanList(value.architecture),
    installation: cleanList(value.installation),
    usage: cleanList(value.usage),
    challenges: value.challenges ?? [],
    nextSteps: cleanList(value.nextSteps),
    questions,
  };
}

export async function GET(request: Request) {
  const owner = await requireApiOwner(request);
  if (!owner) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ projects: await getAllProjects() });
}

export async function POST(request: Request) {
  const owner = await requireApiOwner(request);
  if (!owner) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!validSameOriginMutation(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid project data." }, { status: 400 });
  }
  if (!hasProjectTitle(input)) {
    return Response.json(
      { error: "A project title is required." },
      { status: 400 },
    );
  }

  const project = normalizeProject(input);
  await saveProject(project, owner.email);
  return Response.json({ project });
}

export async function DELETE(request: Request) {
  const owner = await requireApiOwner(request);
  if (!owner) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!validSameOriginMutation(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: "Project slug is required." }, { status: 400 });
  }

  const existing = await getLibraryProject(slug);
  await deleteProject(slug);

  const mediaKeys = (existing?.screenshots ?? []).flatMap((screenshot) => {
    if (!screenshot.src.startsWith("/api/media?")) return [];
    const key = new URL(screenshot.src, request.url).searchParams.get("key");
    return key?.startsWith(`projects/${slug}/`) ? [key] : [];
  });
  if (mediaKeys.length) await env.MEDIA.delete(mediaKeys);

  return Response.json({ deleted: slug });
}
