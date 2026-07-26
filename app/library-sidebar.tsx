import Link from "next/link";
import type { Project } from "./data/projects";
import { ThemeToggle } from "./theme-toggle";

export function LibrarySidebar({ projects }: { projects: Project[] }) {
  return (
    <aside className="library-sidebar">
      <Link className="library-brand" href="/">
        <span>AJ</span>
        <div>
          <strong>Project Library</strong>
          <small>Notes, code & experiments</small>
        </div>
      </Link>

      <nav aria-label="Library navigation">
        <p>Library</p>
        <Link href="/#projects">
          <span>▦</span> All projects
          <small>{projects.length}</small>
        </Link>
        <Link href="/#about">
          <span>◌</span> About this library
        </Link>
      </nav>

      <div className="sidebar-note">
        <span>LIBRARY NOTE</span>
        <p>
          Each entry explains what a project does, how it works, and what I
          learned while building it.
        </p>
      </div>
      <Link className="owner-editor-link" href="/admin">
        <span aria-hidden="true">▣</span>
        Owner editor
      </Link>
      <ThemeToggle />
    </aside>
  );
}
