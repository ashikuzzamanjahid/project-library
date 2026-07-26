import { env } from "cloudflare:workers";
import type { Project } from "./projects";
import { projects as fileProjects } from "./projects";

type ProjectRow = {
  data: string;
};

function database() {
  if (!env.DB) throw new Error("Project database is unavailable.");
  return env.DB;
}

let schemaReady: Promise<void> | null = null;

function ensureProjectSchema() {
  schemaReady ??= (async () => {
    const db = database();
    await db.batch([
      db.prepare(
        `CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          data TEXT NOT NULL,
          owner_email TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )`,
      ),
      db.prepare(
        `CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        )`,
      ),
      db.prepare(
        "CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique ON projects (slug)",
      ),
    ]);
  })();
  return schemaReady;
}

export async function getStoredProjects(): Promise<Project[]> {
  try {
    await ensureProjectSchema();
    const result = await database()
      .prepare("SELECT data FROM projects ORDER BY updated_at DESC")
      .all<ProjectRow>();

    return result.results.flatMap((row) => {
      try {
        return [JSON.parse(row.data) as Project];
      } catch {
        return [];
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("no such table")) return [];
    throw error;
  }
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
  try {
    await ensureProjectSchema();
    const row = await database()
      .prepare("SELECT data FROM projects WHERE slug = ?")
      .bind(slug)
      .first<ProjectRow>();
    if (row) return JSON.parse(row.data) as Project;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("no such table")) throw error;
  }

  return fileProjects.find((project) => project.slug === slug) ?? null;
}

export async function saveProject(project: Project, ownerEmail: string) {
  await ensureProjectSchema();
  const now = Math.floor(Date.now() / 1000);
  await database()
    .prepare(
      `INSERT INTO projects (slug, data, owner_email, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         data = excluded.data,
         owner_email = excluded.owner_email,
         updated_at = excluded.updated_at`,
    )
    .bind(project.slug, JSON.stringify(project), ownerEmail, now, now)
    .run();
}

export async function deleteProject(slug: string) {
  await ensureProjectSchema();
  await database()
    .prepare("DELETE FROM projects WHERE slug = ?")
    .bind(slug)
    .run();
}
