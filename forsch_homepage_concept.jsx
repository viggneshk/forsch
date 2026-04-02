import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Workflow,
  Cog,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers3,
  LineChart,
  Braces,
  Database,
  MessagesSquare,
  Gauge,
} from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "AI strategy and scoping",
    text: "Identify the highest-leverage AI opportunities, define the architecture, and turn ambition into a buildable roadmap.",
  },
  {
    icon: Bot,
    title: "Custom AI development",
    text: "Build copilots, agents, internal tools, and AI-enabled product features tailored to your workflows and data.",
  },
  {
    icon: Cog,
    title: "Production deployment",
    text: "Ship with observability, human review steps, safeguards, and documentation so your team can run it with confidence.",
  },
  {
    icon: Workflow,
    title: "Workflow automation",
    text: "Connect systems, approvals, and data flows to remove manual work and improve speed across the business.",
  },
];

const process = [
  {
    title: "Discovery",
    text: "A focused session to understand your goals, bottlenecks, data, and current stack.",
  },
  {
    title: "Design and scope",
    text: "Define the workflow, architecture, edge cases, human review points, and implementation plan.",
  },
  {
    title: "Build and iterate",
    text: "Implement quickly, test with your team in the loop, and refine based on real usage.",
  },
  {
    title: "Ship and hand off",
    text: "Deploy with monitoring, documentation, and ownership clarity so the system works beyond launch.",
  },
];

const proof = [
  "Production-focused, not slide-deck consulting",
  "Built for startups and mid-market teams",
  "AI, automation, workflows, and transformation",
  "Hands-on implementation with measurable outcomes",
];

const stats = [
  { value: "12+", label: "AI systems shipped to production" },
  { value: "3x", label: "average build speed vs. in-house starts" },
  { value: "90%", label: "of clients expand scope after the first project" },
];

const useCases = [
  "AI lead qualification and follow-up",
  "Support copilots and knowledge workflows",
  "Internal ops automation and approvals",
  "Reporting, analytics, and decision support",
  "Workflow modernization across teams",
  "AI-powered product experiences",
];

function ForschLogo() {
  return (
    <svg
      width="180"
      height="36"
      viewBox="0 0 360 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto md:h-9"
      aria-label="Forsch"
      role="img"
    >
      <path
        d="M18 21L58 42L18 63"
        stroke="#BEF264"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <text
        x="92"
        y="50"
        fill="#1F2937"
        fontFamily="Georgia, Times New Roman, serif"
        fontSize="44"
        fontWeight="700"
        letterSpacing="0"
      >
        forsch
      </text>
      <rect x="314" y="54" width="34" height="8" fill="#BEF264" />
    </svg>
  );
}

export default function ForschHomepageConcept() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8 lg:px-10">
        <header className="sticky top-0 z-30 mb-8 rounded-full border border-black/5 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ForschLogo />
            </div>
            <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
              <a href="#services" className="hover:text-slate-900">Services</a>
              <a href="#process" className="hover:text-slate-900">Process</a>
              <a href="#contact" className="hover:text-slate-900">Contact</a>
            </nav>
            <button className="rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-lime-200">
              Get in touch
            </button>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-lime-700 shadow-sm">
              AI implementation partner
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl lg:text-[4.45rem] lg:leading-[1.02]">
              <span className="font-serif font-normal">We turn your AI ambitions into </span>
              <span className="font-serif italic font-normal text-lime-600">production</span>
              <span className="font-serif font-normal"> systems</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Forsch partners with startups and growing companies to design, build, and ship AI systems that actually work, not just demos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-lime-200">
                Book a discovery call <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                See how we work
              </button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {proof.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-900" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="rounded-[1.6rem] border border-slate-100 bg-slate-950 p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/70">Implementation snapshot</div>
                    <div className="mt-1 text-2xl font-semibold">Lead handling workflow</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Layers3 className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { icon: MessagesSquare, text: "Capture inbound leads from forms and CRM" },
                    { icon: Gauge, text: "Score intent using AI rules and context" },
                    { icon: Workflow, text: "Route qualified leads instantly to the right team" },
                    { icon: BarChart3, text: "Trigger follow-up, summaries, and reporting" },
                  ].map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.text} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-sm text-white/90">{step.text}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/55">
                      <Braces className="h-3.5 w-3.5" />
                      Routing logic
                    </div>
                    <pre className="mt-3 overflow-hidden whitespace-pre-wrap text-[11px] leading-5 text-lime-200">
{`if (score > 80) {
  route = "sales"
  notify = true
}`}
                    </pre>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/55">
                      <Database className="h-3.5 w-3.5" />
                      Example output
                    </div>
                    <pre className="mt-3 overflow-hidden whitespace-pre-wrap text-[11px] leading-5 text-cyan-200">
{`{
  "intent": "high",
  "owner": "AE",
  "status": "routed"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-100 bg-[#f7f5ef] p-5">
                  <div className="flex items-center gap-3 text-slate-700">
                    <LineChart className="h-5 w-5" />
                    <span className="text-sm font-medium">Outcome focus</span>
                  </div>
                  <div className="mt-4 text-3xl font-semibold tracking-tight">32%</div>
                  <div className="mt-1 text-sm text-slate-500">Faster response time</div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-100 bg-[#f7f5ef] p-5">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">Implementation style</span>
                  </div>
                  <div className="mt-4 text-lg font-semibold">Human-in-the-loop</div>
                  <div className="mt-1 text-sm text-slate-500">Practical, monitored, production-ready</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-6 hidden h-32 w-32 rounded-full bg-lime-300/20 blur-3xl md:block" />
            <div className="absolute -right-2 -top-3 hidden h-24 w-24 rounded-full bg-slate-900/5 blur-2xl md:block" />
          </motion.div>
        </section>

        <section className="mt-12 rounded-[1.8rem] border border-black/5 bg-white px-6 py-6 shadow-sm md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border-slate-100 md:border-r md:pr-5 last:border-r-0 last:pr-0">
                <div className="text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-[2rem] border border-black/5 bg-white px-6 py-10 shadow-sm md:px-8">
          <div className="grid gap-6 md:grid-cols-3 md:items-end">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.16em] text-lime-700">What we do</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                End-to-end AI implementation, not just advice.
              </h2>
            </div>
            <p className="md:col-span-2 text-base leading-7 text-slate-600">
              We do not hand you a strategy deck and walk away. Forsch embeds with your team, designs the right workflow, and builds the thing.
            </p>
          </div>
        </section>

        <section id="services" className="mt-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f5ef] text-slate-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="process" className="mt-24">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.16em] text-lime-700">How it works</div>
            <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              From first call to production in weeks, not quarters.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A lean, high-velocity process designed for teams that want speed, clarity, and real implementation.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {process.map((item, idx) => (
              <div key={item.title} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
                <div className="text-4xl font-serif text-lime-700">0{idx + 1}</div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="use-cases" className="mt-24">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.16em] text-lime-700">Use cases</div>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Where Forsch creates leverage.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Start with one high-value workflow, prove it works, then expand across operations, customer experience, and internal systems.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-black/5 bg-white px-5 py-5 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="rounded-[2rem] border border-black/5 bg-slate-950 px-8 py-12 text-white shadow-[0_20px_70px_rgba(15,23,42,0.1)] md:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-lime-300">Get started</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Ready to ship AI that actually works?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">
                Book a free discovery call. No pitch deck, no fluff, just a focused conversation about where AI can create the most value for your business.
              </p>
              <button className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-lime-200">
                Book a discovery call <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="contact" className="mt-10 flex items-center justify-between border-t border-black/5 px-1 pt-6 text-sm text-slate-500">
          <div>© 2026 Forsch. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900">LinkedIn</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-900">hello@forsch.io</a>
          </div>
        </section>
      </div>
    </div>
  );
}
