import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://forsch.io"),
  title: {
    default: "Forsch | AI Implementation Partner for Production-Ready Systems",
    template: "%s | Forsch"
  },
  description:
    "Forsch helps startups and growing companies design, build, and ship production-ready AI systems, workflow automation, copilots, and internal tools.",
  keywords: [
    "AI implementation partner",
    "AI consulting",
    "custom AI development",
    "workflow automation",
    "AI systems",
    "AI agency",
    "production AI"
  ],
  applicationName: "Forsch",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Forsch | AI Implementation Partner for Production-Ready Systems",
    description:
      "Design, build, and ship AI systems that work in production, not just demos.",
    url: "https://forsch.io",
    siteName: "Forsch",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Forsch | AI Implementation Partner for Production-Ready Systems",
    description:
      "Forsch builds production-ready AI systems, copilots, workflow automations, and internal tools."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
