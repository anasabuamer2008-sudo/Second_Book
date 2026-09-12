import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { sampleBooks } from "@/lib/books";

const langs = ["ar", "he"] as const;
const paths = ["", "/about", "/books", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...langs.flatMap((lang) =>
      paths.map((path) => ({
        url: `${SITE_URL}/${lang}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1 : 0.8,
      }))
    ),
    ...sampleBooks.map((book) => ({
      url: `${SITE_URL}/books/${book.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}