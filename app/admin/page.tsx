import { getAllProjects } from "../data/project-store";
import { ProjectEditor } from "./project-editor";
import { requireSiteOwner } from "./owner";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireSiteOwner("/admin");
  const projects = await getAllProjects();

  return (
    <ProjectEditor
      initialProjects={projects}
      ownerName={user.displayName}
    />
  );
}
