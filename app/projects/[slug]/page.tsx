import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project
    ? { title: project.title, description: project.summary }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <main className="case-study">
      <header className="site-header">
        <Link className="wordmark" href="/">
          <span className="wordmark-dot" />
          AI SYSTEMS / PORTFOLIO
        </Link>
        <nav aria-label="Project navigation">
          <Link href="/#projects">All projects</Link>
          <a className="nav-contact" href="mailto:hello@example.com">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="case-hero">
        <div className="case-index">
          <span>PROJECT / {project.number}</span>
          <span>{project.year}</span>
        </div>
        <p className="eyebrow">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-tags">
          <span>{project.status}</span>
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>

      <div className={`case-visual accent-${project.accent}`} aria-hidden="true">
        <div className="case-visual-grid" />
        <div className="case-signal">
          <span>INPUT</span>
          <i />
          <strong>{project.capabilities[0]}</strong>
          <i />
          <span>OUTPUT</span>
        </div>
      </div>

      <section className="case-body">
        <aside>
          <p className="eyebrow">CASE STUDY</p>
          <a href="#problem">01 / Problem</a>
          <a href="#solution">02 / Solution</a>
          <a href="#contribution">03 / Contribution</a>
          <a href="#result">04 / Result</a>
        </aside>
        <div className="case-sections">
          <article id="problem">
            <span>01</span>
            <div>
              <p className="eyebrow">THE PROBLEM</p>
              <h2>Why this needed to exist</h2>
              <p>{project.problem}</p>
            </div>
          </article>
          <article id="solution">
            <span>02</span>
            <div>
              <p className="eyebrow">THE APPROACH</p>
              <h2>From friction to system</h2>
              <p>{project.solution}</p>
              <ul className="capability-list">
                {project.capabilities.map((capability) => (
                  <li key={capability}>
                    <i aria-hidden="true">✦</i> {capability}
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <article id="contribution">
            <span>03</span>
            <div>
              <p className="eyebrow">MY CONTRIBUTION</p>
              <h2>The decisions behind the build</h2>
              <p>{project.contribution}</p>
            </div>
          </article>
          <article id="result">
            <span>04</span>
            <div>
              <p className="eyebrow">THE RESULT</p>
              <h2>What the project proves</h2>
              <p>{project.result}</p>
              <div className="proof-note">
                <span>PROOF TYPE</span>
                <strong>{project.proof}</strong>
                <p>
                  Replace this starter block with screenshots, a short video,
                  sample output, or measured results from the real project.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="next-project">
        <p className="eyebrow">KEEP EXPLORING</p>
        <Link href="/#projects">
          Return to the project index <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
