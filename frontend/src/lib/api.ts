/**
 * API Client — Shilosio MCA Website
 * Single source of truth for all backend communication.
 * Set NEXT_PUBLIC_API_URL in .env.local to point at the Django backend.
 *
 * .env.local:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000
 */

import type {
  HeroContent,
  AboutContent,
  Category,
  Project,
  NewsArticle,
  GalleryItem,
  Testimonial,
  ContactPayload,
  ContactResponse,
} from "@/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

/**
 * Normalise image/video URL fields that the backend returns as ""
 * instead of null when no value is set.
 */
export function imgUrl(value: string | null | undefined): string | null {
  if (!value || value.trim() === "") return null;
  return value;
}

export const api = {
  hero:         ()              => apiFetch<HeroContent>("/api/hero/"),
  about:        ()              => apiFetch<AboutContent>("/api/about/"),
  categories:   ()              => apiFetch<Category[]>("/api/categories/"),
  projects:     (cat?: string)  => apiFetch<Project[]>(`/api/projects/${cat ? `?category=${cat}` : ""}`),
  project:      (slug: string)  => apiFetch<Project>(`/api/projects/${slug}/`),
  news:         (limit?: number)=> apiFetch<NewsArticle[]>(`/api/news/${limit ? `?limit=${limit}` : ""}`),
  newsArticle:  (slug: string)  => apiFetch<NewsArticle>(`/api/news/${slug}/`),
  gallery:      ()              => apiFetch<GalleryItem[]>("/api/gallery/"),
  testimonials: ()              => apiFetch<Testimonial[]>("/api/testimonials/"),
  contact:      (data: ContactPayload) =>
    apiFetch<ContactResponse>("/api/contact/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
