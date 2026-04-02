"use client";

import Image from "next/image";
import { useState } from "react";

const workflowSteps = [
  { title: "Capture inbound leads from forms and CRM", icon: "chat" },
  { title: "Score intent using AI rules and context", icon: "gauge" },
  { title: "Route qualified leads instantly to the right team", icon: "route" },
  { title: "Trigger follow-up, summaries, and reporting", icon: "chart" }
];

const services = [
  {
    icon: "spark",
    title: "AI Strategy and Scoping",
    text: "Identify the highest-leverage AI opportunities, define the architecture, and turn ambition into a buildable roadmap."
  },
  {
    icon: "bot",
    title: "Custom AI Development",
    text: "Build copilots, agents, internal tools, and AI-enabled product features tailored to your workflows and data."
  },
  {
    icon: "shield",
    title: "Production Deployment",
    text: "Ship with observability, human review steps, safeguards, and documentation so your team can run it with confidence."
  },
  {
    icon: "flow",
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

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-icon">
      <path
        d="M6 8h12M6 12h12M6 16h12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-icon">
      <path
        d="M7 7l10 10M17 7 7 17"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
      <path
        d="M12 5 19 9l-7 4-7-4 7-4Zm0 6 7 4-7 4-7-4 7-4Zm7-2v6M5 9v6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ServiceIcon({ type }) {
  if (type === "spark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
        <path d="M12 3 14 9l6 3-6 3-2 6-2-6-6-3 6-3 2-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "bot") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
        <path d="M12 4v3M8 7h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3Zm2 5h.01M14 12h.01M9 18v2M15 18v2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
        <path d="M12 3 19 6v5c0 4.5-2.5 7.7-7 10-4.5-2.3-7-5.5-7-10V6l7-3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
      <path d="M7 7h4v4H7zM13 13h4v4h-4zM14 10l3-3M10 14l-3 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function WorkflowIcon({ type }) {
  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
        <path d="M7 7h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-4 3v-3H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "gauge") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
        <path d="M5 14a7 7 0 1 1 14 0M12 14l3-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "route") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
        <path d="M7 7h.01M17 17h.01M7 17h.01M7 7v6a4 4 0 0 0 4 4h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="service-icon">
      <path d="M6 18h12M8 15V9M12 15V6M16 15v-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-orb orb-one" aria-hidden="true" />
      <div className="bg-orb orb-two" aria-hidden="true" />

      <div className="container">
        <header className={`site-header${isMobileMenuOpen ? " mobile-menu-open" : ""}`}>
          <a href="#top" className="brand" aria-label="Forsch home">
            <Image
              src="/forsch.svg"
              alt="Forsch"
              width={1408}
              height={768}
              priority
              className="logo"
            />
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

          <a
            className="mobile-header-cta"
            href="mailto:hello@forsch.io"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get in touch
          </a>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-panel"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {isMobileMenuOpen ? (
            <div id="mobile-navigation-panel" className="mobile-menu-panel">
              <nav className="mobile-nav" aria-label="Mobile">
                <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>
                  Services
                </a>
                <a href="#process" onClick={() => setIsMobileMenuOpen(false)}>
                  Process
                </a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact
                </a>
              </nav>

              <a
                className="button button-primary mobile-menu-cta"
                href="mailto:hello@forsch.io?subject=Discovery%20Call"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book a discovery call
                <ArrowIcon />
              </a>
            </div>
          ) : null}
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
                <span className="mini-icon" aria-label="Workflow layers">
                  <StackIcon />
                </span>
              </div>

              <div className="workflow-list">
                {workflowSteps.map((step) => (
                  <div key={step.title} className="workflow-item">
                    <span className="workflow-badge">
                      <WorkflowIcon type={step.icon} />
                    </span>
                    <span>{step.title}</span>
                  </div>
                ))}
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
                <span className="service-badge">
                  <ServiceIcon type={service.icon} />
                </span>
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
