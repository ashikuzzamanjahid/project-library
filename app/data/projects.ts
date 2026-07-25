export type Project = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  category: string;
  status: "Active" | "Prototype" | "Experiment";
  technologies: string[];
  capabilities: string[];
  proof: string;
  year: string;
  accent: "lime" | "coral" | "blue";
  problem: string;
  solution: string;
  contribution: string;
  result: string;
};

// Starter case studies: replace these with real projects during the repository audit.
export const projects: Project[] = [
  {
    slug: "invoice-ocr",
    number: "01",
    title: "Invoice OCR",
    summary:
      "A document pipeline that turns inconsistent invoice images into validated, structured records.",
    category: "Computer Vision",
    status: "Prototype",
    technologies: ["Python", "FastAPI", "OpenCV"],
    capabilities: ["OCR", "Field extraction", "Validation"],
    proof: "Case study",
    year: "2026",
    accent: "lime",
    problem:
      "Manual invoice entry is slow, inconsistent, and difficult to scale across layouts from different suppliers.",
    solution:
      "A staged extraction pipeline cleans each image, detects text, maps fields into a common schema, and flags uncertain values for review.",
    contribution:
      "Designed the extraction workflow, confidence rules, API contract, and a review-friendly output format.",
    result:
      "A reusable prototype that demonstrates the full path from raw document to structured JSON.",
  },
  {
    slug: "rag-knowledge-assistant",
    number: "02",
    title: "RAG Knowledge Assistant",
    summary:
      "A grounded question-answering system for searching private documentation with visible sources.",
    category: "AI Applications",
    status: "Active",
    technologies: ["TypeScript", "LLM", "Vector Search"],
    capabilities: ["RAG", "Citations", "Semantic search"],
    proof: "Walkthrough",
    year: "2026",
    accent: "coral",
    problem:
      "Important information is distributed across long documents, while generic chat tools cannot reliably cite private knowledge.",
    solution:
      "Documents are chunked, embedded, retrieved by meaning, and supplied to an answer layer that keeps source references attached.",
    contribution:
      "Built the retrieval flow, prompt contract, citation model, and failure states for low-confidence questions.",
    result:
      "A focused assistant concept that prioritizes traceability over unsupported answers.",
  },
  {
    slug: "data-pipeline-monitor",
    number: "03",
    title: "Data Pipeline Monitor",
    summary:
      "An operations view that surfaces broken jobs, stale datasets, and quality issues before users notice.",
    category: "Data Systems",
    status: "Experiment",
    technologies: ["Python", "PostgreSQL", "Docker"],
    capabilities: ["Observability", "Data quality", "Alerts"],
    proof: "Screenshots",
    year: "2025",
    accent: "blue",
    problem:
      "Small data teams often discover failed jobs through downstream complaints instead of proactive monitoring.",
    solution:
      "A lightweight monitor records job runs, freshness checks, and quality tests, then groups failures by urgency.",
    contribution:
      "Defined the health model, designed the monitoring interface, and implemented the event-processing prototype.",
    result:
      "A compact experiment showing how a team can move from scattered logs to an actionable system view.",
  },
  {
    slug: "workflow-automator",
    number: "04",
    title: "Workflow Automator",
    summary:
      "A configurable worker that connects repetitive business steps into observable, retryable workflows.",
    category: "Automation",
    status: "Prototype",
    technologies: ["Node.js", "REST APIs", "Queues"],
    capabilities: ["Scheduling", "Retries", "Webhooks"],
    proof: "Code available",
    year: "2025",
    accent: "lime",
    problem:
      "Repetitive handoffs between tools waste time and fail silently when held together by one-off scripts.",
    solution:
      "A small workflow engine models each handoff as a step with explicit inputs, retries, and execution history.",
    contribution:
      "Created the workflow model, connector interface, retry behavior, and execution timeline.",
    result:
      "A foundation for turning fragile scripts into understandable, recoverable automations.",
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
