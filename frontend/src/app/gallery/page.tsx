"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { mockGallery } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";
import type { GalleryItem } from "@/types";

const ALL_TAG = "all";

export default function GalleryPage() {
  const [items, setItems]         = useState<GalleryItem[]>(mockGallery);
  const [activeTag, setActiveTag] = useState(ALL_TAG);
  const [lightbox, setLightbox]   = useState<GalleryItem | null>(null);
  const [tags, setTags]           = useState<string[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api
      .gallery()
      .then((data) => {
        setItems(data);
        const unique = Array.from(new Set(data.map((d) => d.tag).filter(Boolean)));
        setTags(unique);
      })
      .catch(() => {
        setItems(mockGallery);
        const unique = Array.from(new Set(mockGallery.map((d) => d.tag).filter(Boolean)));
        setTags(unique);
      })
      .finally(() => setLoading(false));
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const filtered =
    activeTag === ALL_TAG ? items : items.filter((item) => item.tag === activeTag);

  const photos = filtered.filter((i) => i.type === "photo");
  const videos = filtered.filter((i) => i.type === "video");

  return (
    <>
      {/* ── Page header ── */}
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
            Gallery
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Photos and videos documenting work across Murhanda Ward
          </p>
        </div>
      </div>

      {/* ── Filter bar — sticky below navbar ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1.5px solid var(--stone-100)",
          position: "sticky",
          top: 64,
          zIndex: 30,
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
            className={`filter-pill ${activeTag === ALL_TAG ? "active" : ""}`}
            onClick={() => setActiveTag(ALL_TAG)}
            aria-pressed={activeTag === ALL_TAG}
          >
            All{" "}
            <span style={{ opacity: 0.6, fontSize: "0.72rem" }}>{items.length}</span>
          </button>

          {tags.map((tag) => {
            const count = items.filter((i) => i.tag === tag).length;
            const on    = activeTag === tag;
            return (
              <button
                key={tag}
                className={`filter-pill ${on ? "active" : ""}`}
                onClick={() => setActiveTag(tag)}
                aria-pressed={on}
                style={{ textTransform: "capitalize" }}
              >
                {tag}
                <span
                  style={{ opacity: 0.55, fontSize: "0.72rem", marginLeft: "0.25rem" }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Gallery body ── */}
      <section
        aria-label="Gallery items"
        style={{
          background: "var(--stone-50)",
          paddingTop: "3rem",
          paddingBottom: "5rem",
          minHeight: "50vh",
        }}
      >
        <div className="container-site">
          {/* Loading skeletons */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "0.875rem",
              }}
              aria-busy="true"
              aria-label="Loading gallery"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{
                    borderRadius: "0.75rem",
                    aspectRatio: "4/3",
                    width: "100%",
                  }}
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--stone-400)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              No items in this category yet.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* ── Photos ── */}
              {photos.length > 0 && (
                <div style={{ marginBottom: videos.length > 0 ? "3.5rem" : 0 }}>
                  {videos.length > 0 && (
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--stone-400)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Photos ({photos.length})
                    </p>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: "0.875rem",
                    }}
                    role="list"
                    aria-label="Photo gallery"
                  >
                    {photos.map((item) => (
                      <figure
                        key={item.id}
                        role="listitem"
                        className="gal-figure card-lift"
                        onClick={() => item.url && setLightbox(item)}
                        style={{
                          margin: 0,
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          border: "1.5px solid var(--stone-200)",
                          cursor: item.url ? "zoom-in" : "default",
                          position: "relative",
                          aspectRatio: "4/3",
                          background: "var(--stone-100)",
                        }}
                        aria-label={item.caption || "Gallery photo"}
                      >
                        {item.url ? (
                          /* ── Lazy-loaded image ── */
                          <LazyImage
                            src={item.url}
                            alt={item.caption || "Gallery photo"}
                            fill
                            objectFit="cover"
                            wrapperStyle={{ borderRadius: "inherit" }}
                          />
                        ) : (
                          /* No URL yet — admin placeholder */
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                              background: "var(--forest-50)",
                            }}
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <rect
                                x="3" y="3" width="18" height="18"
                                rx="2"
                                stroke="var(--forest-200)"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx="8.5" cy="8.5" r="1.5"
                                fill="var(--forest-200)"
                              />
                              <path
                                d="M21 15l-5-5L5 21"
                                stroke="var(--forest-200)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span
                              style={{
                                color: "var(--forest-300)",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.68rem",
                                textAlign: "center",
                                padding: "0 0.5rem",
                              }}
                            >
                              Upload via admin
                            </span>
                          </div>
                        )}

                        {/* Caption overlay — visible on hover via CSS */}
                        {item.caption && (
                          <figcaption
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background:
                                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
                              color: "#fff",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.78rem",
                              lineHeight: 1.4,
                              padding: "1.5rem 0.875rem 0.875rem",
                              zIndex: 3,
                            }}
                          >
                            {item.caption}
                          </figcaption>
                        )}

                        {/* Tag badge */}
                        {item.tag && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0.6rem",
                              left: "0.6rem",
                              background: "rgba(0,0,0,0.4)",
                              color: "rgba(255,255,255,0.8)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.65rem",
                              fontWeight: 500,
                              letterSpacing: "0.06em",
                              textTransform: "capitalize",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.3rem",
                              zIndex: 3,
                            }}
                            aria-hidden="true"
                          >
                            {item.tag}
                          </div>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Videos ── */}
              {videos.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "var(--stone-400)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Videos ({videos.length})
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "1.25rem",
                    }}
                  >
                    {videos.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          borderRadius: "0.875rem",
                          overflow: "hidden",
                          background: "#1a1a1a",
                          border: "1.5px solid rgba(255,255,255,0.06)",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                        }}
                      >
                        {/* Responsive 16:9 wrapper */}
                        <div
                          style={{
                            position: "relative",
                            paddingBottom: "56.25%",
                            background: "#0c0c0c",
                          }}
                        >
                          {item.url ? (
                            <video
                              src={item.url}
                              controls
                              preload="metadata"   // load only metadata (poster frame), not full video
                              loading="lazy"       // defer until near viewport (Chrome 76+)
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 56, height: 56,
                                  borderRadius: "50%",
                                  background: "rgba(255,255,255,0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                aria-hidden="true"
                              >
                                <div
                                  style={{
                                    marginLeft: 5,
                                    borderLeft: "18px solid rgba(255,255,255,0.3)",
                                    borderTop: "10px solid transparent",
                                    borderBottom: "10px solid transparent",
                                  }}
                                />
                              </div>
                              <p
                                style={{
                                  color: "rgba(255,255,255,0.25)",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: "0.75rem",
                                }}
                              >
                                Add video URL via admin
                              </p>
                            </div>
                          )}
                        </div>

                        {item.caption && (
                          <div
                            style={{
                              padding: "0.875rem 1rem",
                              borderTop: "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <p
                              style={{
                                color: "rgba(255,255,255,0.7)",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.82rem",
                                lineHeight: 1.45,
                              }}
                            >
                              {item.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && lightbox.url && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption || "Photo lightbox"}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.93)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full-size image — priority since user explicitly opened it */}
            <img
              src={lightbox.url}
              alt={lightbox.caption || "Gallery photo"}
              loading="eager"
              decoding="async"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "0.75rem",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
                display: "block",
              }}
            />
            {lightbox.caption && (
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  marginTop: "1rem",
                  textAlign: "center",
                  maxWidth: 480,
                  lineHeight: 1.5,
                }}
              >
                {lightbox.caption}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            aria-label="Close photo"
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              top: "1.25rem",
              right: "1.25rem",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
