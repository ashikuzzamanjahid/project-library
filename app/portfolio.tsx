"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "./data/projects";
import { LibrarySidebar } from "./library-sidebar";

export function Portfolio({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.category))),
  ];

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory =
        category === "All" || project.category === category;
      const searchable = [
        project.title,
        project.summary,
        project.category,
        ...project.technologies,
        ...project.capabilities,
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [category, projects, query]);

  return (
    <div className="library-layout">
      <LibrarySidebar projects={projects} />

      <main className="library-main" id="top">
        <header className="library-topbar">
          <div>
            <span>ashikuzzamanjahid</span>
            <span>/</span>
            <strong>projects</strong>
          </div>
          <a href="https://github.com/ashikuzzamanjahid" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </header>

        <div className="library-content">
          <section className="library-intro">
            <p className="page-kicker">PERSONAL PROJECT ARCHIVE</p>
            <h1>Project Library</h1>
            <p>
              A browsable collection of things I have built and explored.
              Open any entry to read what it does, how it works, the decisions
              behind it, and the current state of the project.
            </p>
            <dl>
              <div>
                <dt>Projects</dt>
                <dd>{projects.length}</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>{categories.length - 1}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Open notes</dd>
              </div>
            </dl>
          </section>

          <section className="library-index" id="projects">
            <div className="index-heading">
              <div>
                <h2>All projects</h2>
                <p>{visibleProjects.length} entries in this view</p>
              </div>
              <label className="library-search">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search projects, tools, or topics"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search projects"
                />
              </label>
            </div>

            <div className="library-filters" aria-label="Filter projects">
              {categories.map((item) => (
                <button
                  className={category === item ? "active" : ""}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="project-table" role="table" aria-label="Project library">
              <div className="project-table-head" role="row">
                <span role="columnheader">Project</span>
                <span role="columnheader">Category</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Updated</span>
              </div>

              {visibleProjects.map((project) => (
                <Link
                  className="project-row"
                  href={`/projects/${project.slug}`}
                  key={project.slug}
                  role="row"
                >
                  <div role="cell">
                    <span className={`row-mark accent-${project.accent}`}>
                      {project.number}
                    </span>
                    <div>
                      <strong>{project.title}</strong>
                      <p>{project.summary}</p>
                      <ul aria-label="Technologies">
                        {project.technologies.slice(0, 3).map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span role="cell">{project.category}</span>
                  <span role="cell">
                    <i className="status-dot" /> {project.status}
                  </span>
                  <span role="cell">
                    {project.updatedAt ?? project.year} <b>→</b>
                  </span>
                </Link>
              ))}
            </div>

            {visibleProjects.length === 0 && (
              <div className="library-empty">
                <strong>No entries found.</strong>
                <p>Try another search term or category.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section className="library-about" id="about">
            <div>
              <p className="page-kicker">ABOUT THE LIBRARY</p>
              <h2>Why keep these notes?</h2>
            </div>
            <div>
              <p>
                A repository shows the code. This library adds the missing
                context: the original question, the intended use, the important
                functions, the implementation choices, and what remains
                unfinished.
              </p>
              <p>
                Entries are living notes. They can change as the project grows
                or as I understand the problem better.
              </p>
            </div>
          </section>

          <footer className="library-footer">
            <span>Project Library · Updated as projects evolve</span>
            <a href="#top">Top ↑</a>
          </footer>
        </div>
      </main>
    </div>
  );
}
