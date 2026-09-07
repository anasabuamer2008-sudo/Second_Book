import type { MetadataRoute } from "next";

const baseUrl = "https://second-book.example.com";
const langs = ["ar", "he"] as const;
const paths = ["", "/about", "/books", "/cart", "/checkout", "/orders", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return langs.flatMap((lang) =>
    paths.map((path) => ({
      url: `${baseUrl}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }))
  );
}