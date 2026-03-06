import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fetch all published events for sitemap
  const events = await db.event.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all categories
  const categories = await db.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...eventUrls,
    ...categoryUrls,
  ];
}
