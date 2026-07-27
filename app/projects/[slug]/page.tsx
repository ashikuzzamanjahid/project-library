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

  const coreFunctionBoxes = project.coreFunctionBoxes?.length
    ? project.coreFunctionBoxes
    : project.features?.length
      ? [
          project.features
            .map((feature) =>
              feature.description
                ? `${feature.title}: ${feature.description}`
                : feature.title,
            )
            .join("\n\n"),
        ]
      : [project.capabilities.join("\n")].filter(Boolean);
  const customSections = project.customSections ?? [];
  const questionsNumber = String(customSections.length + 4).padStart(2, "0");

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
              <div className="core-function-boxes">
                {coreFunctionBoxes.length ? (
                  coreFunctionBoxes.map((content, index) => (
                    <div className="compact-function-list" key={index}>
                      <p className="core-functions-text">{content}</p>
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
                      unoptimized
                    />
                    <figcaption>{screenshot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="library-callout">
                <strong>Screenshots have not been added yet.</strong>
                <p>
                  The owner can upload project images and captions through the
                  private editor.
                </p>
              </div>
            )}
          </section>

          {customSections.map((section, sectionIndex) => (
            <section
              className="project-custom-section"
              key={`${section.title}-${sectionIndex}`}
            >
              <header className="custom-section-heading">
                <span>{String(sectionIndex + 4).padStart(2, "0")}</span>
                <div>
                  <h2>{section.title || "Project notes"}</h2>
                  {section.description && <p>{section.description}</p>}
                </div>
              </header>

              {section.boxes.length > 0 && (
                <div className="project-content-boxes">
                  {section.boxes.map((box, boxIndex) => (
                    <article
                      className="project-content-box"
                      key={`${box.title}-${boxIndex}`}
                    >
                      {(box.title || box.highlight) && (
                        <header>
                          {box.title && <h3>{box.title}</h3>}
                          {box.highlight && (
                            <strong className="content-box-highlight">
                              {box.highlight}
                            </strong>
                          )}
                        </header>
                      )}
                      {box.content && <p>{box.content}</p>}
                      {box.images.length > 0 && (
                        <div className="content-box-images">
                          {box.images.map((image, imageIndex) => (
                            <figure key={`${image.src}-${imageIndex}`}>
                              <Image
                                src={image.src}
                                alt={image.alt}
                                width={image.width}
                                height={image.height}
                                sizes="(max-width: 720px) 92vw, 520px"
                                unoptimized
                              />
                              {image.caption && (
                                <figcaption>{image.caption}</figcaption>
                              )}
                            </figure>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}

          {project.questions?.length ? (
            <section className="project-questions">
              <div className="questions-heading">
                <span>{questionsNumber}</span>
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
