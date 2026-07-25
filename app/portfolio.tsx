"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, projects } from "./data/projects";

export function Portfolio() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

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
  }, [category, query]);

  return (
    <main id="top">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="AI Systems Portfolio home">
          <span className="wordmark-dot" />
          AI SYSTEMS / PORTFOLIO
        </Link>
        <nav aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="mailto:hello@example.com">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">AI · ML · DATA · AUTOMATION</p>
          <h1 id="hero-heading">
            Ideas into
            <span>working systems.</span>
          </h1>
          <p className="hero-intro">
            A curated lab of practical tools, intelligent workflows, and
            experiments—built to solve real problems, not just fill a
            repository.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#projects">
              Explore the work <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#about">
              About this lab <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <aside className="lab-note" aria-label="Lab status">
          <div className="lab-note-top">
            <span>LAB_NOTE_001</span>
            <span className="live-indicator">
              <i /> BUILDING
            </span>
          </div>
          <p className="lab-quote">
            “The interesting part isn&apos;t the model. It&apos;s the system
            around it.”
          </p>
          <div className="lab-stats">
            <div>
              <strong>{projects.length.toString().padStart(2, "0")}</strong>
              <span>Case studies</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Core disciplines</span>
            </div>
          </div>
          <div className="signal-lines" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
        </aside>
      </section>

      <div className="ticker" aria-label="Areas of focus">
        {["RAG", "COMPUTER VISION", "DATA SYSTEMS", "AUTOMATION", "APIs"].map(
          (item) => (
            <span key={item}>
              <i aria-hidden="true">✦</i> {item}
            </span>
          ),
        )}
      </div>

      <section className="projects-section" id="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK / 2025—26</p>
            <h2>Project index</h2>
          </div>
          <p>
            Each case study covers the problem, the decisions, and what the
            build proved.
          </p>
        </div>

        <div className="project-tools">
          <div className="filter-list" aria-label="Filter by category">
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
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              placeholder="Search the lab"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="project-grid" aria-live="polite">
          {visibleProjects.map((project) => (
            <article
              className={`project-card accent-${project.accent}`}
              key={project.slug}
            >
              <div className="project-card-top">
                <span>{project.number}</span>
                <span>{project.year}</span>
              </div>
              <div className="project-visual" aria-hidden="true">
                <div className="visual-grid" />
                <span className="visual-label">{project.category}</span>
                <div className="visual-orbit">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="project-content">
                <div className="project-meta">
                  <span>{project.status}</span>
                  <span>{project.proof}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul aria-label="Technologies">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <Link href={`/projects/${project.slug}`}>
                  Read case study <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <div className="empty-state">
            <span>NO SIGNAL</span>
            <p>No projects match that search yet.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <p className="eyebrow">ABOUT / THE PRACTICE</p>
        <div>
          <h2>Building the useful layer between models and people.</h2>
          <div className="about-copy">
            <p>
              This portfolio documents applied AI work as systems: the data
              moving through them, the interfaces people depend on, and the
              trade-offs behind the result.
            </p>
            <p>
              The current focus is reliable AI applications, observable data
              workflows, and small tools that remove repetitive work.
            </p>
            <a href="mailto:hello@example.com">
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <Link className="wordmark" href="/">
          <span className="wordmark-dot" />
          AI SYSTEMS / PORTFOLIO
        </Link>
        <p>Curiosity, made concrete.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
