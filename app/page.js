const services = [
  {
    title: "AI Strategy and Scoping",
    text: "Identify the highest-leverage AI opportunities, define the architecture, and turn ambition into a buildable roadmap."
  },
  {
    title: "Custom AI Development",
    text: "Build copilots, agents, internal tools, and AI-enabled product features tailored to your workflows and data."
  },
  {
    title: "Production Deployment",
    text: "Ship with observability, human review steps, safeguards, and documentation so your team can run it with confidence."
  },
  {
    title: "Workflow Automation",
    text: "Connect systems, approvals, and data flows to remove manual work and improve speed across the business."
  }
];

const process = [
  {
    title: "Discovery",
    text: "A focused session to understand your goals, bottlenecks, data, and current stack."
  },
  {
    title: "Design and Scope",
    text: "Define the workflow, architecture, edge cases, human review points, and implementation plan."
  },
  {
    title: "Build and Iterate",
    text: "Implement quickly, test with your team in the loop, and refine based on real usage."
  },
  {
    title: "Ship and Hand Off",
    text: "Deploy with monitoring, documentation, and ownership clarity so the system works beyond launch."
  }
];

const proof = [
  "Production-focused, not slide-deck consulting",
  "Built for startups and mid-market teams",
  "AI, automation, workflows, and transformation",
  "Hands-on implementation with measurable outcomes"
];

const stats = [
  { value: "12+", label: "AI systems shipped to production" },
  { value: "3x", label: "average build speed vs. in-house starts" },
  { value: "90%", label: "of clients expand scope after the first project" }
];

const useCases = [
  "AI lead qualification and follow-up",
  "Support copilots and knowledge workflows",
  "Internal ops automation and approvals",
  "Reporting, analytics, and decision support",
  "Workflow modernization across teams",
  "AI-powered product experiences"
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Forsch",
  url: "https://forsch.io",
  email: "hello@forsch.io",
  description:
    "Forsch designs, builds, and deploys production-ready AI systems for startups and growing companies.",
  areaServed: "Worldwide",
  serviceType: [
    "AI Strategy",
    "Custom AI Development",
    "Workflow Automation",
    "Production AI Deployment"
  ]
};

function ForschLogo() {
  return (
    <svg
      width="180"
      height="36"
      viewBox="0 0 360 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo"
      aria-label="Forsch"
      role="img"
    >
      <path
        d="M18 21L58 42L18 63"
        stroke="#b4d455"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <text
        x="92"
        y="50"
        fill="#162027"
        fontFamily="Georgia, Times New Roman, serif"
        fontSize="44"
        fontWeight="700"
      >
        forsch
      </text>
      <rect x="314" y="54" width="34" height="8" fill="#b4d455" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path
        d="M20 7 10 17l-6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MiniIcon({ children }) {
  return <span className="mini-icon">{children}</span>;
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-orb orb-one" aria-hidden="true" />
      <div className="bg-orb orb-two" aria-hidden="true" />

      <div className="container">
        <header className="site-header">
          <a href="#top" className="brand" aria-label="Forsch home">
            <ForschLogo />
          </a>

          <nav className="desktop-nav" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#use-cases">Use Cases</a>
            <a href="#contact">Contact</a>
          </nav>

          <a className="button button-primary button-small" href="mailto:hello@forsch.io">
            Get in touch
          </a>
        </header>

        <section id="top" className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI implementation partner</p>
            <h1>
              We turn your AI ambitions into <em>production</em> systems
            </h1>
            <p className="lead">
              Forsch partners with startups and growing companies to design, build,
              and ship AI systems that actually work, not just demos.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="mailto:hello@forsch.io?subject=Discovery%20Call">
                Book a discovery call
                <ArrowIcon />
              </a>
              <a className="button button-secondary" href="#process">
                See how we work
              </a>
            </div>

            <ul className="proof-grid" aria-label="Why teams choose Forsch">
              {proof.map((item) => (
                <li key={item} className="proof-card">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="hero-panel" aria-label="Implementation example">
            <div className="hero-panel-dark">
              <div className="panel-head">
                <div>
                  <p>Implementation snapshot</p>
                  <h2>Lead handling workflow</h2>
                </div>
                <MiniIcon>Flow</MiniIcon>
              </div>

              <div className="workflow-list">
                <div className="workflow-item">
                  <MiniIcon>01</MiniIcon>
                  <span>Capture inbound leads from forms and CRM</span>
                </div>
                <div className="workflow-item">
                  <MiniIcon>02</MiniIcon>
                  <span>Score intent using AI rules and context</span>
                </div>
                <div className="workflow-item">
                  <MiniIcon>03</MiniIcon>
                  <span>Route qualified leads instantly to the right team</span>
                </div>
                <div className="workflow-item">
                  <MiniIcon>04</MiniIcon>
                  <span>Trigger follow-up, summaries, and reporting</span>
                </div>
              </div>

              <div className="code-grid">
                <div className="code-card">
                  <p className="code-label">Routing logic</p>
                  <pre>{`if (score > 80) {\n  route = "sales"\n  notify = true\n}`}</pre>
                </div>
                <div className="code-card">
                  <p className="code-label">Example output</p>
                  <pre>{`{\n  "intent": "high",\n  "owner": "AE",\n  "status": "routed"\n}`}</pre>
                </div>
              </div>
            </div>

            <div className="metric-grid">
              <article className="metric-card">
                <p className="metric-kicker">Outcome focus</p>
                <strong>32%</strong>
                <span>Faster response time</span>
              </article>
              <article className="metric-card">
                <p className="metric-kicker">Implementation style</p>
                <strong className="metric-phrase">Human-in-the-loop</strong>
                <span>Practical, monitored, production-ready</span>
              </article>
            </div>
          </aside>
        </section>

        <section className="stats-band" aria-label="Business results">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </section>

        <section className="intro-band">
          <div>
            <p className="section-tag">What we do</p>
            <h2>End-to-end AI implementation, not just advice.</h2>
          </div>
          <p>
            We do not hand you a strategy deck and walk away. Forsch embeds with
            your team, designs the right workflow, and builds the thing.
          </p>
        </section>

        <section id="services" className="section-block">
          <div className="card-grid services-grid">
            {services.map((service) => (
              <article key={service.title} className="info-card">
                <span className="card-chip">Service</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section-block">
          <div className="section-heading">
            <p className="section-tag">How it works</p>
            <h2>From first call to production in weeks, not quarters.</h2>
            <p>
              A lean, high-velocity process designed for teams that want speed,
              clarity, and real implementation.
            </p>
          </div>

          <div className="card-grid process-grid">
            {process.map((item, index) => (
              <article key={item.title} className="info-card">
                <p className="step-number">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="use-cases" className="section-block">
          <div className="section-heading section-heading-split">
            <div>
              <p className="section-tag">Use cases</p>
              <h2>Where Forsch creates leverage.</h2>
            </div>
            <p>
              Start with one high-value workflow, prove it works, then expand across
              operations, customer experience, and internal systems.
            </p>
          </div>

          <div className="card-grid use-case-grid">
            {useCases.map((item) => (
              <article key={item} className="use-case-card">
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-card">
            <p className="section-tag">Get started</p>
            <h2>Ready to ship AI that actually works?</h2>
            <p>
              Book a free discovery call. No pitch deck, no fluff, just a focused
              conversation about where AI can create the most value for your business.
            </p>
            <a className="button button-primary" href="mailto:hello@forsch.io?subject=Project%20Inquiry">
              Book a discovery call
              <ArrowIcon />
            </a>
          </div>
        </section>

        <footer id="contact" className="site-footer">
          <p>© 2026 Forsch. All rights reserved.</p>
          <div>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span aria-hidden="true">·</span>
            <a href="mailto:hello@forsch.io">hello@forsch.io</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
