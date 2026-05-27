import HomePageClient from "./home-page-client";
import { getPublicContentCollection } from "../lib/content-store";

export default async function HomePage() {
  const useCases = await getPublicContentCollection("use-case");
  return <HomePageClient useCases={useCases} />;
}
