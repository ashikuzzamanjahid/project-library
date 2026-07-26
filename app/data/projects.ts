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
  repository?: string;
  demo?: string;
  documentation?: string;
  role?: string;
  updatedAt?: string;
  overview?: string[];
  features?: {
    title: string;
    description: string;
  }[];
  screenshots?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  }[];
  architecture?: string[];
  installation?: string[];
  usage?: string[];
  challenges?: {
    title: string;
    description: string;
  }[];
  nextSteps?: string[];
  questions?: {
    question: string;
    answer: string;
  }[];
};

export const projects: Project[] = [
  {
    slug: "project-alexandria",
    number: "01",
    title: "Project Alexandria",
    summary:
      "A collaborative course-resource library where student submissions are reviewed before they become part of the shared catalog.",
    category: "Education Tools",
    status: "Active",
    technologies: ["React", "Vite", "Express", "MongoDB", "Mongoose", "JWT"],
    capabilities: ["Resource discovery", "Moderation", "Voting", "Reporting"],
    proof: "Source and documentation",
    year: "2026",
    accent: "lime",
    problem:
      "Course materials are often scattered across chats, drives, and personal bookmarks, making useful resources difficult to discover and difficult to verify.",
    solution:
      "Alexandria organizes resources by course, topic, and material type. Students can submit, vote on, annotate, and report links, while administrators review changes before publication.",
    contribution:
      "Built as a four-person BRACU CSE470 team project. Individual contribution notes can be expanded through the owner editor.",
    result:
      "A working React and Express application with authentication, role-based moderation, resource interaction, and seeded local test data.",
    repository:
      "https://github.com/ashikuzzamanjahid/ProjectAlexandria",
    role: "CSE470 team project",
    updatedAt: "March 2026",
    features: [
      {
        title: "Course and topic explorer",
        description:
          "Navigates a tree of courses and topics, then separates videos, slides, notes, resources, and additional material.",
      },
      {
        title: "Moderated submissions",
        description:
          "Keeps student-submitted links pending until an administrator approves or rejects them.",
      },
      {
        title: "Resource feedback",
        description:
          "Supports one vote per user, editable descriptions, and reports for broken or low-quality links.",
      },
      {
        title: "Role-based administration",
        description:
          "Provides dedicated review queues for submissions and reports, plus resource removal controls.",
      },
    ],
    screenshots: [],
    questions: [
      {
        question: "Why are submissions moderated?",
        answer:
          "The core rule is that student submissions never publish directly. Review protects the shared catalog from broken, misleading, or low-quality resources.",
      },
      {
        question: "How are users and roles handled?",
        answer:
          "The backend issues JWT bearer tokens and separates student and administrator permissions through authentication middleware.",
      },
      {
        question: "What remains to be built?",
        answer:
          "The repository lists profile and contribution history, threaded resource discussions, safer first-admin provisioning, and a future reputation layer as current priorities.",
      },
    ],
  },
  {
    slug: "grey-matter",
    number: "02",
    title: "GreyMatter",
    summary:
      "A text-first discussion platform designed for deliberate debate instead of follower counts and engagement chasing.",
    category: "Social Systems",
    status: "Active",
    technologies: ["React", "TypeScript", "Express", "SQLite", "JWT", "Vite"],
    capabilities: ["Structured debate", "Groups", "Messaging", "Moderation"],
    proof: "Source and technical notes",
    year: "2026",
    accent: "coral",
    problem:
      "Most social platforms reward visibility and reaction volume, which can distract from the reasoning inside a discussion.",
    solution:
      "GreyMatter removes public engagement mechanics and requires every reply to declare a SUPPORT, DENY, or CLARIFY stance, giving conversation threads an explicit argumentative structure.",
    contribution:
      "Implemented the full-stack prototype, its discussion model, authentication, SQLite persistence, messaging, notifications, and moderation safeguards.",
    result:
      "A production-buildable application with database integrity checks, secure cookie sessions, paginated feeds, and a documented moderation workflow.",
    repository: "https://github.com/ashikuzzamanjahid/grey-matter",
    role: "Full-stack design and development",
    updatedAt: "July 2026",
    features: [
      {
        title: "Stance-based replies",
        description:
          "Every reply must support, deny, or clarify, including nested replies that remain attached to the same post.",
      },
      {
        title: "Focused feeds and groups",
        description:
          "Offers global and following feeds, topic-linked groups, sorting, membership, and post editing with soft deletion.",
      },
      {
        title: "Private social layer",
        description:
          "Includes anonymous usernames, mutual-follow direct messages, mentions, and read-state notifications.",
      },
      {
        title: "Moderation workflow",
        description:
          "Lets users report posts or replies and gives administrators dismiss, removal, and guarded ban actions.",
      },
    ],
    screenshots: [],
    questions: [
      {
        question: "What makes GreyMatter anti-dopamine?",
        answer:
          "The interface is text-first and intentionally avoids follower and public engagement-count mechanics. Replies emphasize the stance and substance of an argument.",
      },
      {
        question: "How is account security handled?",
        answer:
          "Sessions use expiring JWTs in HttpOnly cookies. Production cookies are secure, mutations receive a same-origin check, and authenticated routes enforce ban status.",
      },
      {
        question: "What are the main known gaps?",
        answer:
          "The project still needs a complete CSRF token flow, broader automated test coverage, frontend feature modularization, and a structured moderation audit-log interface.",
      },
    ],
  },
  {
    slug: "foci-os",
    number: "03",
    title: "FOCI OS",
    summary:
      "A local-first productivity workspace combining planning, focus timers, habits, goals, notes, and portable backups.",
    category: "Productivity",
    status: "Active",
    technologies: ["React", "TypeScript", "Zustand", "Express", "Vite"],
    capabilities: ["Planning", "Focus timers", "Habit tracking", "Notes"],
    proof: "Source, documentation, and tests",
    year: "2026",
    accent: "blue",
    problem:
      "Personal planning is often split across calendars, task lists, timers, habit trackers, and notes that do not share the same context or backup format.",
    solution:
      "FOCI OS brings those tools into one terminal-inspired workspace, keeps state in the browser and a local server snapshot, and supports validated import, export, and purge operations.",
    contribution:
      "Designed and implemented the application shell, state model, persistence coordination, calendar helpers, focus timers, and backup workflow.",
    result:
      "A single-user local application with atomic server writes and regression coverage for dates, recurrences, habit streaks, and Pomodoro transitions.",
    repository: "https://github.com/ashikuzzamanjahid/foci_os",
    role: "Product design and full-stack development",
    updatedAt: "July 2026",
    features: [
      {
        title: "Plan",
        description:
          "Combines month, week, and day calendars with recurring events, special-day countdowns, weekly reviews, and prioritized tasks.",
      },
      {
        title: "Focus",
        description:
          "Provides configurable Pomodoro work and break cycles alongside a countdown timer and stopwatch.",
      },
      {
        title: "Track and write",
        description:
          "Includes searchable notes, editable tables, periodic goals, habit history, lifetime counts, and current streaks.",
      },
      {
        title: "Portable local data",
        description:
          "Synchronizes browser state to an atomic JSON snapshot and supports validated export, import, and complete purge controls.",
      },
    ],
    screenshots: [],
    questions: [
      {
        question: "Where is FOCI OS data stored?",
        answer:
          "Zustand persists a browser copy under the foci-storage key. The Express server also stores the latest valid state in a configurable JSON file using serialized atomic replacement.",
      },
      {
        question: "Is it ready for public multi-user hosting?",
        answer:
          "No. It is deliberately a single-user local application and has no authentication or multi-user conflict resolution. The server should not be publicly exposed without additional hardening.",
      },
      {
        question: "What does the test suite cover?",
        answer:
          "Regression tests cover local date formatting, habit streak boundaries, inclusive recurrence limits, and Pomodoro work, break, and final-cycle transitions.",
      },
    ],
  },
  {
    slug: "ai-news-bot",
    number: "04",
    title: "AI News Curator Bot",
    summary:
      "A Telegram news bot that builds personalized and discovery feeds while learning from likes, dislikes, saves, and completed reads.",
    category: "AI Automation",
    status: "Active",
    technologies: ["Node.js", "Telegram Bot API", "xAI Grok", "Axios", "lowdb"],
    capabilities: ["News aggregation", "Personalization", "AI scoring", "Read later"],
    proof: "Source and command reference",
    year: "2026",
    accent: "lime",
    problem:
      "General news feeds are noisy and repetitive, while manually maintaining a useful set of topics and trusted sources takes continuous effort.",
    solution:
      "The bot combines GNews and Newsdata results, scores and diversifies articles, and periodically asks Grok to translate interaction history into themes, exclusions, and better search terms.",
    contribution:
      "Built the Telegram command and callback flows, dual-source fetching, AI preference analysis, caching, rate limits, persistence, and backup behavior.",
    result:
      "A runnable Telegram bot with personalized and discovery feeds, per-user profiles, read-later queues, graceful retries, and bounded in-memory article state.",
    repository: "https://github.com/ashikuzzamanjahid/ai-news-bot",
    role: "Bot design and development",
    updatedAt: "April 2026",
    features: [
      {
        title: "Dual-source feeds",
        description:
          "Alternates GNews and Newsdata for personalized results and queries both sources in parallel for discovery.",
      },
      {
        title: "Interaction-based learning",
        description:
          "Uses likes, dislikes, saved articles, and completed reads to update AI-generated themes, exclusions, keywords, and confidence.",
      },
      {
        title: "Source-quality context",
        description:
          "Adds tiered trust scores, reliability badges, and geographic diversity across seven detected regions.",
      },
      {
        title: "Operational safeguards",
        description:
          "Uses command cooldowns, response caching, retries, per-user memory limits, hourly backups, and HTML escaping.",
      },
    ],
    screenshots: [],
    questions: [
      {
        question: "How does the bot learn a reader's preferences?",
        answer:
          "It records interaction signals and asks Grok to analyze the recent pattern after every five interactions. The resulting themes and keywords influence future discovery requests.",
      },
      {
        question: "Which external services are required?",
        answer:
          "The bot requires a Telegram token, GNews and Newsdata API keys, and an xAI Grok API key. Secrets are read from environment variables.",
      },
      {
        question: "How is user data retained?",
        answer:
          "Profiles are stored through lowdb in JSON, backed up hourly with the latest five backups retained, and can be cleared through a confirmed reset command.",
      },
    ],
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
