import { requireApiOwner } from "../../../../admin/owner";
import { getAllProjects } from "../../../../data/project-store";

export async function GET(request: Request) {
  const owner = await requireApiOwner(request);
  if (!owner) {
    return Response.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: { "cache-control": "no-store" },
      },
    );
  }

  const exportedAt = new Date().toISOString();
  const backup = {
    format: "project-library-backup",
    version: 1,
    exportedAt,
    projects: await getAllProjects(),
  };
  const filename = `project-library-backup-${exportedAt.slice(0, 10)}.json`;

  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
