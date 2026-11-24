import { buildPublicUrl } from "../lib/site-config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: buildPublicUrl("/sitemap.xml")
  };
}
