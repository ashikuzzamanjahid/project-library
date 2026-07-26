import { Redis } from "@upstash/redis";
import type { Project } from "./projects";
import { projects as fileProjects } from "./projects";

const PROJECTS_KEY = "project-library:projects";

function database() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    throw new Error("Project database is unavailable.");
  }
  return Redis.fromEnv();
}

export async function getStoredProjects(): Promise<Project[]> {
  const records =
    await database().hgetall<Record<string, Project>>(PROJECTS_KEY);
  return records ? Object.values(records) : [];
}

export async function getAllProjects(): Promise<Project[]> {
  const stored = await getStoredProjects();
  const storedSlugs = new Set(stored.map((project) => project.slug));
  return [
    ...stored,
    ...fileProjects.filter((project) => !storedSlugs.has(project.slug)),
  ];
}

export async function getLibraryProject(slug: string): Promise<Project | null> {
  const stored = await database().hget<Project>(PROJECTS_KEY, slug);
  if (stored) return stored;

  return fileProjects.find((project) => project.slug === slug) ?? null;
}

export async function saveProject(project: Project, ownerEmail: string) {
  void ownerEmail;
  await database().hset(PROJECTS_KEY, { [project.slug]: project });
}

export async function deleteProject(slug: string) {
  await database().hdel(PROJECTS_KEY, slug);
}
