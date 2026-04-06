import Link from "next/link";
import { getContentCollection } from "../../lib/content-store";

export const metadata = {
  title: "Articles",
  description: "Long-form Forsch articles on AI implementation, operations, and production system design."
};

export default async function ArticlesPage() {
  const articles = await getContentCollection("article");

  return (
    <main className="use-case-page-shell">
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
