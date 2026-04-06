import Link from "next/link";
import { getContentCollection } from "../../lib/content-store";

export const metadata = {
  title: "AI Use Cases",
  description:
    "Explore practical AI implementation use cases from Forsch, including lead qualification, support copilots, internal knowledge systems, reporting automation, and workflow automation.",
  alternates: {
    canonical: "/use-cases"
  },
  openGraph: {
    title: "AI Use Cases | Forsch",
    description:
      "A library of practical AI implementation use cases for revenue, support, operations, reporting, and product teams.",
    url: "https://forsch.io/use-cases",
    type: "website"
  }
};

export default async function UseCasesPage() {
  const useCases = await getContentCollection("use-case");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://forsch.io" },
      { "@type": "ListItem", position: 2, name: "Use Cases", item: "https://forsch.io/use-cases" }
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
          <span aria-current="page">Use Cases</span>
        </nav>

        <section className="use-case-hero">
          <p className="section-tag">Use-case library</p>
          <h1>AI use cases built around real workflows, not generic promises.</h1>
          <p className="use-case-hero-copy">
            Each page below focuses on a distinct operational problem, the AI system
            Forsch would implement, the integrations involved, and the outcomes teams
            should expect from production-ready delivery.
          </p>
        </section>

        <section className="hub-grid" aria-label="Use case library">
          {useCases.map((item) => (
            <article key={item.slug} className="hub-card">
              <p className="section-tag">{item.shortTitle}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <div className="hub-audience">
                {(item.audience || []).map((group) => (
                  <span key={group}>{group}</span>
                ))}
              </div>
              <Link href={`/use-cases/${item.slug}`} className="button button-primary">
                View use case
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
