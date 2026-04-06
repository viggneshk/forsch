import Link from "next/link";
import { getContentCollection } from "../../lib/content-store";

export const metadata = {
  title: "Blog",
  description: "Forsch blog posts on AI strategy, implementation, workflows, and practical system design."
};

export default async function BlogPage() {
  const posts = await getContentCollection("blog");

  return (
    <main className="use-case-page-shell">
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
