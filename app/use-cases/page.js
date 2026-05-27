import Link from "next/link";
import { getPublicContentCollection } from "../../lib/content-store";
import { buildPublicUrl } from "../../lib/site-config";
import {
  buildBreadcrumbStructuredData,
  buildCollectionMetadata,
  buildCollectionStructuredData
} from "../../lib/seo";

export const metadata = buildCollectionMetadata({
  title: "AI Use Cases",
  description:
    "Explore practical AI implementation use cases from Forsch, including lead qualification, support copilots, internal knowledge systems, reporting automation, and workflow automation.",
  path: "/use-cases",
  keywords: [
    "AI use cases",
    "AI workflow automation",
    "AI lead qualification",
    "AI support copilot",
    "Forsch use cases"
  ]
});

export default async function UseCasesPage() {
  const useCases = await getPublicContentCollection("use-case");
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", url: buildPublicUrl("/") },
      { name: "Use Cases", url: buildPublicUrl("/use-cases") }
    ]),
    buildCollectionStructuredData({
      title: "Forsch AI Use Cases",
      description:
        "A library of practical AI implementation use cases for revenue, support, operations, reporting, and product teams.",
      path: "/use-cases",
      items: useCases
    })
  ].filter(Boolean);

  return (
    <main className="use-case-page-shell">
      {structuredData.map((item, index) => (
        <script
          key={`use-cases-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

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
              {item.heroImage ? (
                <div className="hub-visual">
                  {item.heroImageExists ? (
                    <img src={item.heroImage} alt={item.heroImageAlt || item.title} />
                  ) : (
                    <p>{item.heroImageAlt || item.title}</p>
                  )}
                </div>
              ) : null}
              <p className="section-tag">{item.shortTitle}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <div className="hub-audience">
                {(item.audience || []).map((group, index) => (
                  <span key={`${group}-${index}`}>{group}</span>
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
