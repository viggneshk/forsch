import Link from "next/link";
import { getPublicContentCollection } from "../../lib/content-store";
import { buildPublicUrl } from "../../lib/site-config";
import {
  buildBreadcrumbStructuredData,
  buildCollectionMetadata,
  buildCollectionStructuredData
} from "../../lib/seo";

export const metadata = buildCollectionMetadata({
  title: "Blog",
  description: "Forsch blog posts on AI strategy, implementation, workflows, and practical system design.",
  path: "/blog",
  keywords: ["AI strategy blog", "AI workflow design", "Forsch blog", "production AI systems"]
});

export default async function BlogPage() {
  const posts = await getPublicContentCollection("blog");
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", url: buildPublicUrl("/") },
      { name: "Blog", url: buildPublicUrl("/blog") }
    ]),
    buildCollectionStructuredData({
      title: "Forsch Blog",
      description: "Practical posts from Forsch on prioritization, implementation, workflow design, and production realities.",
      path: "/blog",
      items: posts
    })
  ].filter(Boolean);

  return (
    <main className="use-case-page-shell">
      {structuredData.map((item, index) => (
        <script
          key={`blog-list-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Blog</span>
        </nav>
        <section className="use-case-hero">
          <p className="section-tag">Blog</p>
          <h1>Operational thinking for AI systems that need to work in the real world.</h1>
          <p className="use-case-hero-copy">
            Practical posts from Forsch on prioritization, implementation, workflow design, and production realities.
          </p>
        </section>
        <section className="hub-grid">
          {posts.map((post) => (
            <article key={post.slug} className="hub-card">
              {post.heroImage ? (
                <div className="hub-visual">
                  {post.heroImageExists ? (
                    <img src={post.heroImage} alt={post.heroImageAlt || post.title} />
                  ) : (
                    <p>{post.heroImageAlt || post.title}</p>
                  )}
                </div>
              ) : null}
              <p className="section-tag">{post.category || "Blog"}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <Link href={`/blog/${post.slug}`} className="button button-primary">
                Read post
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
