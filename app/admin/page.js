import Link from "next/link";
import { logoutAdminAction } from "./actions";
import { requireAdminAuth } from "../../lib/admin-auth";
import { getContentCollection } from "../../lib/content-store";

const adminSections = [
  {
    slug: "use-cases",
    title: "Use cases",
    text: "Manage the SEO-focused use-case library and all spoke pages."
  },
  {
    slug: "blog",
    title: "Blog posts",
    text: "Create and edit shorter opinion, strategy, and implementation posts."
  },
  {
    slug: "articles",
    title: "Articles",
    text: "Manage long-form articles that can rank and work as LinkedIn destinations."
  }
];

export const metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPortalPage() {
  await requireAdminAuth();

  const useCases = await getContentCollection("use-case");
  const blogPosts = await getContentCollection("blog");
  const articles = await getContentCollection("article");
  const counts = {
    "use-cases": useCases.length,
    blog: blogPosts.length,
    articles: articles.length
  };

  return (
    <main className="use-case-page-shell">
      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Admin</span>
        </nav>

        <section className="use-case-hero">
          <p className="section-tag">Admin portal</p>
          <h1>Manage your SEO content library in one place.</h1>
          <p className="use-case-hero-copy">
            This setup uses the current file-backed implementation as a lightweight CMS.
            You can create and edit use cases, blog posts, and articles from separate screens.
          </p>
          <div className="admin-screen-links">
            <form action={logoutAdminAction}>
              <button type="submit" className="button button-secondary">Log out</button>
            </form>
          </div>
        </section>

        <section className="hub-grid">
          {adminSections.map((section) => (
            <article key={section.slug} className="hub-card">
              <p className="section-tag">{section.title}</p>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              <div className="admin-count-chip">{counts[section.slug]} items</div>
              <Link href={`/admin/${section.slug}`} className="button button-primary">
                Open screen
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
