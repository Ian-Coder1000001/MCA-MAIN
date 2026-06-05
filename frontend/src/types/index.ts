// ── Shared TypeScript types ────────────────────────────────────────────────
// These mirror the Django serializer output exactly.
// Update here if backend field names change.

export interface HeroContent {
  candidate_name: string;
  tagline: string;
  bio_short: string;
  photo_url: string | null;
  stats: { label: string; value: string }[];
  video_url: string;
  video_title: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  project_count: number;
  order: number;
}

export interface ProjectImage {
  url: string;
  caption: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  year: number;
  cover_image: string | null;
  images: ProjectImage[];
  category: Category;
  is_featured: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;   // backend may also send this as "body"
  body?: string;
  cover_image: string | null;
  published_at: string | null;
  created_at?: string;
  author: string;
}

export interface GalleryItem {
  id: number;
  url: string | null;
  caption: string;
  type: "photo" | "video";
  tag: string;
}

export interface ContactPayload {
  full_name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface AboutContent {
  bio: string;
  vision: string;
  commitment: string;
  photo_url: string | null;
  timeline: { year: string; event: string }[];
  values: { title: string; description: string }[];
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
}
