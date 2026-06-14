"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { mockProjects, mockCategories } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";
import { ShareButton } from "@/components/ui/ShareButton";
import type { Project, Category } from "@/types";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  health:      { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  education:   { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  transport:   { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
  water:       { bg: "#cffafe", text: "#0e7490", border: "#67e8f9" },
  agriculture: { bg: "#dbeafe", text: "#1e3a5f", border: "#93c5fd" },
  security:    { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
  youth:       { bg: "#fce7f3", text: "#9d174d", border: "#f9a8d4" },
  women:       { bg: "#f3e8ff", text: "#6b21a8", border: "#d8b4fe" },
  environment: { bg: "#dbeafe", text: "#0f172a", border: "#93c5fd" },
  bursary:     { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
  social:      { bg: "#fff1f2", text: "#9f1239", border: "#fda4af" },
  trade:       { bg: "#fff7ed", text: "#9a3412", border: "#fdba74" },
  ict:         { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
};
const DEFAULT_COLOR = { bg: "#f4f4f5", text: "#52525b", border: "#d4d4d8" };
function getCatColors(s: string) { return categoryColors[s] || DEFAULT_COLOR; }

function resolveCat(p: Project, cats: Category[]) {
  const c = p.category;
  if (c && typeof c === "object" && "slug" in c) return { slug: c.slug ?? "", name: c.name ?? "" };
  if (typeof c === "string") { const f = cats.find((x) => x.slug === c); return { slug: c, name: f?.name ?? c }; }
  return { slug: "", name: "Uncategorised" };
}

function ProjectModal({ project, categories, onClose }: { project: Project; categories: Category[]; onClose: () => void }) {
  const { slug: catSlug, name: catName } = resolveCat(project, categories);
  const colors = getCatColors(catSlug);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll, handle Escape
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", h); };
  }, [onClose]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={project.title}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        // On desktop centre it; on mobile slide up from bottom
        padding: 0,
      }}
    >
      <div
        ref={scrollRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          // Mobile: full width, slides up from bottom, max 95vh
          // Desktop: centred card, max 680px wide, max 90vh
          width: "100%",
          maxWidth: 680,
          maxHeight: "95dvh",
          overflowY: "auto",
          overscrollBehavior: "contain",
          borderRadius: "1.25rem 1.25rem 0 0",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.25)",
          animation: "slideUp 0.28s cubic-bezier(.22,1,.36,1)",
          // On larger screens, round all corners and add margin
          marginBottom: 0,
        }}
        // Give desktop styling via inline override at ≥640px handled by CSS below
        className="project-modal-inner"
      >
        {/* Drag handle (mobile visual cue) */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 9999, background: "#e4e4e7" }} aria-hidden="true" />
        </div>

        {/* Cover image */}
        <div style={{
          // Responsive height: shorter on phones, taller on tablets+
          height: "clamp(200px, 40vw, 320px)",
          position: "relative", overflow: "hidden",
          background: colors.bg,
          margin: "0.75rem 1rem 0",
          borderRadius: "0.875rem",
        }}>
          {project.cover_image ? (
            <LazyImage src={project.cover_image} alt={project.title} fill objectFit="cover" priority />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 700, color: colors.border }} aria-hidden="true">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          {/* Close button — always visible */}
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", color: "#fff",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              // Minimum 44px touch target via padding trick
              padding: 0, minWidth: 44, minHeight: 44,
              margin: "-4px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          {/* Category badge */}
          <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem" }}>
            <span style={{
              background: colors.bg, color: colors.text,
              border: `1px solid ${colors.border}`,
              fontFamily: "'Inter',sans-serif", fontWeight: 600,
              fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "0.25rem 0.75rem", borderRadius: "9999px",
            }}>
              {catName}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "clamp(1rem,4vw,1.75rem) clamp(1rem,4vw,2rem) 2rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.875rem" }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              color: "#18181b",
              fontSize: "clamp(1.25rem,4vw,1.6rem)",
              fontWeight: 700, lineHeight: 1.2, flex: 1,
            }}>
              {project.title}
            </h2>
            <span style={{
              background: "#f4f4f5", color: "#52525b",
              fontFamily: "'Inter',sans-serif",
              fontSize: "0.82rem", fontWeight: 600,
              padding: "0.3rem 0.75rem", borderRadius: "0.5rem",
              flexShrink: 0, whiteSpace: "nowrap",
            }}>
              {project.year}
            </span>
          </div>

          <p style={{
            fontFamily: "'Inter',sans-serif",
            color: "#52525b",
            fontSize: "clamp(0.925rem,2.5vw,1rem)",
            lineHeight: 1.75,
          }}>
            {project.description}
          </p>

          {/* Additional images — tap any to see full screen in lightbox handled by parent */}
          {project.images && project.images.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "0.625rem",
              marginTop: "1.25rem",
            }}>
              {project.images.map((img, idx) => (
                <div key={idx} style={{ borderRadius: "0.625rem", overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
                  <LazyImage src={img.url} alt={img.caption || `Image ${idx + 1}`} fill objectFit="cover" />
                </div>
              ))}
            </div>
          )}

          {/* Share */}
          <div style={{
            marginTop: "1.5rem", paddingTop: "1.25rem",
            borderTop: "1px solid #f4f4f5",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
          }}>
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#a1a1aa", fontSize: "0.82rem" }}>
              Share this project
            </p>
            <ShareButton title={project.title} description={project.description} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", overflow: "hidden", border: "1.5px solid #e4e4e7" }}>
      <div className="skeleton" style={{ height: "clamp(180px,30vw,240px)", width: "100%" }} />
      <div style={{ padding: "1.25rem" }}>
        <div className="skeleton" style={{ height: 20, width: "75%", marginBottom: "0.75rem" }} />
        <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ height: 14, width: "85%" }} />
      </div>
    </div>
  );
}

function ProjectsContent() {
  const searchParams                = useSearchParams();
  const [active, setActive]         = useState("all");
  const [selected, setSelected]     = useState<Project | null>(null);
  const [projects, setProjects]     = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories(mockCategories));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.projects(active === "all" ? undefined : active)
      .then((d) => { setProjects(d); setLoading(false); })
      .catch(() => {
        setProjects(active === "all" ? mockProjects : mockProjects.filter((p) => p.category?.slug === active));
        setLoading(false);
      });
  }, [active]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActive(cat);
  }, [searchParams]);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="page-header">
        <div className="container-site" style={{ position: "relative", zIndex: 1 }}>
          <div className="divider" aria-hidden="true" />
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            color: "#fff",
            fontSize: "clamp(1.75rem,5vw,3rem)",
            marginBottom: "0.4rem",
          }}>Projects</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.875rem,2.5vw,1rem)" }}>
            Every project delivered for Murhanda Ward residents
          </p>
        </div>
      </div>

      {/* Filter strip — horizontally scrollable, no scrollbar visible */}
      <div style={{
        background: "#fff", borderBottom: "1.5px solid #e4e4e7",
        position: "sticky", top: 64, zIndex: 30,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div className="container-site" style={{
          overflowX: "auto", display: "flex",
          gap: "0.5rem", padding: "0.75rem 0",
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}>
          <button onClick={() => setActive("all")} aria-pressed={active === "all"}
            className={`filter-pill ${active === "all" ? "active" : ""}`}>
            All <span style={{ opacity: 0.6, fontSize: "0.75rem", marginLeft: "0.2rem" }}>{projects.length}</span>
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActive(cat.slug)} aria-pressed={active === cat.slug}
              className={`filter-pill ${active === cat.slug ? "active" : ""}`}>
              {cat.name}
              <span style={{ opacity: 0.55, fontSize: "0.75rem", marginLeft: "0.3rem" }}>{cat.project_count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container-site" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
        {!loading && projects.length > 0 && (
          <p style={{ color: "#71717a", fontFamily: "'Inter',sans-serif", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
            {active !== "all" && <span> in <strong style={{ color: "#27272a" }}>{categories.find((c) => c.slug === active)?.name}</strong></span>}
          </p>
        )}

        {loading ? (
          <div className="project-grid">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "#a1a1aa", fontFamily: "'Inter',sans-serif" }}>
            No projects in this category yet. Check back soon.
          </div>
        ) : (
          <div className="project-grid" role="list">
            {projects.map((project) => {
              const { slug: catSlug, name: catName } = resolveCat(project, categories);
              const colors = getCatColors(catSlug);
              return (
                <button
                  key={project.id} role="listitem"
                  onClick={() => setSelected(project)}
                  className="card-lift"
                  aria-label={`View: ${project.title}`}
                  style={{
                    textAlign: "left", background: "#fff",
                    border: "1.5px solid #e4e4e7", borderRadius: "1rem",
                    overflow: "hidden", cursor: "pointer", padding: 0,
                    transition: "border-color 0.18s, transform 0.22s, box-shadow 0.22s",
                    // Minimum touch target height naturally met by card content
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = colors.border; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e4e4e7"; }}
                >
                  {/* Image */}
                  <div style={{
                    height: "clamp(180px,30vw,240px)",
                    background: project.cover_image ? "#f4f4f5" : colors.bg,
                    position: "relative", overflow: "hidden",
                  }}>
                    {project.cover_image ? (
                      <LazyImage src={project.cover_image} alt={project.title} fill objectFit="cover" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 700, color: colors.border }} aria-hidden="true">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                      padding: "1.5rem 1rem 0.875rem",
                      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                    }}>
                      <span style={{
                        background: colors.bg, color: colors.text,
                        fontFamily: "'Inter',sans-serif", fontWeight: 600,
                        fontSize: "0.68rem", letterSpacing: "0.07em", textTransform: "uppercase",
                        padding: "0.2rem 0.6rem", borderRadius: "9999px",
                      }}>{catName}</span>
                      <span style={{
                        background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.9)",
                        fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", fontWeight: 600,
                        padding: "0.2rem 0.55rem", borderRadius: "0.375rem",
                      }}>{project.year}</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "1.125rem 1.25rem 1.375rem" }}>
                    <h3 style={{
                      fontFamily: "'Playfair Display',serif", color: "#18181b",
                      fontSize: "clamp(1rem,3vw,1.15rem)", fontWeight: 600,
                      lineHeight: 1.3, marginBottom: "0.5rem",
                    }}>{project.title}</h3>
                    <p style={{
                      fontFamily: "'Inter',sans-serif", color: "#71717a",
                      fontSize: "clamp(0.85rem,2.5vw,0.9rem)",
                      lineHeight: 1.65,
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                      marginBottom: "0.875rem",
                    }}>{project.description}</p>
                    <p style={{
                      fontFamily: "'Inter',sans-serif", color: "#1d4ed8",
                      fontSize: "0.82rem", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}>
                      View details
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} categories={categories} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="container-site" style={{ paddingTop: "3rem" }}>
        <div className="project-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "1rem", overflow: "hidden", border: "1.5px solid #e4e4e7" }}>
              <div className="skeleton" style={{ height: "clamp(180px,30vw,240px)" }} />
              <div style={{ padding: "1.25rem" }}>
                <div className="skeleton" style={{ height: 20, width: "70%", marginBottom: "0.75rem" }} />
                <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: "0.5rem" }} />
                <div className="skeleton" style={{ height: 14, width: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
