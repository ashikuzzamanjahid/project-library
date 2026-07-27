"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  Project,
  ProjectCustomSection,
  ProjectImage,
} from "../data/projects";

function emptyProject(number: number): Project {
  return {
    slug: "",
    number: String(number).padStart(2, "0"),
    title: "",
    summary: "",
    category: "AI Applications",
    status: "Prototype",
    technologies: [],
    capabilities: [],
    proof: "Source code",
    year: String(new Date().getFullYear()),
    accent: "blue",
    problem: "",
    solution: "",
    contribution: "",
    result: "",
    overview: [],
    features: [],
    coreFunctionBoxes: [""],
    screenshots: [],
    customSections: [],
    architecture: [],
    installation: [],
    usage: [],
    challenges: [],
    nextSteps: [],
    questions: [],
  };
}

function commaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function coreFunctionBoxes(project: Project) {
  if (Array.isArray(project.coreFunctionBoxes)) {
    return project.coreFunctionBoxes.length ? project.coreFunctionBoxes : [""];
  }
  if (project.features?.length) {
    return [
      project.features
        .map((feature) =>
          feature.description
            ? `${feature.title}: ${feature.description}`
            : feature.title,
        )
        .join("\n\n"),
    ];
  }
  return [project.capabilities.join("\n")];
}

const UPLOAD_TARGET_BYTES = 700 * 1024;

async function prepareImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const original = {
    file,
    width: bitmap.width,
    height: bitmap.height,
  };

  if (file.size <= UPLOAD_TARGET_BYTES) {
    bitmap.close();
    return original;
  }
  if (file.type === "image/gif") {
    bitmap.close();
    throw new Error(
      `${file.name} is too large. Animated GIFs must be smaller than 700 KB.`,
    );
  }

  let scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  let result: Blob | null = null;
  let width = bitmap.width;
  let height = bitmap.height;

  for (const quality of [0.84, 0.72, 0.6]) {
    width = Math.max(1, Math.round(bitmap.width * scale));
    height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
    result = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (result && result.size <= UPLOAD_TARGET_BYTES) break;
    scale *= 0.8;
  }

  bitmap.close();
  if (!result || result.size > UPLOAD_TARGET_BYTES) {
    throw new Error(
      `${file.name} could not be reduced enough for upload. Try a smaller image.`,
    );
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "screenshot";
  return {
    file: new File([result], `${baseName}.webp`, { type: "image/webp" }),
    width,
    height,
  };
}

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  try {
    return JSON.parse(body) as T;
  } catch {
    if (response.status === 413) {
      throw new Error(
        "The image is too large for the server. Try a smaller screenshot.",
      );
    }
    throw new Error(body || `The server returned error ${response.status}.`);
  }
}

type ProjectBackup = {
  format: "project-library-backup";
  version: 1;
  exportedAt: string;
  projects: Project[];
};

export function ProjectEditor({
  initialProjects,
  ownerName,
}: {
  initialProjects: Project[];
  ownerName: string;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [draft, setDraft] = useState<Project>(
    initialProjects[0] ?? emptyProject(1),
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isExisting = useMemo(
    () => projects.some((project) => project.slug === draft.slug),
    [draft.slug, projects],
  );

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function newProject() {
    setDraft(emptyProject(projects.length + 1));
    setMessage("");
  }

  async function importProjects(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setMessage("The backup file must be smaller than 2 MB.");
      return;
    }

    setMessage("");
    let incoming: unknown;
    try {
      incoming = JSON.parse(await file.text());
    } catch {
      setMessage("That file is not valid JSON.");
      return;
    }

    const backup = incoming as Partial<ProjectBackup>;
    if (
      backup.format !== "project-library-backup" ||
      backup.version !== 1 ||
      !Array.isArray(backup.projects)
    ) {
      setMessage("Choose a Project Library backup created by this editor.");
      return;
    }
    if (!backup.projects.length) {
      setMessage("The backup does not contain any projects.");
      return;
    }
    if (backup.projects.length > 200) {
      setMessage("A backup can contain at most 200 projects.");
      return;
    }
    if (
      backup.projects.some(
        (project) =>
          !project ||
          typeof project !== "object" ||
          typeof project.title !== "string" ||
          !project.title.trim(),
      )
    ) {
      setMessage("Every imported project must have a title.");
      return;
    }

    const imageReferenceCount = backup.projects.reduce(
      (total, project) =>
        total +
        (project.screenshots?.length ?? 0) +
        (project.customSections?.reduce(
          (sectionTotal, section) =>
            sectionTotal +
            section.boxes.reduce(
              (boxTotal, box) => boxTotal + box.images.length,
              0,
            ),
          0,
        ) ?? 0),
      0,
    );
    const warning = imageReferenceCount
      ? ` The backup contains ${imageReferenceCount} image reference${imageReferenceCount === 1 ? "" : "s"}, but not the image files themselves.`
      : "";
    if (
      !window.confirm(
        `Import ${backup.projects.length} project${backup.projects.length === 1 ? "" : "s"}? Projects with the same URL slug will be overwritten.${warning}`,
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      const saved: Project[] = [];
      for (const project of backup.projects) {
        const response = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(project),
        });
        const payload = await readResponse<{
          project?: Project;
          error?: string;
        }>(response);
        if (!response.ok || !payload.project) {
          throw new Error(
            payload.error ?? `Could not import “${project.title}”.`,
          );
        }
        saved.push(payload.project);
      }

      const savedSlugs = new Set(saved.map((project) => project.slug));
      setProjects((current) => [
        ...saved,
        ...current.filter((project) => !savedSlugs.has(project.slug)),
      ]);
      setDraft(saved[0]);
      setMessage(
        `Imported ${saved.length} project${saved.length === 1 ? "" : "s"}. Review the entries before uploading production screenshots.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProject() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = await readResponse<{
        project?: Project;
        error?: string;
      }>(response);
      if (!response.ok || !payload.project) {
        throw new Error(payload.error ?? "Could not save the project.");
      }
      setProjects((current) => [
        payload.project!,
        ...current.filter((project) => project.slug !== payload.project!.slug),
      ]);
      setDraft(payload.project);
      setMessage("Saved. The public library now uses this version.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject() {
    if (!draft.slug || !window.confirm(`Delete “${draft.title}”?`)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/projects?slug=${encodeURIComponent(draft.slug)}`,
        { method: "DELETE" },
      );
      const payload = await readResponse<{ error?: string }>(response);
      if (!response.ok) throw new Error(payload.error ?? "Delete failed.");
      const remaining = projects.filter((project) => project.slug !== draft.slug);
      setProjects(remaining);
      setDraft(remaining[0] ?? emptyProject(1));
      setMessage("Deleted the saved project entry.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  function imageUploadSlug() {
    if (!draft.title.trim()) {
      throw new Error("Add a project title before uploading images.");
    }
    return (
      draft.slug ||
      draft.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  async function sendImages(files: File[], uploadSlug: string) {
    const uploaded: ProjectImage[] = [];
    for (const file of files) {
      const prepared = await prepareImage(file);
      const form = new FormData();
      form.set("file", prepared.file);
      form.set("slug", uploadSlug);
      form.set("width", String(prepared.width));
      form.set("height", String(prepared.height));
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const payload = await readResponse<{
        screenshot?: ProjectImage;
        error?: string;
      }>(response);
      if (!response.ok || !payload.screenshot) {
        throw new Error(payload.error ?? `Could not upload ${file.name}.`);
      }
      uploaded.push(payload.screenshot);
    }
    return uploaded;
  }

  async function uploadScreenshots(files: File[]) {
    setBusy(true);
    setMessage(
      `Uploading ${files.length} image${files.length === 1 ? "" : "s"}…`,
    );
    try {
      const uploadSlug = imageUploadSlug();
      const uploaded = await sendImages(files, uploadSlug);
      setDraft((current) => ({
        ...current,
        slug: current.slug || uploadSlug,
        screenshots: [...(current.screenshots ?? []), ...uploaded],
      }));
      setMessage(
        `${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded. Add a caption to each, then save.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadBoxImages(
    sectionIndex: number,
    boxIndex: number,
    files: File[],
  ) {
    setBusy(true);
    setMessage(
      `Uploading ${files.length} section image${files.length === 1 ? "" : "s"}…`,
    );
    try {
      const uploadSlug = imageUploadSlug();
      const uploaded = await sendImages(files, uploadSlug);
      setDraft((current) => {
        const sections = [...(current.customSections ?? [])];
        const section = sections[sectionIndex];
        const box = section?.boxes[boxIndex];
        if (!section || !box) return current;
        const boxes = [...section.boxes];
        boxes[boxIndex] = {
          ...box,
          images: [...box.images, ...uploaded],
        };
        sections[sectionIndex] = { ...section, boxes };
        return {
          ...current,
          slug: current.slug || uploadSlug,
          customSections: sections,
        };
      });
      setMessage(
        `${uploaded.length} section image${uploaded.length === 1 ? "" : "s"} uploaded. Add captions, then save the project.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>PRIVATE</span>
          <strong>Library editor</strong>
          <small>Signed in as {ownerName}</small>
        </div>
        <button className="admin-new" type="button" onClick={newProject}>
          + New project
        </button>
        <nav aria-label="Saved projects">
          {projects.map((project) => (
            <button
              className={draft.slug === project.slug ? "active" : ""}
              key={project.slug}
              type="button"
              onClick={() => {
                setDraft(project);
                setMessage("");
              }}
            >
              <span>{project.number}</span>
              <div>
                <strong>{project.title}</strong>
                <small>{project.category}</small>
              </div>
            </button>
          ))}
        </nav>
        <div className="admin-transfer">
          <strong>Backup and migration</strong>
          <div>
            <a
              href="/api/admin/projects/export"
              aria-disabled={busy}
              onClick={(event) => {
                if (busy) {
                  event.preventDefault();
                  return;
                }
                setMessage(
                  `Exporting ${projects.length} saved project${projects.length === 1 ? "" : "s"}. Screenshot files are not embedded in the JSON.`,
                );
              }}
            >
              Export JSON
            </a>
            <label>
              Import JSON
              <input
                type="file"
                accept="application/json,.json"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importProjects(file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
          <small>Save current edits before exporting.</small>
        </div>
        <a
          className="admin-library-link"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          Open public library ↗
        </a>
        <button
          className="admin-signout"
          type="button"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.assign("/");
          }}
        >
          Sign out
        </button>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span>{isExisting ? "EDITING" : "NEW ENTRY"}</span>
            <strong>{draft.title || "Untitled project"}</strong>
          </div>
          <div>
            {isExisting && (
              <button type="button" onClick={removeProject} disabled={busy}>
                Delete
              </button>
            )}
            <button
              className="save-button"
              type="button"
              onClick={saveProject}
              disabled={busy}
            >
              {busy ? "Working…" : "Save project"}
            </button>
          </div>
        </header>

        {message && <div className="admin-message">{message}</div>}

        <form className="admin-form" onSubmit={(event) => event.preventDefault()}>
          <EditorSection
            number="01"
            title="Identity"
            description="How the entry appears in the library index."
          >
            <div className="form-grid">
              <Field label="Project title (required)">
                <input
                  value={draft.title}
                  onChange={(event) => update("title", event.target.value)}
                />
              </Field>
              <Field label="URL slug">
                <input
                  value={draft.slug}
                  placeholder="my-project"
                  disabled={isExisting}
                  title={
                    isExisting
                      ? "The URL slug is locked after the project is saved."
                      : undefined
                  }
                  onChange={(event) =>
                    update(
                      "slug",
                      event.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                        .replace(/-+/g, "-"),
                    )
                  }
                />
              </Field>
              <Field label="Number">
                <input
                  value={draft.number}
                  onChange={(event) => update("number", event.target.value)}
                />
              </Field>
              <Field label="Category">
                <input
                  value={draft.category}
                  onChange={(event) => update("category", event.target.value)}
                />
              </Field>
              <Field label="Status">
                <select
                  value={draft.status}
                  onChange={(event) =>
                    update("status", event.target.value as Project["status"])
                  }
                >
                  <option>Active</option>
                  <option>Prototype</option>
                  <option>Experiment</option>
                </select>
              </Field>
              <Field label="Color marker">
                <select
                  value={draft.accent}
                  onChange={(event) =>
                    update("accent", event.target.value as Project["accent"])
                  }
                >
                  <option value="blue">Blue</option>
                  <option value="lime">Green</option>
                  <option value="coral">Coral</option>
                </select>
              </Field>
              <Field label="Year">
                <input
                  value={draft.year}
                  onChange={(event) => update("year", event.target.value)}
                />
              </Field>
              <Field label="Last updated">
                <input
                  value={draft.updatedAt ?? ""}
                  placeholder="July 2026"
                  onChange={(event) => update("updatedAt", event.target.value)}
                />
              </Field>
            </div>
            <Field label="One-sentence summary">
              <textarea
                rows={3}
                value={draft.summary}
                onChange={(event) => update("summary", event.target.value)}
              />
            </Field>
          </EditorSection>

          <EditorSection
            number="02"
            title="Brief and fundamentals"
            description="The information readers see before opening any dropdowns."
          >
            <Field label="What problem does it address?">
              <textarea
                rows={5}
                value={draft.problem}
                onChange={(event) => update("problem", event.target.value)}
              />
            </Field>
            <Field label="What is the solution?">
              <textarea
                rows={5}
                value={draft.solution}
                onChange={(event) => update("solution", event.target.value)}
              />
            </Field>
            <div className="form-grid">
              <Field label="Technologies (comma separated)">
                <input
                  value={draft.technologies.join(", ")}
                  onChange={(event) =>
                    update("technologies", commaList(event.target.value))
                  }
                />
              </Field>
              <Field label="Capabilities (comma separated)">
                <input
                  value={draft.capabilities.join(", ")}
                  onChange={(event) =>
                    update("capabilities", commaList(event.target.value))
                  }
                />
              </Field>
            </div>
            <CoreFunctionsEditor
              boxes={coreFunctionBoxes(draft)}
              onChange={(boxes) => update("coreFunctionBoxes", boxes)}
            />
          </EditorSection>

          <EditorSection
            number="03"
            title="Screenshots"
            description="Upload images, then explain what each one shows."
          >
            <label className="upload-control">
              <span>{busy ? "Please wait…" : "+ Upload screenshot"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                disabled={busy}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  if (files.length) void uploadScreenshots(files);
                  event.target.value = "";
                }}
              />
            </label>
            <div className="admin-screenshots">
              {(draft.screenshots ?? []).map((screenshot, index) => (
                <div key={`${screenshot.src}-${index}`}>
                  <Image
                    src={screenshot.src}
                    alt=""
                    width={screenshot.width}
                    height={screenshot.height}
                    sizes="(max-width: 780px) 100vw, 360px"
                    unoptimized
                  />
                  <label>
                    <span>Image description</span>
                    <input
                      placeholder="Describe what appears in this image"
                      value={screenshot.alt}
                      onChange={(event) => {
                        const next = [...(draft.screenshots ?? [])];
                        next[index] = { ...screenshot, alt: event.target.value };
                        update("screenshots", next);
                      }}
                    />
                  </label>
                  <label>
                    <span>Caption for this image</span>
                    <textarea
                      rows={2}
                      placeholder="Explain what visitors should notice"
                      value={screenshot.caption}
                      onChange={(event) => {
                        const next = [...(draft.screenshots ?? [])];
                        next[index] = {
                          ...screenshot,
                          caption: event.target.value,
                        };
                        update("screenshots", next);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "screenshots",
                        (draft.screenshots ?? []).filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      )
                    }
                  >
                    Remove image
                  </button>
                </div>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            number="04"
            title="Custom project sections"
            description="Add optional sections for results, datasets, evaluations, experiments, or any other aspect of the project."
          >
            <CustomSectionsEditor
              sections={draft.customSections ?? []}
              busy={busy}
              onChange={(sections) => update("customSections", sections)}
              onUpload={uploadBoxImages}
            />
          </EditorSection>

          <EditorSection
            number="05"
            title="Links and ownership"
            description="Source, demo, documentation, and your contribution."
          >
            <div className="form-grid">
              <Field label="Repository URL">
                <input
                  value={draft.repository ?? ""}
                  onChange={(event) => update("repository", event.target.value)}
                />
              </Field>
              <Field label="Live demo URL">
                <input
                  value={draft.demo ?? ""}
                  onChange={(event) => update("demo", event.target.value)}
                />
              </Field>
              <Field label="Documentation URL">
                <input
                  value={draft.documentation ?? ""}
                  onChange={(event) =>
                    update("documentation", event.target.value)
                  }
                />
              </Field>
              <Field label="Evidence label">
                <input
                  value={draft.proof}
                  onChange={(event) => update("proof", event.target.value)}
                />
              </Field>
            </div>
            <Field label="My role">
              <input
                value={draft.role ?? ""}
                onChange={(event) => update("role", event.target.value)}
              />
            </Field>
            <Field label="What did I personally build?">
              <textarea
                rows={5}
                value={draft.contribution}
                onChange={(event) => update("contribution", event.target.value)}
              />
            </Field>
          </EditorSection>

          <EditorSection
            number="06"
            title="Optional questions and answers"
            description="Add only the questions you want. If this stays empty, no dropdown section appears."
          >
            <ArrayEditor
              title="Questions and answers"
              items={draft.questions ?? []}
              onChange={(items) => update("questions", items)}
              emptyItem={{ question: "", answer: "" }}
              renderItem={(item, index, change) => (
                <>
                  <input
                    placeholder="Question"
                    value={item.question}
                    onChange={(event) =>
                      change(index, { ...item, question: event.target.value })
                    }
                  />
                  <textarea
                    rows={4}
                    placeholder="Answer"
                    value={item.answer}
                    onChange={(event) =>
                      change(index, { ...item, answer: event.target.value })
                    }
                  />
                </>
              )}
            />
          </EditorSection>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function EditorSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="editor-section">
      <header>
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function CoreFunctionsEditor({
  boxes,
  onChange,
}: {
  boxes: string[];
  onChange: (boxes: string[]) => void;
}) {
  function change(index: number, value: string) {
    const next = [...boxes];
    next[index] = value;
    onChange(next);
  }

  return (
    <div className="core-functions-editor">
      <div className="core-functions-editor-heading">
        <div>
          <strong>Core functions</strong>
          <small>
            Keep everything in one box, or add another box only when useful.
          </small>
        </div>
        <button type="button" onClick={() => onChange([...boxes, ""])}>
          + Add another box
        </button>
      </div>

      {boxes.map((content, index) => (
        <article className="core-function-editor-box" key={index}>
          <header>
            <span>BOX {String(index + 1).padStart(2, "0")}</span>
            <div>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onChange(moveItem(boxes, index, index - 1))}
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === boxes.length - 1}
                onClick={() => onChange(moveItem(boxes, index, index + 1))}
              >
                ↓
              </button>
              {boxes.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      boxes.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              )}
            </div>
          </header>
          <textarea
            rows={8}
            placeholder={
              "Describe all related core functions here.\n\nUse separate lines or paragraphs for readability."
            }
            value={content}
            onChange={(event) => change(index, event.target.value)}
          />
        </article>
      ))}
    </div>
  );
}

function CustomSectionsEditor({
  sections,
  busy,
  onChange,
  onUpload,
}: {
  sections: ProjectCustomSection[];
  busy: boolean;
  onChange: (sections: ProjectCustomSection[]) => void;
  onUpload: (
    sectionIndex: number,
    boxIndex: number,
    files: File[],
  ) => Promise<void>;
}) {
  function changeSection(
    sectionIndex: number,
    section: ProjectCustomSection,
  ) {
    const next = [...sections];
    next[sectionIndex] = section;
    onChange(next);
  }

  function changeBox(
    sectionIndex: number,
    boxIndex: number,
    box: ProjectCustomSection["boxes"][number],
  ) {
    const section = sections[sectionIndex];
    const boxes = [...section.boxes];
    boxes[boxIndex] = box;
    changeSection(sectionIndex, { ...section, boxes });
  }

  function addSection() {
    onChange([
      ...sections,
      {
        title: "",
        description: "",
        boxes: [],
      },
    ]);
  }

  return (
    <div className="custom-sections-editor">
      <div className="custom-sections-toolbar">
        <div>
          <strong>Manual sections</strong>
          <small>
            Sections and boxes appear in this order on the public project page.
          </small>
        </div>
        <button type="button" onClick={addSection}>
          + Add section
        </button>
      </div>

      {!sections.length && (
        <p className="admin-empty-state">
          No custom sections yet. Add one when a project needs deeper results,
          evidence, datasets, or visual explanations.
        </p>
      )}

      {sections.map((section, sectionIndex) => (
        <section className="custom-section-editor" key={sectionIndex}>
          <header>
            <span>SECTION {String(sectionIndex + 1).padStart(2, "0")}</span>
            <div>
              <button
                type="button"
                disabled={sectionIndex === 0}
                onClick={() =>
                  onChange(moveItem(sections, sectionIndex, sectionIndex - 1))
                }
              >
                ↑ Up
              </button>
              <button
                type="button"
                disabled={sectionIndex === sections.length - 1}
                onClick={() =>
                  onChange(moveItem(sections, sectionIndex, sectionIndex + 1))
                }
              >
                ↓ Down
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    sections.filter(
                      (_, itemIndex) => itemIndex !== sectionIndex,
                    ),
                  )
                }
              >
                Remove section
              </button>
            </div>
          </header>

          <div className="custom-section-fields">
            <Field label="Section title">
              <input
                placeholder="Model evaluation"
                value={section.title}
                onChange={(event) =>
                  changeSection(sectionIndex, {
                    ...section,
                    title: event.target.value,
                  })
                }
              />
            </Field>
            <Field label="Section introduction">
              <textarea
                rows={3}
                placeholder="Explain what this section helps the reader understand."
                value={section.description}
                onChange={(event) =>
                  changeSection(sectionIndex, {
                    ...section,
                    description: event.target.value,
                  })
                }
              />
            </Field>
          </div>

          <div className="custom-boxes-editor">
            <div className="custom-boxes-heading">
              <strong>Content boxes</strong>
              <button
                type="button"
                onClick={() =>
                  changeSection(sectionIndex, {
                    ...section,
                    boxes: [
                      ...section.boxes,
                      {
                        title: "",
                        content: "",
                        highlight: "",
                        images: [],
                      },
                    ],
                  })
                }
              >
                + Add box
              </button>
            </div>

            {!section.boxes.length && (
              <p className="admin-empty-state">
                Add boxes for individual results, comparisons, findings, or
                visual evidence.
              </p>
            )}

            {section.boxes.map((box, boxIndex) => (
              <article className="custom-box-editor" key={boxIndex}>
                <header>
                  <span>BOX {String(boxIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <button
                      type="button"
                      disabled={boxIndex === 0}
                      onClick={() =>
                        changeSection(sectionIndex, {
                          ...section,
                          boxes: moveItem(
                            section.boxes,
                            boxIndex,
                            boxIndex - 1,
                          ),
                        })
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={boxIndex === section.boxes.length - 1}
                      onClick={() =>
                        changeSection(sectionIndex, {
                          ...section,
                          boxes: moveItem(
                            section.boxes,
                            boxIndex,
                            boxIndex + 1,
                          ),
                        })
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        changeSection(sectionIndex, {
                          ...section,
                          boxes: section.boxes.filter(
                            (_, itemIndex) => itemIndex !== boxIndex,
                          ),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </header>

                <div className="custom-box-fields">
                  <Field label="Box title">
                    <input
                      placeholder="Accuracy by model"
                      value={box.title}
                      onChange={(event) =>
                        changeBox(sectionIndex, boxIndex, {
                          ...box,
                          title: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Highlighted value or result">
                    <input
                      placeholder="94.2% validation accuracy"
                      value={box.highlight}
                      onChange={(event) =>
                        changeBox(sectionIndex, boxIndex, {
                          ...box,
                          highlight: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Explanation">
                    <textarea
                      rows={4}
                      placeholder="Describe the result, method, comparison, or evidence."
                      value={box.content}
                      onChange={(event) =>
                        changeBox(sectionIndex, boxIndex, {
                          ...box,
                          content: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>

                <label className="upload-control compact-upload-control">
                  <span>
                    {busy ? "Please wait…" : "+ Add pictures to this box"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    disabled={busy}
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []);
                      if (files.length) {
                        void onUpload(sectionIndex, boxIndex, files);
                      }
                      event.target.value = "";
                    }}
                  />
                </label>

                <div className="admin-screenshots custom-box-images">
                  {box.images.map((image, imageIndex) => (
                    <div key={`${image.src}-${imageIndex}`}>
                      <Image
                        src={image.src}
                        alt=""
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 780px) 100vw, 300px"
                        unoptimized
                      />
                      <label>
                        <span>Image description</span>
                        <input
                          value={image.alt}
                          placeholder="Describe what appears in the image"
                          onChange={(event) => {
                            const images = [...box.images];
                            images[imageIndex] = {
                              ...image,
                              alt: event.target.value,
                            };
                            changeBox(sectionIndex, boxIndex, {
                              ...box,
                              images,
                            });
                          }}
                        />
                      </label>
                      <label>
                        <span>Image caption</span>
                        <textarea
                          rows={2}
                          value={image.caption}
                          placeholder="Explain what the image demonstrates"
                          onChange={(event) => {
                            const images = [...box.images];
                            images[imageIndex] = {
                              ...image,
                              caption: event.target.value,
                            };
                            changeBox(sectionIndex, boxIndex, {
                              ...box,
                              images,
                            });
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          changeBox(sectionIndex, boxIndex, {
                            ...box,
                            images: box.images.filter(
                              (_, itemIndex) => itemIndex !== imageIndex,
                            ),
                          })
                        }
                      >
                        Remove image
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ArrayEditor<T>({
  title,
  items,
  onChange,
  emptyItem,
  renderItem,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  renderItem: (
    item: T,
    index: number,
    change: (index: number, item: T) => void,
  ) => React.ReactNode;
}) {
  function change(index: number, item: T) {
    const next = [...items];
    next[index] = item;
    onChange(next);
  }

  return (
    <div className="array-editor">
      <div className="array-heading">
        <strong>{title}</strong>
        <button type="button" onClick={() => onChange([...items, emptyItem])}>
          + Add
        </button>
      </div>
      {items.map((item, index) => (
        <div className="array-row" key={index}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>{renderItem(item, index, change)}</div>
          <button
            type="button"
            onClick={() =>
              onChange(items.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
