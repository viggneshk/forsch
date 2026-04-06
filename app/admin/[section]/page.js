import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteContentAction, logoutAdminAction, saveContentAction } from "../actions";
import { requireAdminAuth } from "../../../lib/admin-auth";
import { getContentCollection } from "../../../lib/content-store";

const sectionConfig = {
  "use-cases": {
    type: "use-case",
    title: "Use cases",
    publicPath: "/use-cases"
  },
  blog: {
    type: "blog",
    title: "Blog posts",
    publicPath: "/blog"
  },
  articles: {
    type: "article",
    title: "Articles",
    publicPath: "/articles"
  }
};

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

function listToTextarea(items = []) {
  return items.join("\n");
}

function faqsToTextarea(items = []) {
  return items.map((item) => `${item.question} | ${item.answer}`).join("\n");
}

function ContentForm({ section, config, item }) {
  const isUseCase = config.type === "use-case";

  return (
    <form action={saveContentAction} className="admin-form-card">
      <input type="hidden" name="section" value={section} />
      <input type="hidden" name="originalId" value={item?.id || ""} />

      <div className="admin-form-grid">
        <label>
          <span>Slug</span>
          <input name="slug" defaultValue={item?.slug || ""} required />
        </label>
        <label>
          <span>Title</span>
          <input name="title" defaultValue={item?.title || ""} required />
        </label>
        <label>
          <span>SEO title</span>
          <input name="seoTitle" defaultValue={item?.seoTitle || ""} />
        </label>
        <label>
          <span>Meta description</span>
          <input name="metaDescription" defaultValue={item?.metaDescription || ""} />
        </label>
        <label className="admin-form-full">
          <span>Summary</span>
          <textarea name="summary" defaultValue={item?.summary || ""} rows={3} required />
        </label>

        {isUseCase ? (
          <>
            <label>
              <span>Short title</span>
              <input name="shortTitle" defaultValue={item?.shortTitle || ""} />
            </label>
            <label>
              <span>CTA</span>
              <input name="cta" defaultValue={item?.cta || ""} />
            </label>
            <label className="admin-form-full">
              <span>Problem</span>
              <textarea name="problem" defaultValue={item?.problem || ""} rows={4} />
            </label>
            <label>
              <span>Audience</span>
              <textarea name="audience" defaultValue={listToTextarea(item?.audience)} rows={5} />
            </label>
            <label>
              <span>Integrations</span>
              <textarea name="integrations" defaultValue={listToTextarea(item?.integrations)} rows={5} />
            </label>
            <label>
              <span>What it does</span>
              <textarea name="whatItDoes" defaultValue={listToTextarea(item?.whatItDoes)} rows={6} />
            </label>
            <label>
              <span>Implementation</span>
              <textarea name="implementation" defaultValue={listToTextarea(item?.implementation)} rows={6} />
            </label>
            <label>
              <span>Workflow</span>
              <textarea name="workflow" defaultValue={listToTextarea(item?.workflow)} rows={6} />
            </label>
            <label>
              <span>Outcomes</span>
              <textarea name="outcomes" defaultValue={listToTextarea(item?.outcomes)} rows={6} />
            </label>
            <label className="admin-form-full">
              <span>FAQs</span>
              <textarea
                name="faqs"
                defaultValue={faqsToTextarea(item?.faqs)}
                rows={6}
                placeholder="Question | Answer"
              />
            </label>
          </>
        ) : (
          <>
            <label>
              <span>Category</span>
              <input name="category" defaultValue={item?.category || ""} />
            </label>
            <label>
              <span>Published date</span>
              <input name="publishedAt" type="date" defaultValue={item?.publishedAt || ""} />
            </label>
            <label>
              <span>CTA</span>
              <input name="cta" defaultValue={item?.cta || ""} />
            </label>
            <label className="admin-form-full">
              <span>Body paragraphs</span>
              <textarea name="body" defaultValue={listToTextarea(item?.body)} rows={10} />
            </label>
            <label className="admin-form-full">
              <span>Key takeaways</span>
              <textarea name="takeaways" defaultValue={listToTextarea(item?.takeaways)} rows={5} />
            </label>
          </>
        )}
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="button button-primary">Save content</button>
        {item ? (
          <>
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" formAction={deleteContentAction} className="button button-secondary">
              Delete
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}

export default async function AdminSectionPage({ params }) {
  await requireAdminAuth();

  const { section } = await params;
  const config = sectionConfig[section];

  if (!config) {
    notFound();
  }

  const items = await getContentCollection(config.type);

  return (
    <main className="use-case-page-shell">
      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/admin">Admin</Link>
          <span>/</span>
          <span aria-current="page">{config.title}</span>
        </nav>

        <section className="use-case-hero">
          <p className="section-tag">Admin screen</p>
          <h1>Manage {config.title.toLowerCase()}.</h1>
          <p className="use-case-hero-copy">
            Create new entries or update existing ones. Changes write back to the current
            file-backed content store and update the public SEO pages.
          </p>
          <div className="admin-screen-links">
            <Link href={config.publicPath} className="button button-secondary">
              View public page
            </Link>
            <form action={logoutAdminAction}>
              <button type="submit" className="button button-secondary">Log out</button>
            </form>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>New {config.type === "use-case" ? "use case" : config.type}</h2>
          </div>
          <ContentForm section={section} config={config} />
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Existing {config.title.toLowerCase()}</h2>
          </div>
          <div className="admin-edit-list">
            {items.map((item) => (
              <details key={item.id} className="admin-edit-item">
                <summary>
                  <span>{item.title}</span>
                  <span>{item.slug}</span>
                </summary>
                <div className="admin-item-toolbar">
                  <Link href={`${config.publicPath}/${item.slug}`} className="button button-secondary">
                    Preview live page
                  </Link>
                </div>
                <ContentForm section={section} config={config} item={item} />
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
