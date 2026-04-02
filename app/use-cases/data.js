export const useCaseLibrary = [
  {
    slug: "ai-lead-qualification",
    title: "AI Lead Qualification for B2B Startups",
    shortTitle: "AI lead qualification",
    summary:
      "Capture, score, route, and follow up on inbound leads faster so revenue teams respond while intent is still high.",
    audience: ["Founders", "Revenue leaders", "RevOps teams", "Sales teams"],
    problem:
      "Inbound leads often sit in forms, inboxes, and CRMs waiting for manual review. High-intent prospects get delayed, SDR time goes into repetitive triage, and handoffs between marketing and sales become inconsistent.",
    whatItDoes:
      [
        "Captures inbound lead data from forms, CRM records, enrichment tools, and scheduling workflows.",
        "Scores intent based on firmographic fit, message quality, source context, and prior account activity.",
        "Routes qualified leads to the right owner instantly while triggering summaries, Slack alerts, and next-step tasks.",
        "Keeps lower-intent leads in nurture workflows with AI-generated follow-up and clean handoff notes."
      ],
    implementation:
      [
        "Discovery to map lead sources, qualification rules, edge cases, and sales handoff expectations.",
        "Workflow design across CRM, forms, enrichment, calendar booking, and internal messaging tools.",
        "Production deployment with approval rules, observability, retry handling, and auditability.",
        "Ongoing tuning based on lead quality, response-time metrics, and close-loop feedback from sales."
      ],
    workflow:
      [
        "Website form or inbound request creates a lead event.",
        "AI enriches and scores the lead using message context, company fit, and existing CRM history.",
        "The system decides whether to route, nurture, or request human review.",
        "Sales receives a concise summary with recommended next action and ownership."
      ],
    outcomes: [
      "Faster lead response times",
      "Fewer qualified leads lost between teams",
      "Less manual triage for SDR and RevOps teams",
      "More consistent qualification logic across channels"
    ],
    integrations: ["HubSpot", "Salesforce", "Clearbit", "Apollo", "Slack", "Calendly", "Webflow forms"],
    faqs: [
      {
        question: "Can the workflow keep human review before a lead is routed?",
        answer:
          "Yes. Forsch typically designs human-in-the-loop checkpoints for higher-risk routing decisions or high-value segments."
      },
      {
        question: "Does this only work for high lead volume teams?",
        answer:
          "No. It is useful anywhere response time, qualification consistency, and clean routing matter, even for lean revenue teams."
      }
    ],
    cta: "Talk through your lead routing workflow"
  },
  {
    slug: "customer-support-copilot",
    title: "Customer Support Copilot for SaaS Teams",
    shortTitle: "Customer support copilot",
    summary:
      "Help support teams resolve tickets faster with AI-assisted answers, internal context, and safe escalation paths.",
    audience: ["Support leads", "Customer experience teams", "SaaS operations teams"],
    problem:
      "Support teams waste time searching across docs, prior tickets, product notes, and Slack threads. Resolution quality varies by agent, and escalations happen too late because context is fragmented.",
    whatItDoes:
      [
        "Pulls relevant knowledge from help docs, internal SOPs, prior ticket history, and product notes.",
        "Drafts suggested replies and troubleshooting steps directly inside the support workflow.",
        "Flags uncertainty, escalation triggers, and missing information before an answer is sent.",
        "Creates clean summaries for engineering, success, or product handoffs."
      ],
    implementation:
      [
        "Knowledge audit to identify source systems, documentation gaps, and support workflow bottlenecks.",
        "Retrieval and prompt architecture tuned for accuracy, escalation logic, and product-specific nuance.",
        "Integration into help desk workflows with feedback loops and article improvement suggestions.",
        "Monitoring for answer quality, fallback behavior, and escalation correctness."
      ],
    workflow:
      [
        "A new ticket arrives from chat, email, or portal.",
        "The copilot retrieves the most relevant internal and external context.",
        "It drafts a suggested response with links, confidence signals, and escalation guidance.",
        "The support agent reviews, edits, and sends or escalates."
      ],
    outcomes: [
      "Faster first-response and resolution times",
      "More consistent support quality across agents",
      "Less context switching for support teams",
      "Better escalations with cleaner summaries"
    ],
    integrations: ["Zendesk", "Intercom", "Slack", "Notion", "Confluence", "Linear", "Jira"],
    faqs: [
      {
        question: "Will the copilot answer customers automatically?",
        answer:
          "It can, but most teams start with agent assist only. Forsch usually phases automation in after accuracy and review controls are proven."
      },
      {
        question: "Can it use both public docs and internal docs?",
        answer:
          "Yes. That combination is often where the biggest value comes from because agents need both customer-safe answers and internal operating context."
      }
    ],
    cta: "Talk through your support workflow"
  },
  {
    slug: "internal-knowledge-assistant",
    title: "Internal Knowledge Assistant for Ops Teams",
    shortTitle: "Internal knowledge assistant",
    summary:
      "Give teams one reliable place to ask operational questions and retrieve trusted answers from internal systems and documentation.",
    audience: ["Operations teams", "People teams", "Enablement leaders", "Internal systems owners"],
    problem:
      "Critical process knowledge is scattered across docs, folders, tools, and tribal memory. Teams interrupt each other for repeat questions, onboarding slows down, and answers vary depending on who happens to reply.",
    whatItDoes:
      [
        "Searches across internal documentation, SOPs, policy pages, and messaging archives.",
        "Answers common questions in natural language with citations back to the source material.",
        "Routes uncertain or stale questions for review so the knowledge base improves over time.",
        "Surfaces gaps in documentation where teams rely too heavily on informal memory."
      ],
    implementation:
      [
        "Discovery to define the trusted source set, access model, and answer quality bar.",
        "Retrieval pipeline design with chunking, permissions, source citations, and fallback rules.",
        "Deployment inside internal workflows such as Slack, intranets, or support portals.",
        "Ongoing measurement of usage, answer confidence, and documentation coverage."
      ],
    workflow:
      [
        "A team member asks a question in Slack or an internal portal.",
        "The assistant retrieves relevant policy, SOP, or system context.",
        "It returns an answer with source references and flags if human confirmation is needed.",
        "Question trends feed into documentation improvement and automation opportunities."
      ],
    outcomes: [
      "Less time lost to repeated internal questions",
      "Faster onboarding for new hires",
      "More consistent operational answers",
      "Better visibility into missing or outdated documentation"
    ],
    integrations: ["Slack", "Notion", "Google Drive", "Confluence", "SharePoint", "HRIS portals"],
    faqs: [
      {
        question: "How do you stop the assistant from exposing the wrong content?",
        answer:
          "Permissions and source scoping are part of the core architecture. Forsch treats access control as a first-order implementation concern, not a later patch."
      },
      {
        question: "Can it cite where each answer came from?",
        answer:
          "Yes. Source-aware answers are usually essential for trust, especially in internal ops, finance, and policy workflows."
      }
    ],
    cta: "Talk through your internal knowledge workflow"
  },
  {
    slug: "reporting-and-analytics-automation",
    title: "Reporting and Analytics Automation for Growing Teams",
    shortTitle: "Reporting and analytics automation",
    summary:
      "Automate repetitive reporting workflows so teams spend less time assembling updates and more time acting on them.",
    audience: ["Operations leaders", "Finance teams", "RevOps teams", "Founders"],
    problem:
      "Teams pull data from multiple systems, clean it by hand, and rebuild recurring reports every week. It is slow, error-prone, and makes it harder to trust the numbers or act on them quickly.",
    whatItDoes:
      [
        "Pulls data from source systems, validates it, and assembles recurring reports automatically.",
        "Generates narrative summaries and highlights shifts, exceptions, or anomalies worth attention.",
        "Routes reports to the right channels on the right cadence with contextual commentary.",
        "Creates a repeatable workflow for approvals, exceptions, and source-level issue handling."
      ],
    implementation:
      [
        "Discovery of source systems, KPI definitions, reporting cadence, and decision stakeholders.",
        "Pipeline design for extraction, transformation, reconciliation, and business-rule validation.",
        "Delivery into dashboards, email summaries, Slack channels, or board-ready operating reviews.",
        "Monitoring around freshness, failed jobs, and metric consistency."
      ],
    workflow:
      [
        "Source systems update throughout the day or week.",
        "The reporting workflow fetches, validates, and transforms the required data.",
        "AI produces a concise summary of movement, anomalies, and recommended follow-up.",
        "Stakeholders receive a consistent report package with clear next actions."
      ],
    outcomes: [
      "Less manual report assembly",
      "Faster visibility into business changes",
      "More consistent KPI definitions and reporting logic",
      "Higher trust in operational and revenue reporting"
    ],
    integrations: ["BigQuery", "Snowflake", "Looker", "HubSpot", "Stripe", "Google Sheets", "Slack"],
    faqs: [
      {
        question: "Can this work before we have a full data warehouse?",
        answer:
          "Yes. Forsch can start with the highest-value sources and build a practical reporting workflow before a larger BI stack exists."
      },
      {
        question: "Is the AI writing reports from raw data automatically?",
        answer:
          "Yes, but only after the data pipeline and validation logic are trustworthy. The reporting summary should sit on top of clean operational logic."
      }
    ],
    cta: "Talk through your reporting workflow"
  },
  {
    slug: "workflow-automation-for-ops",
    title: "Workflow Automation for Ops Teams",
    shortTitle: "Workflow automation for ops teams",
    summary:
      "Remove repetitive operational work by connecting systems, approvals, and handoffs into one monitored workflow.",
    audience: ["Operations leads", "BizOps teams", "RevOps teams", "Internal systems teams"],
    problem:
      "Many internal workflows still run through spreadsheets, Slack messages, email approvals, and manual copy-paste. Work gets delayed, ownership becomes unclear, and exceptions are handled inconsistently.",
    whatItDoes:
      [
        "Connects multi-step operational processes across tools with clear triggers and approval logic.",
        "Moves requests, data, and status updates automatically between systems.",
        "Uses AI where judgment, summarization, classification, or routing improves the workflow.",
        "Maintains monitoring, auditability, and fallback handling for production use."
      ],
    implementation:
      [
        "Process mapping to identify bottlenecks, handoffs, approvals, and failure points.",
        "Workflow architecture across source tools, databases, internal portals, and communication layers.",
        "Pilot rollout with exception handling and measurable before-and-after operational metrics.",
        "Production hardening with ownership, observability, and documentation."
      ],
    workflow:
      [
        "A request or event enters the workflow from a form, CRM, spreadsheet, or internal tool.",
        "The system validates the request, enriches context, and decides the next path.",
        "Approvals, status updates, and downstream actions happen automatically where appropriate.",
        "Teams receive only the exceptions, summaries, and approvals that still need human attention."
      ],
    outcomes: [
      "Less repetitive manual ops work",
      "Faster cycle times across approvals and handoffs",
      "Clearer ownership and audit trails",
      "More scalable internal operating processes"
    ],
    integrations: ["Slack", "Airtable", "Notion", "HubSpot", "Google Workspace", "Asana", "Linear"],
    faqs: [
      {
        question: "Where does AI fit versus standard workflow automation?",
        answer:
          "AI is most useful where classification, routing, summarization, or flexible decision support are needed. Forsch combines both, instead of forcing AI into every step."
      },
      {
        question: "Can these workflows keep manual approvals?",
        answer:
          "Yes. Most operational systems should keep defined approval points, especially when data quality or business risk matters."
      }
    ],
    cta: "Talk through your ops workflow"
  },
  {
    slug: "embedded-ai-features",
    title: "Embedded AI Features for Product Teams",
    shortTitle: "Embedded AI features",
    summary:
      "Ship AI-powered product experiences that are useful, monitored, and grounded in the reality of production software.",
    audience: ["Product teams", "CTOs", "Engineering leaders", "Founders"],
    problem:
      "Teams want AI features inside the product, but many concepts never make it beyond demos because grounding, quality control, UX integration, and operating cost are not designed together.",
    whatItDoes:
      [
        "Adds AI-assisted drafting, search, summarization, classification, or workflow actions directly inside the product.",
        "Designs user-facing experiences around confidence, editing, fallback paths, and system feedback.",
        "Connects product data, user permissions, and operational workflows into the AI feature.",
        "Supports production concerns such as latency, observability, moderation, and cost control."
      ],
    implementation:
      [
        "Discovery around product intent, user value, failure modes, and technical constraints.",
        "Architecture for model orchestration, retrieval, context injection, and evaluation.",
        "Implementation inside the product stack with instrumentation and safe release controls.",
        "Post-launch iteration on usage, quality, and operational cost."
      ],
    workflow:
      [
        "A user triggers an AI-assisted action inside the product.",
        "The system gathers relevant product context, permissions, and user-specific data.",
        "The AI feature generates an output or recommendation with appropriate safeguards.",
        "Usage data and review signals feed future tuning and product iteration."
      ],
    outcomes: [
      "Faster time to useful AI features in production",
      "Better user experience than generic model wrappers",
      "More trust through grounded outputs and safe fallbacks",
      "Clearer path from AI experiment to shipped capability"
    ],
    integrations: ["Product databases", "Authentication layers", "Vector stores", "Analytics tools", "Support tooling"],
    faqs: [
      {
        question: "Can Forsch help with both the UX and the backend architecture?",
        answer:
          "Yes. Embedded AI features only work well when product experience and system design are handled together."
      },
      {
        question: "How do you reduce hallucination risk in product features?",
        answer:
          "By grounding outputs in the right data, constraining workflows where needed, and instrumenting the feature so failures are visible and correctable."
      }
    ],
    cta: "Talk through your product AI feature"
  }
];

export function getUseCaseBySlug(slug) {
  return useCaseLibrary.find((item) => item.slug === slug);
}
