import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAdminAction } from "../actions";
import { isAdminAuthenticated, isAdminConfigured } from "../../../lib/admin-auth";

export const metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLoginPage({ searchParams }) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const configured = isAdminConfigured();
  const error = searchParams?.error;

  return (
    <main className="use-case-page-shell">
      <div className="container use-case-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Admin login</span>
        </nav>

        <section className="use-case-hero">
          <p className="section-tag">Admin login</p>
          <h1>Sign in to manage use cases, blog posts, and articles.</h1>
          <p className="use-case-hero-copy">
            The admin portal is protected with a server-side session. Use your admin credentials to continue.
          </p>
        </section>

        <section className="admin-login-shell">
          {!configured ? (
            <div className="admin-alert-card">
              <h2>Admin credentials are not configured yet.</h2>
              <p>Set these environment variables before using the CMS:</p>
              <code>ADMIN_USERNAME</code>
              <code>ADMIN_PASSWORD</code>
              <code>ADMIN_SESSION_SECRET</code>
            </div>
          ) : (
            <form action={loginAdminAction} className="admin-form-card admin-login-card">
              <div className="admin-form-grid">
                <label>
                  <span>Username</span>
                  <input name="username" autoComplete="username" required />
                </label>
                <label>
                  <span>Password</span>
                  <input name="password" type="password" autoComplete="current-password" required />
                </label>
              </div>

              {error === "invalid" ? (
                <p className="admin-error-text">The username or password is incorrect.</p>
              ) : null}

              <div className="admin-form-actions">
                <button type="submit" className="button button-primary">Sign in</button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
