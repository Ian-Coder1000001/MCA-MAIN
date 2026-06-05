"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { mockProjects, mockCategories } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";
import type { Project, Category } from "@/types";

// Category accent colors — no emojis, clean visual identity
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  health:      { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  education:   { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  transport:   { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  water:       { bg: "#e0f7fa", text: "#00695c", border: "#80deea" },
  agriculture: { bg: "#f1f8e9", text: "#33691e", border: "#aed581" },
  security:    { bg: "#fffde7", text: "#f9a825", border: "#fff176" },
  youth:       { bg: "#fce4ec", text: "#ad1457", border: "#f48fb1" },
  women:       { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
  environment: { bg: "#e8f5e9", text: "#1b5e20", border: "#a5d6a7" },
  bursary:     { bg: "#e8eaf6", text: "#283593", border: "#9fa8da" },
  social:      { bg: "#fbe9e7", text: "#bf360c", border: "#ffab91" },
  trade:       { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  ict:         { bg: "#e1f5fe", text: "#01579b", border: "#81d4fa" },
};

const DEFAULT_COLOR = { bg: "#f5f5f5", text: "#555", border: "#ddd" };

function getCatColors(slug: string) {
  return categoryColors[slug] || DEFAULT_COLOR;
}

/**
 * Safely resolve category slug and name from a project.
 * Handles: full category object, null category, or bare string (legacy mock).
 */
function resolveCat(
  project: Project,
  categories: Category[]
): { slug: string; name: string } {
  const cat = project.category;
  // Full object from backend
  if (cat && typeof cat === "object" && "slug" in cat) {
    return { slug: cat.slug ?? "", name: cat.name ?? "" };
  }
  // Bare slug string (mock data fallback)
  if (typeof cat === "string") {
    const found = categories.find((c) => c.slug === cat);
    return { slug: cat, name: found?.name ?? cat };
  }
  // null / undefined — uncategorised
  return { slug: "", name: "Uncategorised" };
}

function ProjectModal({
  project,
  categories,
  onClose,
}: {
  project: Project;
  categories: Category[];
  onClose: () => void;
}) {
  const { slug: catSlug, name: catName } = resolveCat(project, categories);
  const colors = getCatColors(catSlug);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        background: "rgba(7,31,16,0.75)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "1.25rem",
          overflow: "hidden",
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "fadeUp 0.25s cubic-bezier(.22,1,.36,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover image or colored header */}
        <div
          style={{
            height: 160,
            background: project.cover_image ? "var(--stone-100)" : colors.bg,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {project.cover_image ? (
            <LazyImage
              src={project.cover_image}
              alt={project.title}
              fill
              objectFit="cover"
              priority
            />
          ) : (
            <div
              style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: colors.border,
                  letterSpacing: "-0.02em",
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.3)",
              color: "#fff", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "1.5rem 1.75rem 2rem" }}>
          {/* Category chip */}
          <span
            style={{
              display: "inline-block",
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "0.875rem",
            }}
          >
            {catName}
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "var(--stone-800)",
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: "0.875rem",
              lineHeight: 1.25,
            }}
          >
            {project.title}
          </h2>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--stone-600)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
            }}
          >
            {project.description}
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--stone-400)",
              fontSize: "0.8rem",
              marginTop: "1.25rem",
            }}
          >
            Completed:{" "}
            <strong style={{ color: "var(--stone-600)" }}>{project.year}</strong>
          </p>

          {/* Project images if any */}
          {project.images && project.images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "0.5rem",
                marginTop: "1.25rem",
              }}
            >
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  style={{ borderRadius: "0.5rem", overflow: "hidden", aspectRatio: "1", position: "relative" }}
                >
                  <LazyImage
                    src={img.url}
                    alt={img.caption || `Image ${idx + 1}`}
                    fill
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsContent() {
  const searchParams              = useSearchParams();
  const [active, setActive]       = useState("all");
  const [selected, setSelected]   = useState<Project | null>(null);
  const [projects, setProjects]   = useState<Project[]>(mockProjects);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading]     = useState(false);

  // Load categories once
  useEffect(() => {
    api.categories()
      .then(setCategories)
      .catch(() => setCategories(mockCategories));
  }, []);

  // Load projects when filter changes
  useEffect(() => {
    setLoading(true);
    api
      .projects(active === "all" ? undefined : active)
      .then((data) => { setProjects(data); setLoading(false); })
      .catch(() => {
        setProjects(
          active === "all"
            ? mockProjects
            : mockProjects.filter((p) => p.category.slug === active)
        );
        setLoading(false);
      });
  }, [active]);

  // Sync URL param → filter
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActive(cat);
  }, [searchParams]);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="container-site" style={{ position: "relative", zIndex: 1 }}>
          <div className="divider" style={{ background: "var(--clay-400)" }} aria-hidden="true" />
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#fff",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: "0.4rem",
            }}
          >
            Projects
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Every project delivered for Murhanda Ward residents — filter by sector below
          </p>
        </div>
      </div>

      {/* Filter strip — sticky */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1.5px solid var(--stone-100)",
          position: "sticky",
          top: 64, zIndex: 30,
        }}
      >
        <div
          className="container-site"
          style={{
            overflowX: "auto",
            display: "flex",
            gap: "0.375rem",
            padding: "0.75rem 0",
            scrollbarWidth: "none",
          }}
        >
          <button
            onClick={() => setActive("all")}
            aria-pressed={active === "all"}
            className={`filter-pill ${active === "all" ? "active" : ""}`}
          >
            All{" "}
            <span style={{ opacity: 0.6, fontSize: "0.72rem" }}>{projects.length}</span>
          </button>

          {categories.map((cat) => {
            const on = active === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.slug)}
                aria-pressed={on}
                className={`filter-pill ${on ? "active" : ""}`}
              >
                {cat.name}
                <span style={{ opacity: 0.55, fontSize: "0.72rem", marginLeft: "0.25rem" }}>
                  {cat.project_count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project grid */}
      <div
        className="container-site"
        style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}
      >
        {loading && (
          <p
            style={{
              color: "var(--stone-400)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              marginBottom: "0.5rem",
            }}
          >
            Loading...
          </p>
        )}

        <p
          style={{
            color: "var(--stone-400)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            marginBottom: "1.5rem",
          }}
        >
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
          {active !== "all" && (
            <span>
              {" "}in{" "}
              <strong style={{ color: "var(--stone-600)" }}>
                {categories.find((c) => c.slug === active)?.name}
              </strong>
            </span>
          )}
        </p>

        {projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
              color: "var(--stone-400)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            No projects in this category yet. Check back soon.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.125rem",
            }}
            role="list"
          >
            {projects.map((project) => {
              const { slug: catSlug, name: catName } = resolveCat(project, categories);
              const colors = getCatColors(catSlug);

              return (
                <button
                  key={project.id}
                  role="listitem"
                  onClick={() => setSelected(project)}
                  className="card-lift"
                  aria-label={`View details: ${project.title}`}
                  style={{
                    textAlign: "left",
                    background: "#fff",
                    border: "1.5px solid var(--stone-100)",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    transition: "border-color 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--stone-100)";
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      height: 90,
                      background: project.cover_image ? "var(--stone-100)" : colors.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {project.cover_image ? (
                      <LazyImage
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        objectFit="cover"
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "2rem",
                          fontWeight: 700,
                          color: colors.border,
                          userSelect: "none",
                        }}
                        aria-hidden="true"
                      >
                        {project.title.charAt(0)}
                      </span>
                    )}
                    {/* Year chip */}
                    <span
                      style={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(0,0,0,0.35)",
                        color: "#fff",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "0.375rem",
                      }}
                    >
                      {project.year}
                    </span>
                  </div>

                  <div style={{ padding: "0.875rem 1rem 1rem" }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        color: "var(--stone-800)",
                        fontSize: "0.875rem",
                        lineHeight: 1.35,
                        marginBottom: "0.3rem",
                      }}
                    >
                      {project.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--stone-400)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {catName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ProjectModal
          project={selected}
          categories={categories}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--stone-400)",
          }}
        >
          Loading projects...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
