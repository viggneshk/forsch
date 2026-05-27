import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicContentCollection, getPublicContentItem } from "../../../lib/content-store";
import { buildPublicUrl } from "../../../lib/site-config";
import {
  buildBreadcrumbStructuredData,
  buildContentMetadata,
  buildFaqStructuredData,
  buildUseCaseStructuredData
} from "../../../lib/seo";

function VisualFigure({ image, fallbackTitle = "Planned visual" }) {
  if (!image) {
    return null;
  }

  if (image.assetExists && image.src) {
    return (
      <figure className="detail-visual">
        <img src={image.src} alt={image.alt || fallbackTitle} />
        <figcaption>{image.alt || fallbackTitle}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="detail-visual detail-visual-planned">
      <figcaption>{image.alt || fallbackTitle}</figcaption>
    </figure>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const useCase = await getPublicContentItem("use-case", slug);

  if (!useCase) {
    return {};
  }

  return buildContentMetadata("use-case", useCase);
}

export async function generateStaticParams() {
  const useCases = await getPublicContentCollection("use-case");

  return useCases.map((item) => ({
    slug: item.slug
  }));
}

function SectionList({ items }) {
  return (
    <ul className="detail-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export default async function UseCaseDetailPage({ params }) {
  const { slug } = await params;
  const useCase = await getPublicContentItem("use-case", slug);

  if (!useCase) {
    notFound();
  }

  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", url: buildPublicUrl("/") },
      { name: "Use Cases", url: buildPublicUrl("/use-cases") },
      { name: useCase.title, url: buildPublicUrl(`/use-cases/${useCase.slug}`) }
    ]),
    buildUseCaseStructuredData(useCase),
    buildFaqStructuredData(useCase.faqs || [])
  ].filter(Boolean);

  return (
    <main className="use-case-page-shell">
      {structuredData.map((item, index) => (
        <script
          key={`use-case-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

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
          {useCase.heroImage ? (
            <VisualFigure
              image={{
                src: useCase.heroImage,
                alt: useCase.heroImageAlt,
                assetExists: useCase.heroImageExists
              }}
              fallbackTitle={useCase.heroImageAlt || useCase.title}
            />
          ) : null}
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
              {(useCase.integrations || []).map((integration, index) => (
                <span key={`${integration}-${index}`}>{integration}</span>
              ))}
            </div>
          </section>
          {(useCase.faqs || []).length > 0 ? (
            <section className="detail-card">
              <p className="section-tag">FAQ</p>
              <h2>Questions teams usually ask</h2>
              <div className="faq-list">
                {(useCase.faqs || []).map((faq, index) => (
                  <article key={`${faq.question}-${index}`} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {(useCase.inlineImageSuggestions || []).length > 0 ? (
            <section className="detail-card">
              <p className="section-tag">Workflow visual</p>
              <h2>Planned implementation references</h2>
              {useCase.inlineImageSuggestions.map((image, index) => (
                <VisualFigure
                  key={`${useCase.slug}-visual-${index}`}
                  image={image}
                  fallbackTitle={image.alt || "Workflow visual"}
                />
              ))}
            </section>
          ) : null}
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
