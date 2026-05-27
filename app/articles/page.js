import Link from "next/link";
import { getPublicContentCollection } from "../../lib/content-store";
import { buildPublicUrl } from "../../lib/site-config";
import {
  buildBreadcrumbStructuredData,
  buildCollectionMetadata,
  buildCollectionStructuredData
} from "../../lib/seo";

export const metadata = buildCollectionMetadata({
  title: "Articles",
  description: "Long-form Forsch articles on AI implementation, operations, and production system design.",
  path: "/articles",
  keywords: ["AI implementation articles", "production AI systems", "AI operations", "Forsch articles"]
});

export default async function ArticlesPage() {
  const articles = await getPublicContentCollection("article");
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", url: buildPublicUrl("/") },
      { name: "Articles", url: buildPublicUrl("/articles") }
    ]),
    buildCollectionStructuredData({
      title: "Forsch Articles",
      description: "Deeper Forsch articles for teams that want more than a high-level summary.",
      path: "/articles",
      items: articles
    })
  ].filter(Boolean);

  return (
    <main className="use-case-page-shell">
      {structuredData.map((item, index) => (
        <script
          key={`articles-list-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Articles</span>
        </nav>
        <section className="use-case-hero">
          <p className="section-tag">Articles</p>
          <h1>Long-form thinking on implementation, systems, and production AI.</h1>
          <p className="use-case-hero-copy">
            Deeper Forsch articles for teams that want more than a high-level summary.
          </p>
        </section>
        <section className="hub-grid">
          {articles.map((article) => (
            <article key={article.slug} className="hub-card">
              {article.heroImage ? (
                <div className="hub-visual">
                  {article.heroImageExists ? (
                    <img src={article.heroImage} alt={article.heroImageAlt || article.title} />
                  ) : (
                    <p>{article.heroImageAlt || article.title}</p>
                  )}
                </div>
              ) : null}
              <p className="section-tag">{article.category || "Article"}</p>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <Link href={`/articles/${article.slug}`} className="button button-primary">
                Read article
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
