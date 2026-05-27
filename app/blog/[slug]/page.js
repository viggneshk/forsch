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
  const post = await getPublicContentItem("blog", slug);

  if (!post) {
    return {};
  }

  return buildContentMetadata("blog", post);
}

export async function generateStaticParams() {
  const posts = await getPublicContentCollection("blog");

  return posts.map((item) => ({
    slug: item.slug
  }));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPublicContentItem("blog", slug);

  if (!post) {
    notFound();
  }

  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", url: buildPublicUrl("/") },
      { name: "Blog", url: buildPublicUrl("/blog") },
      { name: post.title, url: buildPublicUrl(`/blog/${post.slug}`) }
    ]),
    buildArticleStructuredData("blog", post),
    buildFaqStructuredData(post.faqs || [])
  ].filter(Boolean);

  return (
    <main className="use-case-page-shell">
      {structuredData.map((item, index) => (
        <script
          key={`blog-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

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
            {post.publishedAt || post.readingTimeMinutes ? (
              <p className="section-tag">
                {[post.publishedAt, post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : ""]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            ) : null}
            {post.heroImage ? (
              <VisualFigure
                image={{
                  src: post.heroImage,
                  alt: post.heroImageAlt,
                  assetExists: post.heroImageExists
                }}
                fallbackTitle={post.heroImageAlt || post.title}
              />
            ) : null}
          </header>
          <DetailSections item={post} />
          {(post.takeaways || []).length > 0 ? (
            <section className="detail-card">
              <p className="section-tag">Key takeaways</p>
              <h2>What to keep in mind</h2>
              <ul className="detail-list">
                {post.takeaways.map((item, index) => (
                  <li key={`${post.slug}-takeaway-${index}`}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {(post.faqs || []).length > 0 ? (
            <section className="detail-card">
              <p className="section-tag">FAQ</p>
              <h2>Questions readers often ask</h2>
              <div className="faq-list">
                {post.faqs.map((faq, index) => (
                  <article key={`${post.slug}-faq-${index}`} className="faq-item">
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
              <h2>{post.cta}</h2>
              <p>
                Use the post as a starting point, then turn it into a workflow plan
                that matches your actual systems and constraints.
              </p>
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
