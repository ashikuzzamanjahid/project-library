import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getLibraryProject } from "../../data/project-store";
import { LibrarySidebar } from "../../library-sidebar";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getLibraryProject(slug);
  return project
    ? { title: project.title, description: project.summary }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getLibraryProject(slug);
  const projects = await getAllProjects();

  if (!project) notFound();

  const features =
    project.features?.length
      ? project.features
      :
    project.capabilities.map((capability) => ({
      title: capability,
      description: `A core function of the ${project.title} project.`,
    }));

  return (
    <div className="library-layout">
      <LibrarySidebar projects={projects} />

      <main className="library-main project-entry" id="top">
        <header className="library-topbar">
          <div>
            <Link href="/">projects</Link>
            <span>/</span>
            <strong>{project.slug}</strong>
          </div>
          <Link href="/#projects">← Back to index</Link>
        </header>

        <article className="compact-entry">
          <header className="compact-header">
            <div className="entry-label">
              <span className={`row-mark accent-${project.accent}`}>
                {project.number}
              </span>
              <span>{project.category}</span>
              <span>·</span>
              <span>
                <i className="status-dot" /> {project.status}
              </span>
            </div>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <div className="entry-links">
              {project.repository && (
                <a href={project.repository} target="_blank" rel="noreferrer">
                  Source code ↗
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer">
                  Live demo ↗
                </a>
              )}
              {project.documentation && (
                <a href={project.documentation} target="_blank" rel="noreferrer">
                  Documentation ↗
                </a>
              )}
            </div>
          </header>

          <dl className="compact-properties">
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{project.role ?? "Design and development"}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{project.proof}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{project.updatedAt ?? project.year}</dd>
            </div>
          </dl>

          <div className="fundamentals-grid">
            <section className="fundamental-brief">
              <div className="section-label">
                <span>01</span>
                <h2>Project brief</h2>
              </div>
              {project.problem || project.solution ? (
                <>
                  {project.problem && <p>{project.problem}</p>}
                  {project.solution && <p>{project.solution}</p>}
                </>
              ) : (
                <p className="empty-note">
                  A detailed project brief has not been added yet.
                </p>
              )}
              <div className="technology-line">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </section>

            <section className="fundamental-functions">
              <div className="section-label">
                <span>02</span>
                <h2>Core functions</h2>
              </div>
              <div className="compact-function-list">
                {features.length ? (
                  features.map((feature) => (
                    <div key={feature.title}>
                      <strong>{feature.title}</strong>
                      <p>{feature.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-note">
                    Functions have not been documented yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          <section className="compact-screenshots">
            <div className="section-label">
              <span>03</span>
              <h2>Screenshots</h2>
            </div>
            {project.screenshots?.length ? (
              <div className="screenshot-strip">
                {project.screenshots.map((screenshot) => (
                  <figure key={screenshot.src}>
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={screenshot.width}
                      height={screenshot.height}
                      sizes="(max-width: 900px) 90vw, 680px"
                      unoptimized={screenshot.src.startsWith("/api/media?key=")}
                    />
                    <figcaption>{screenshot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="library-callout">
                <strong>Screenshots have not been added yet.</strong>
                <p>
                  Add images under{" "}
                  <code>public/projects/{project.slug}/</code> and list them in
                  the project&apos;s screenshot field.
                </p>
              </div>
            )}
          </section>

          {project.questions?.length ? (
            <section className="project-questions">
              <div className="questions-heading">
                <span>04</span>
                <div>
                  <h2>Questions and notes</h2>
                  <p>Open a question to read the additional project notes.</p>
                </div>
              </div>

              {project.questions.map((item) => (
                <details key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <div className="dropdown-answer">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </section>
          ) : null}

          <footer className="entry-footer">
            <Link href="/#projects">← Browse the project index</Link>
            <a href="#top">Top ↑</a>
          </footer>
        </article>
      </main>
    </div>
  );
}
