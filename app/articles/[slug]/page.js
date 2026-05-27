import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicContentCollection, getPublicContentItem } from "../../../lib/content-store";
import { buildPublicUrl } from "../../../lib/site-config";
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData,
  buildContentMetadata,
  buildFaqStructuredData
} from "../../../lib/seo";

function toPlacementKey(value = "") {
  return `after-section:${String(value)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

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

function DetailSections({ item }) {
  return (
    <>
      {item.intro ? (
        <section className="detail-card article-card">
          <p>{item.intro}</p>
        </section>
      ) : null}
      {(item.body || []).length > 0 ? (
        <section className="detail-card article-card">
          {item.body.map((paragraph, index) => (
            <p key={`${item.slug}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </section>
      ) : null}
      {(item.sections || []).map((section, index) => (
        <section key={`${item.slug}-section-${index}`} className="detail-card article-card">
          {section.heading ? <h2>{section.heading}</h2> : null}
          {(section.paragraphs || []).map((paragraph, paragraphIndex) => (
            <p key={`${item.slug}-section-${index}-paragraph-${paragraphIndex}`}>{paragraph}</p>
          ))}
          {(section.bullets || []).length > 0 ? (
            <ul className="detail-list">
              {section.bullets.map((bullet, bulletIndex) => (
                <li key={`${item.slug}-section-${index}-bullet-${bulletIndex}`}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          <VisualFigure
            image={(item.inlineImageSuggestions || []).find(
              (candidate) => candidate.placement === toPlacementKey(section.heading)
            )}
            fallbackTitle={section.heading || "Workflow visual"}
          />
        </section>
      ))}
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getPublicContentItem("article", slug);

  if (!article) {
    return {};
  }

  return buildContentMetadata("article", article);
}

export async function generateStaticParams() {
  const articles = await getPublicContentCollection("article");

  return articles.map((item) => ({
    slug: item.slug
  }));
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await getPublicContentItem("article", slug);

  if (!article) {
    notFound();
  }

  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", url: buildPublicUrl("/") },
      { name: "Articles", url: buildPublicUrl("/articles") },
      { name: article.title, url: buildPublicUrl(`/articles/${article.slug}`) }
    ]),
    buildArticleStructuredData("article", article),
    buildFaqStructuredData(article.faqs || [])
  ].filter(Boolean);

  return (
    <main className="use-case-page-shell">
      {structuredData.map((item, index) => (
        <script
          key={`article-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/articles">Articles</Link>
          <span>/</span>
          <span aria-current="page">{article.title}</span>
        </nav>
        <article className="article-layout">
          <header className="use-case-hero detail-hero">
            <p className="section-tag">{article.category || article.heroLabel || "Article"}</p>
            <h1>{article.title}</h1>
            <p className="use-case-hero-copy">{article.summary}</p>
            {article.publishedAt || article.readingTimeMinutes ? (
              <p className="section-tag">
                {[article.publishedAt, article.readingTimeMinutes ? `${article.readingTimeMinutes} min read` : ""]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            ) : null}
            {article.heroImage ? (
              <VisualFigure
                image={{
                  src: article.heroImage,
                  alt: article.heroImageAlt,
                  assetExists: article.heroImageExists
                }}
                fallbackTitle={article.heroImageAlt || article.title}
              />
            ) : null}
          </header>
          <DetailSections item={article} />
          {(article.takeaways || []).length > 0 ? (
            <section className="detail-card">
              <p className="section-tag">Key takeaways</p>
              <h2>What matters most</h2>
              <ul className="detail-list">
                {article.takeaways.map((item, index) => (
                  <li key={`${article.slug}-takeaway-${index}`}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {(article.faqs || []).length > 0 ? (
            <section className="detail-card">
              <p className="section-tag">FAQ</p>
              <h2>Questions teams often ask</h2>
              <div className="faq-list">
                {article.faqs.map((faq, index) => (
                  <article key={`${article.slug}-faq-${index}`} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          <section className="detail-cta">
            <div className="cta-card">
              <p className="section-tag">Next step</p>
              <h2>{article.cta}</h2>
              <p>
                If this article matches the systems questions your team is facing,
                Forsch can help turn the idea into a practical implementation plan.
              </p>
              <a className="button button-primary" href="mailto:hello@forsch.io?subject=Article%20Inquiry">
                Book a discovery call
              </a>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
