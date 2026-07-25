# AI Project Portfolio / Lab

A functional-first website for presenting AI, machine learning, data, automation, and developer-tool projects.

---

## 1. Project Goal

Build a single website that acts as the central showcase for selected GitHub projects.

The website should help visitors quickly understand:

- What each project does
- What problem it solves
- What I personally built
- How the system works
- What technologies were used
- What results or evidence are available
- Where to find the source code

The website is a curated project portfolio, not a complete mirror of the GitHub account. GitHub automation should assist with maintenance, but it should not automatically decide what gets published.

---

## 2. Success Criteria

The project is successful when:

- A visitor understands my main areas of work within 15 seconds.
- My strongest three projects are immediately visible.
- Every featured project includes visual or measurable evidence.
- Every project clearly explains the problem, contribution, and result.
- Visitors can understand a project without opening GitHub.
- The site works well on desktop and mobile.
- The site remains usable if the GitHub API is unavailable.
- Adding a curated project takes less than 15 minutes once its content and assets exist.
- The site can grow without requiring a redesign.

---

## 3. Core Principles

1. Curated quality over repository quantity
2. Content and evidence over animations
3. Case studies over copied README files
4. Fast loading and accessible design
5. Mobile-friendly layouts
6. Consistent project structure
7. Automation should reduce work, not remove editorial control
8. Projects without live deployments should still be presentable

---

## 4. Target Visitors

Primary visitors:

- Recruiters and hiring managers
- Engineers and technical leads
- Potential collaborators
- Clients looking for technical capabilities

Secondary visitors:

- Other developers
- Students and researchers
- People discovering a project through search

Each page should provide a quick overview for non-technical visitors and optional technical depth for engineers.

---

## 5. Repository Audit

Before building the website, review all existing GitHub repositories.

Assign each repository one visibility level:

| Level | Meaning |
|---|---|
| Featured | One of the strongest projects and highlighted on the homepage |
| Showcase | Presentable and included in the project catalogue |
| Experiment | Useful work, but visually secondary |
| Archive | Old or no longer representative |
| Private | Not suitable for public presentation |
| Ignore | Forks, duplicates, exercises, or irrelevant repositories |

For each Featured or Showcase project, collect:

- A one-sentence summary
- The problem it solves
- My contribution
- Intended users
- Main features
- Technologies used
- Current status
- Screenshots, video, metrics, or sample output
- GitHub repository URL
- Demo URL, if one exists
- Known limitations
- Lessons learned

### Initial Content Target

Launch with:

- 3–6 Featured projects
- 5–8 total polished projects
- Additional experiments only when they add useful breadth

Do not delay the launch to document every repository.

---

## 6. Information Architecture

```text
/
├── Home
├── Projects
│   └── Project Details
└── About
```

Possible future pages:

```text
/technologies
/timeline
/notes
/datasets
/models
```

These pages are not part of the MVP.

---

## 7. MVP Scope

### 7.1 Home Page

Purpose: explain who I am and direct visitors to my strongest work.

Content:

- Name and role
- Short introduction
- Main areas of interest
- Clear value proposition
- Featured projects
- Selected project count
- Broad project categories
- GitHub and contact links
- Link to view all projects

The homepage should answer: “What does this person build, and what should I look at first?”

### 7.2 Projects Page

Purpose: provide a searchable catalogue of curated work.

Initial features:

- Responsive project grid
- Text search
- Primary category filter
- Featured projects displayed prominently
- Newest-first sorting

Each card should show:

- Cover image or thumbnail
- Project name
- Short description
- Primary category
- Important technologies
- Status
- Available proof type
- Last meaningful update

Possible proof labels:

- Live demo
- Video walkthrough
- Screenshots
- Sample output
- Code available
- Local installation
- Case study

Advanced technology filters, star sorting, and related-project logic can be added after the catalogue becomes large enough to need them.

### 7.3 Project Detail Page

Each project follows the same case-study structure.

#### Header

- Project name
- One-sentence outcome
- Cover image
- Status
- Repository button
- Demo button, when available
- Video or documentation button, when available

#### Problem

- What problem does the project address?
- Who experiences the problem?
- Why is the problem worth solving?

#### Solution

- What was built?
- How does it solve the problem?
- What was my specific contribution?

#### Key Features

Examples:

- OCR and document extraction
- Retrieval-augmented generation
- Authentication
- REST API
- Dashboard
- AI chat
- Data pipeline
- Automated reporting

#### Evidence

At least one of:

- Screenshots with captions
- Short video or GIF
- Sample input and output
- Evaluation metrics
- Performance results
- API request and response examples
- Notebook results

A live deployment is useful but not required.

#### Architecture

- Short system explanation
- Mermaid diagram, when helpful
- Important data flows
- External services and dependencies

#### Technology and Decisions

- Technology stack
- Why key tools were selected
- Important trade-offs

#### Running the Project

- Installation
- Configuration
- Usage
- Deployment notes, if relevant

This section can reuse selected README content without making the entire page a README copy.

#### Challenges and Lessons

- Main challenge
- Chosen solution
- Limitations
- Lessons learned
- What I would improve next

### 7.4 About Page

Content:

- Background
- Current interests
- Areas of specialization
- Favorite technologies
- GitHub and professional links
- Contact method

---

## 8. Content Taxonomy

### Primary Categories

Each project should have one primary category:

- AI Applications
- Machine Learning
- Computer Vision
- Data Systems
- Developer Tools
- Automation
- Experiments

### Tags

Tags provide more specific classification:

- RAG
- OCR
- LLM
- Agents
- NLP
- FastAPI
- OpenAI
- PostgreSQL
- Docker
- Computer Vision
- Data Engineering

Categories should remain broad. Technologies and capabilities should normally be tags rather than additional categories.

### Project Status

Use controlled values:

- Production
- Active
- Prototype
- Experiment
- Archived

---

## 9. Content Storage

For the MVP, keep curated content inside the portfolio repository.

```text
portfolio/
├── content/
│   └── projects/
│       ├── invoice-ocr.mdx
│       └── rag-assistant.mdx
├── public/
│   └── projects/
│       ├── invoice-ocr/
│       │   ├── cover.webp
│       │   ├── screenshot-01.webp
│       │   └── demo.mp4
│       └── rag-assistant/
├── src/
└── README.md
```

Keeping content centralized avoids having to modify every existing repository before launching.

Repository-level metadata can be supported later as an optional source.

---

## 10. Project Content Model

Example MDX front matter:

```yaml
---
title: Invoice OCR
slug: invoice-ocr
summary: Extracts and validates structured fields from invoice images.
repository: https://github.com/username/invoice-ocr
demo: null
category: Computer Vision
status: Prototype
featured: true

technologies:
  - Python
  - FastAPI
  - OpenCV

capabilities:
  - OCR
  - Field extraction
  - Confidence scoring

tags:
  - Document AI
  - REST API

proof:
  type: video
  url: /projects/invoice-ocr/demo.mp4

cover: /projects/invoice-ocr/cover.webp
startedAt: 2025-10-01
updatedAt: 2026-07-20
---
```

The body of the MDX file contains the project case study.

### Required Fields

- `title`
- `slug`
- `summary`
- `repository`
- `category`
- `status`
- `featured`
- `technologies`
- `cover`
- `updatedAt`

### Optional Fields

- `demo`
- `capabilities`
- `tags`
- `proof`
- `startedAt`
- `documentation`
- `video`

---

## 11. Technical Direction

### Proposed Stack

- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Content: Markdown or MDX
- Images: Next.js image optimization
- Diagrams: Mermaid
- Deployment: Vercel or Cloudflare Pages
- Search: simple local search initially; Pagefind if compatible with the final build strategy

### Technical Constraints

- Project pages should be statically generated where practical.
- GitHub data should not be required for every page request.
- GitHub data should be fetched during scheduled builds or cached.
- Client-side GitHub API calls should be avoided.
- GitHub API failure should not break the site build.
- Images should use WebP or AVIF when appropriate.
- Videos should be compressed and should not autoplay with sound.
- Metadata should be validated during the build.

### No Initial Database

A database or CMS is not required for the MVP. MDX files stored in Git provide:

- Version control
- Easy deployment
- Structured content
- Low maintenance
- No additional service dependency

---

## 12. Automation Strategy

Automation should be introduced gradually.

### MVP

- Project content is written manually in the portfolio repository.
- GitHub repository URLs are stored in front matter.
- No GitHub API dependency is required.

### GitHub-Assisted Maintenance

Later automation can:

- Fetch star counts
- Fetch primary languages
- Fetch repository topics
- Fetch repository update timestamps
- Detect new repositories
- Validate repository links
- Report missing screenshots or metadata
- Generate draft project entries

New repositories should not be published automatically. They should become reviewable candidates.

### Advanced Synchronization

Only after the content format is stable:

```text
GitHub Repository
        ↓
Read optional metadata
        ↓
Read selected README sections
        ↓
Validate screenshots and assets
        ↓
Create or update draft project entry
        ↓
Human review
        ↓
Build and deploy
```

---

## 13. Development Phases

### Phase 0: Repository and Content Audit

Tasks:

- Inventory existing repositories
- Assign visibility levels
- Select the initial 5–8 projects
- Write a one-sentence summary for each selected project
- Identify missing assets and documentation
- Collect screenshots, outputs, metrics, and repository links
- Decide the primary audience and personal positioning

Deliverable:

- A prioritized project inventory with enough material to build the first pages

### Phase 1: Foundation and Curated Launch

Tasks:

- Initialize the Next.js and TypeScript project
- Configure Tailwind CSS
- Establish typography, colors, spacing, and components
- Implement the MDX content model
- Add build-time metadata validation
- Build the responsive navigation
- Build the homepage
- Build the projects catalogue
- Build the reusable project detail template
- Build the About page
- Add content for the first 5–8 projects
- Add basic SEO and social preview metadata
- Add accessibility checks
- Deploy the website

Deliverable:

- A live, responsive portfolio with curated project case studies

### Phase 2: Evidence and Discovery

Tasks:

- Improve screenshot galleries
- Add video walkthrough support
- Add Mermaid architecture diagrams
- Add search
- Add category filtering
- Add proof-type labels
- Add related projects
- Improve empty and missing-content states
- Optimize images and videos

Deliverable:

- A richer catalogue that is easier to explore

### Phase 3: GitHub Integration

Tasks:

- Fetch optional GitHub statistics during builds or scheduled jobs
- Cache imported GitHub data
- Detect newly created repositories
- Validate repository availability
- Generate draft entries for review
- Add CI checks for invalid project metadata
- Trigger safe portfolio rebuilds when approved content changes

Deliverable:

- GitHub-assisted maintenance without losing editorial control

### Phase 4: Optional Enhancements

Possible features:

- Technology pages
- Project timeline
- Project dependency graph
- Research notes
- Dataset pages
- Model pages
- Interactive architecture diagrams
- More advanced sorting and filtering
- Project statistics
- Dark mode

These features should be prioritized using visitor needs and actual site usage.

---

## 14. MVP Backlog

### Content

- [ ] Inventory all repositories
- [ ] Classify repositories by visibility level
- [ ] Select 5–8 launch projects
- [ ] Write summaries for launch projects
- [ ] Write problem and solution sections
- [ ] Document personal contributions
- [ ] Collect screenshots or alternative proof
- [ ] Record short demos where useful
- [ ] Create architecture diagrams
- [ ] Document limitations and lessons learned

### Design

- [ ] Define visual direction
- [ ] Define typography and color tokens
- [ ] Design navigation
- [ ] Design homepage
- [ ] Design project card
- [ ] Design project detail template
- [ ] Design screenshot gallery
- [ ] Design mobile layouts
- [ ] Design missing-demo and missing-image states

### Engineering

- [ ] Initialize Next.js project
- [ ] Configure TypeScript
- [ ] Configure Tailwind CSS
- [ ] Configure MDX
- [ ] Define and validate the project schema
- [ ] Generate project routes
- [ ] Implement search
- [ ] Implement category filtering
- [ ] Add Mermaid support
- [ ] Optimize images and video
- [ ] Add SEO metadata
- [ ] Add sitemap and robots file
- [ ] Add analytics only if needed

### Quality

- [ ] Test keyboard navigation
- [ ] Check color contrast
- [ ] Add descriptive alternative text
- [ ] Test common mobile widths
- [ ] Test with slow network conditions
- [ ] Check for broken links
- [ ] Verify social preview cards
- [ ] Run performance checks
- [ ] Ensure GitHub unavailability does not break the site

### Deployment

- [ ] Choose Vercel or Cloudflare Pages
- [ ] Configure production builds
- [ ] Configure the custom domain
- [ ] Add deployment checks
- [ ] Publish the first version

---

## 15. MVP Definition of Done

The MVP is complete when:

- The site is publicly deployed.
- The homepage clearly communicates my focus.
- At least five polished project pages are published.
- At least three projects are marked Featured.
- Every Featured project has visual or measurable evidence.
- Every project page includes the problem, solution, contribution, technology, and result or current limitation.
- Visitors can search or filter the project catalogue.
- The website works on mobile and desktop.
- Keyboard navigation and basic accessibility requirements are satisfied.
- Page metadata, sitemap, and social previews work.
- Adding a project follows a documented, repeatable process.
- The website does not depend on live GitHub API availability.

---

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Trying to publish every repository | Launch with only 5–8 curated projects |
| Spending more time on the system than the content | Complete the content audit before advanced engineering |
| Projects have no live deployment | Use video, screenshots, sample outputs, metrics, or API examples |
| README files do not tell a compelling story | Write project pages as case studies |
| Categories overlap | Use one broad category plus multiple tags |
| GitHub rate limits or outages | Cache data and avoid runtime dependency |
| Automation publishes weak or unfinished work | Require human approval |
| Media makes pages slow | Compress assets and load media only when needed |
| Scope expands before launch | Keep future features outside the MVP |

---

## 17. Immediate Next Steps

1. Export or list all GitHub repositories.
2. Classify each repository using the visibility levels.
3. Select the strongest 5–8 projects.
4. Write a one-sentence summary for each selected project.
5. Identify the proof available for each project.
6. Decide on the personal positioning statement for the homepage.
7. Create the portfolio repository.
8. Build one complete project page as the content and design prototype.
9. Use that prototype to finalize the reusable project schema.
10. Build the rest of the MVP around the validated template.

---

## 18. Recommended First Milestone

The first milestone is not a complete website. It is one excellent project case study.

Choose the strongest project and prepare:

- One clear summary
- Problem and intended users
- Personal contribution
- Three to six key features
- Two to five screenshots or a short recording
- Architecture diagram
- Technology decisions
- Results or current limitations
- Lessons learned
- GitHub link

Once this page feels convincing, use it as the template for the rest of the portfolio.
