import HomePageClient from "./home-page-client";
import { getContentCollection } from "../lib/content-store";

export default async function HomePage() {
  const useCases = await getContentCollection("use-case");
  return <HomePageClient useCases={useCases} />;
}
