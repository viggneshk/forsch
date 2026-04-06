import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItem } from "../../../lib/content-store";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const useCase = await getContentItem("use-case", slug);

  if (!useCase) {
    return {};
  }

  return {
    title: useCase.seoTitle || useCase.title,
    description: useCase.metaDescription || useCase.summary,
    alternates: {
      canonical: `/use-cases/${useCase.slug}`
    },
    openGraph: {
      title: `${useCase.seoTitle || useCase.title} | Forsch`,
      description: useCase.metaDescription || useCase.summary,
      url: `https://forsch.io/use-cases/${useCase.slug}`,
      type: "article"
    }
  };
}

function SectionList({ items }) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function UseCaseDetailPage({ params }) {
  const { slug } = await params;
  const useCase = await getContentItem("use-case", slug);

  if (!useCase) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://forsch.io" },
      { "@type": "ListItem", position: 2, name: "Use Cases", item: "https://forsch.io/use-cases" },
      { "@type": "ListItem", position: 3, name: useCase.title, item: `https://forsch.io/use-cases/${useCase.slug}` }
    ]
  };

  return (
    <main className="use-case-page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/use-cases">Use Cases</Link>
          <span>/</span>
          <span aria-current="page">{useCase.title}</span>
        </nav>

        <section className="use-case-hero detail-hero">
          <p className="section-tag">{useCase.shortTitle}</p>
          <h1>{useCase.title}</h1>
          <p className="use-case-hero-copy">{useCase.summary}</p>
        </section>

        <div className="detail-grid">
          <section className="detail-card">
            <p className="section-tag">Problem</p>
            <h2>What breaks down today</h2>
            <p>{useCase.problem}</p>
          </section>
          <section className="detail-card">
            <p className="section-tag">Who it is for</p>
            <h2>The teams that benefit most</h2>
            <SectionList items={useCase.audience || []} />
          </section>
          <section className="detail-card">
            <p className="section-tag">What the AI system does</p>
            <h2>Inputs, workflow, approvals, and outputs</h2>
            <SectionList items={useCase.whatItDoes || []} />
          </section>
          <section className="detail-card">
            <p className="section-tag">How Forsch implements it</p>
            <h2>From discovery to monitored deployment</h2>
            <SectionList items={useCase.implementation || []} />
          </section>
          <section className="detail-card detail-card-dark">
            <p className="section-tag">Example workflow</p>
            <h2>How the system moves through the process</h2>
            <SectionList items={useCase.workflow || []} />
          </section>
          <section className="detail-card">
            <p className="section-tag">Expected outcomes</p>
            <h2>What teams should expect to improve</h2>
            <SectionList items={useCase.outcomes || []} />
          </section>
          <section className="detail-card">
            <p className="section-tag">Integrations</p>
            <h2>Systems this workflow commonly connects to</h2>
            <div className="tag-list">
              {(useCase.integrations || []).map((integration) => (
                <span key={integration}>{integration}</span>
              ))}
            </div>
          </section>
          <section className="detail-card">
            <p className="section-tag">FAQ</p>
            <h2>Questions teams usually ask</h2>
            <div className="faq-list">
              {(useCase.faqs || []).map((faq) => (
                <article key={faq.question} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="detail-cta">
          <div className="cta-card">
            <p className="section-tag">Next step</p>
            <h2>{useCase.cta}</h2>
            <p>
              If this matches the kind of workflow you want to modernize, Forsch can
              map the implementation, integration points, review controls, and rollout plan with you.
            </p>
            <a className="button button-primary" href="mailto:hello@forsch.io?subject=Use%20Case%20Inquiry">
              Book a discovery call
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
