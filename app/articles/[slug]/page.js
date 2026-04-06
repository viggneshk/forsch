import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItem } from "../../../lib/content-store";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getContentItem("article", slug);
  if (!article) return {};

  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.summary,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: `${article.seoTitle || article.title} | Forsch`,
      description: article.metaDescription || article.summary,
      url: `https://forsch.io/articles/${article.slug}`,
      type: "article"
    }
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await getContentItem("article", slug);
  if (!article) notFound();

  return (
    <main className="use-case-page-shell">
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
          </header>
          <section className="detail-card article-card">
            {(article.body || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          <section className="detail-card">
            <p className="section-tag">Key takeaways</p>
            <h2>What matters most</h2>
            <ul className="detail-list">
              {(article.takeaways || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="detail-cta">
            <div className="cta-card">
              <p className="section-tag">Next step</p>
              <h2>{article.cta}</h2>
              <p>If this article matches the systems questions your team is facing, Forsch can help turn the idea into a practical implementation plan.</p>
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
