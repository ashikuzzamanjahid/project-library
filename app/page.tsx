import { getAllProjects } from "./data/project-store";
import { Portfolio } from "./portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getAllProjects();
  return <Portfolio projects={projects} />;
}
