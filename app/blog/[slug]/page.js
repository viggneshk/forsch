import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItem } from "../../../lib/content-store";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getContentItem("blog", slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.seoTitle || post.title} | Forsch`,
      description: post.metaDescription || post.summary,
      url: `https://forsch.io/blog/${post.slug}`,
      type: "article"
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getContentItem("blog", slug);
  if (!post) notFound();

  return (
    <main className="use-case-page-shell">
      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span aria-current="page">{post.title}</span>
        </nav>
        <article className="article-layout">
          <header className="use-case-hero detail-hero">
            <p className="section-tag">{post.category || post.heroLabel || "Blog"}</p>
            <h1>{post.title}</h1>
            <p className="use-case-hero-copy">{post.summary}</p>
          </header>
          <section className="detail-card article-card">
            {(post.body || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          <section className="detail-card">
            <p className="section-tag">Key takeaways</p>
            <h2>What to keep in mind</h2>
            <ul className="detail-list">
              {(post.takeaways || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="detail-cta">
            <div className="cta-card">
              <p className="section-tag">Next step</p>
              <h2>{post.cta}</h2>
              <p>Use the post as a starting point, then turn it into a workflow plan that matches your actual systems and constraints.</p>
              <a className="button button-primary" href="mailto:hello@forsch.io?subject=Blog%20Inquiry">
                Book a discovery call
              </a>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
