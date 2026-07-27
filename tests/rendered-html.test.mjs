import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("public library keeps discovery and project notes easy to reach", async () => {
  const [portfolio, projectPage, sidebar, projects] = await Promise.all([
    source("app/portfolio.tsx"),
    source("app/projects/[slug]/page.tsx"),
    source("app/library-sidebar.tsx"),
    source("app/data/projects.ts"),
  ]);

  assert.match(portfolio, /Search projects/);
  assert.match(portfolio, /aria-label="Filter projects"/);
  assert.match(projectPage, /Project brief/);
  assert.match(projectPage, /Core functions/);
  assert.match(projectPage, /compact-function-list/);
  assert.match(projectPage, /core-functions-text/);
  assert.match(projectPage, /project-custom-section/);
  assert.match(projectPage, /project-content-box/);
  assert.match(projectPage, /content-box-images/);
  assert.match(projectPage, /Screenshots/);
  assert.match(projectPage, /<details/);
  assert.match(projectPage, /sizes="\(max-width: 900px\) 90vw, 680px"\s+unoptimized/);
  assert.match(sidebar, /Owner editor/);
  for (const slug of [
    "project-alexandria",
    "grey-matter",
    "foci-os",
    "ai-news-bot",
  ]) {
    assert.match(projects, new RegExp(`slug: "${slug}"`));
  }
  assert.doesNotMatch(projects, /slug: "invoice-ocr"/);
});

test("owner editor supports minimal projects and optional rich content", async () => {
  const [editor, projectsApi] = await Promise.all([
    source("app/admin/project-editor.tsx"),
    source("app/api/admin/projects/route.ts"),
  ]);

  assert.match(editor, /Project title \(required\)/);
  assert.match(editor, /multiple/);
  assert.match(editor, /Caption for this image/);
  assert.match(editor, /Optional questions and answers/);
  assert.match(editor, /Custom project sections/);
  assert.match(editor, /Core functions/);
  assert.match(editor, /coreFunctionBoxes/);
  assert.match(editor, /\+ Add another box/);
  assert.match(editor, /\+ Add section/);
  assert.match(editor, /\+ Add box/);
  assert.match(editor, /uploadBoxImages/);
  assert.match(editor, /moveItem/);
  assert.match(editor, /prepareImage/);
  assert.match(editor, /project-library-backup/);
  assert.match(editor, /Export JSON/);
  assert.match(editor, /Import JSON/);
  assert.match(editor, /Screenshot files are not embedded/);
  assert.match(projectsApi, /Project notes are being prepared\./);
  assert.match(projectsApi, /item\.question && item\.answer/);
  assert.match(projectsApi, /url\.protocol === "http:"/);
  assert.match(projectsApi, /customSections/);
  assert.match(projectsApi, /coreFunctionBoxes/);
  assert.match(projectsApi, /normalizeImage/);
  assert.match(projectsApi, /section\.boxes\.flatMap/);
});

test("admin mutations use basic session and request protections", async () => {
  const [owner, login, upload, exportRoute] = await Promise.all([
    source("app/admin/owner.ts"),
    source("app/api/admin/login/route.ts"),
    source("app/api/admin/upload/route.ts"),
    source("app/api/admin/projects/export/route.ts"),
  ]);

  assert.match(owner, /constantTimeEqual/);
  assert.match(owner, /HMAC/);
  assert.match(owner, /origin === new URL\(request\.url\)\.origin/);
  assert.match(login, /HttpOnly; SameSite=Strict/);
  assert.match(login, /MAX_FAILURES = 5/);
  assert.match(login, /cache-control/);
  assert.match(upload, /ALLOWED_TYPES/);
  assert.match(upload, /MAX_IMAGE_BYTES/);
  assert.match(upload, /safeSlug/);
  assert.match(exportRoute, /requireApiOwner/);
  assert.match(exportRoute, /content-disposition/);
  assert.match(exportRoute, /project-library-backup/);
});
