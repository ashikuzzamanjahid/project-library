# Add a Project Manually

## Private Editor

The preferred editing workflow is the private owner page:

```text
/admin
```

The editor is protected by the server-side admin password and session secret.
Every create, update, delete, and image-upload request verifies the private
owner session.

The editor supports:

- Creating and deleting project entries
- Editing all library metadata
- Writing the brief and project fundamentals
- Adding, removing, and editing functions
- Uploading screenshots
- Writing screenshot descriptions and captions
- Creating and reordering custom project sections
- Adding reorderable content boxes with text, highlighted results, and images
- Editing repository, demo, and documentation links
- Adding architecture and installation steps
- Adding usage notes, lessons, and next steps
- Creating any number of custom questions and answers

Visitors cannot see the editor and cannot use its write endpoints.

The file-based process below remains available as a backup for projects that
should ship with the website source.

---

Projects are stored in:

```text
app/data/projects.ts
```

Screenshots and other public images are stored in:

```text
public/projects/
```

No database or admin dashboard is required. Adding a project involves copying
one project object, changing its content, and adding its images.

## 1. Create the Image Folder

Create a folder using the same value that will be used for the project `slug`:

```text
public/projects/my-project/
```

Add the project's images:

```text
public/projects/my-project/
├── cover.webp
├── dashboard.webp
└── search-results.webp
```

Recommended image formats:

- WebP for screenshots
- PNG when transparency is required
- JPEG for photographs

Use clear filenames and compress large images before adding them.

## 2. Add the Project

Open `app/data/projects.ts` and add a new object inside the `projects` array.

```ts
{
  slug: "my-project",
  number: "05",
  title: "My Project",
  summary: "A short explanation of what the project does and who it helps.",
  category: "AI Applications",
  status: "Active",
  year: "2026",
  accent: "blue",

  repository: "https://github.com/username/my-project",
  demo: "https://example.com",
  documentation: "https://docs.example.com",
  role: "Design and development",
  updatedAt: "July 2026",
  proof: "Screenshots and source code",

  technologies: ["Python", "FastAPI", "PostgreSQL"],
  capabilities: ["Search", "Document processing", "Reporting"],

  overview: [
    "Explain the problem and why the project exists.",
    "Explain the intended users and the main workflow.",
    "Summarize the current result or project status.",
  ],

  features: [
    {
      title: "Document upload",
      description: "Users can upload documents for processing.",
    },
    {
      title: "Structured extraction",
      description: "The system converts document content into structured data.",
    },
  ],

  screenshots: [
    {
      src: "/projects/my-project/dashboard.webp",
      alt: "Dashboard showing processed documents and their status",
      caption: "The main dashboard with recent processing activity.",
      width: 1600,
      height: 1000,
    },
  ],

  customSections: [
    {
      title: "Model evaluation",
      description: "A closer look at the experiment results.",
      boxes: [
        {
          title: "Validation performance",
          highlight: "94.2% accuracy",
          content: "Explain the result, comparison, and evaluation conditions.",
          images: [
            {
              src: "/projects/my-project/evaluation.webp",
              alt: "Chart comparing validation performance across models",
              caption: "The selected model achieved the strongest result.",
              width: 1600,
              height: 1000,
            },
          ],
        },
      ],
    },
  ],

  problem: "A concise description of the original problem.",
  solution: "A concise explanation of the implemented solution.",
  contribution: "What you personally designed or built.",
  result: "The result, current limitation, or evidence available.",

  architecture: [
    "The user submits a document through the web interface.",
    "The API validates and stores the uploaded file.",
    "A processing worker extracts and validates the data.",
    "The structured result is returned to the dashboard.",
  ],

  installation: [
    "git clone https://github.com/username/my-project.git",
    "cd my-project",
    "npm install",
    "npm run dev",
  ],

  usage: [
    "Upload a supported document.",
    "Review extracted fields and confidence values.",
    "Export the final structured record.",
  ],

  challenges: [
    {
      title: "Inconsistent document layouts",
      description:
        "Explain the challenge, the chosen approach, and the trade-off.",
    },
  ],

  nextSteps: [
    "Add more supported document layouts.",
    "Improve the evaluation dataset.",
  ],
}
```

## 3. Required Fields

The following fields are required:

- `slug`
- `number`
- `title`
- `summary`
- `category`
- `status`
- `technologies`
- `capabilities`
- `proof`
- `year`
- `accent`
- `problem`
- `solution`
- `contribution`
- `result`

The detailed documentation fields are optional. A project page will still work
when they are missing, and will show a useful placeholder where more content
can be added.

## 4. Screenshot Accessibility

Every screenshot requires:

- A useful `alt` description for screen-reader users
- A visible caption explaining what the visitor should notice
- The real image width and height

Avoid descriptions such as `"screenshot"` or `"project image"`. Describe the
content and purpose of the interface instead.

## 5. Check the Project

After adding the object and images:

```text
npm run build
```

Then open:

```text
/projects/my-project
```

Check that:

- The project title and summary are easy to understand
- The source and demo links work
- Screenshots have useful captions
- Installation commands are correct
- The page clearly identifies your personal contribution
