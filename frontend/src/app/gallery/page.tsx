"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { mockGallery } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";
import type { GalleryItem } from "@/types";

const ALL_TAG = "all";

// ── Lightbox with swipe support ───────────────────────────────────────────
function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const touchStartX   = useRef<number | null>(null);
  const touchStartY   = useRef<number | null>(null);

  const prev = useCallback(() => setIdx((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", h); };
  }, [onClose, prev, next]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    }
    // Swipe down to close
    if (dy > 80 && Math.abs(dy) > Math.abs(dx)) onClose();
    touchStartX.current = null;
    touchStartY.current = null;
  }

  const current = items[idx];
  if (!current?.url) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Photo viewer"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.95)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Counter */}
      <div style={{
        position: "absolute", top: "1rem", left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.45)",
        fontFamily: "'Inter',sans-serif", fontSize: "0.8rem",
        background: "rgba(0,0,0,0.4)", padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
      }}>
        {idx + 1} / {items.length}
      </div>

      {/* Close */}
      <button
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "absolute", top: "0.875rem", right: "0.875rem",
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 2l12 12M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          aria-label="Previous photo"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          style={{
            position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11 4L6 9l5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          aria-label="Next photo"
          onClick={(e) => { e.stopPropagation(); next(); }}
          style={{
            position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M7 4l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          maxWidth: "92vw", maxHeight: "88dvh",
          padding: "0 3.5rem",
        }}
      >
        <img
          key={current.url}
          src={current.url}
          alt={current.caption || "Gallery photo"}
          loading="eager"
          style={{
            maxWidth: "100%",
            maxHeight: "76dvh",
            objectFit: "contain",
            borderRadius: "0.625rem",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            display: "block",
          }}
        />
        {current.caption && (
          <p style={{
            color: "rgba(255,255,255,0.65)",
            fontFamily: "'Inter',sans-serif",
            fontSize: "clamp(0.82rem,2.5vw,0.9rem)",
            marginTop: "0.875rem",
            textAlign: "center",
            maxWidth: 520, lineHeight: 1.55,
            padding: "0 1rem",
          }}>
            {current.caption}
          </p>
        )}
      </div>

      {/* Dot indicators */}
      {items.length > 1 && items.length <= 12 && (
        <div style={{
          position: "absolute", bottom: "1.25rem",
          display: "flex", gap: "0.375rem",
        }}>
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to photo ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              style={{
                width: i === idx ? 20 : 8, height: 8,
                borderRadius: "9999px",
                background: i === idx ? "#fff" : "rgba(255,255,255,0.3)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", overflow: "hidden", border: "1.5px solid #e4e4e7" }}>
      <div className="skeleton" style={{ aspectRatio: "4/3", width: "100%" }} />
      <div style={{ padding: "1rem 1.125rem 1.125rem" }}>
        <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ height: 13, width: "45%" }} />
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems]           = useState<GalleryItem[]>([]);
  const [activeTag, setActiveTag]   = useState(ALL_TAG);
  const [lightboxIndex, setLbIndex] = useState<number | null>(null);
  const [tags, setTags]             = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.gallery()
      .then((data) => {
        setItems(data);
        setTags(Array.from(new Set(data.map((d) => d.tag).filter(Boolean))));
      })
      .catch(() => {
        setItems(mockGallery);
        setTags(Array.from(new Set(mockGallery.map((d) => d.tag).filter(Boolean))));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered     = activeTag === ALL_TAG ? items : items.filter((i) => i.tag === activeTag);
  const photos       = filtered.filter((i) => i.type === "photo");
  const videos       = filtered.filter((i) => i.type === "video");
  const lightboxItems = photos.filter((i) => !!i.url);

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container-site" style={{ position: "relative", zIndex: 1 }}>
          <div className="divider" aria-hidden="true" />
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            color: "#fff",
            fontSize: "clamp(1.75rem,5vw,3rem)",
            marginBottom: "0.4rem",
          }}>Gallery</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.875rem,2.5vw,1rem)" }}>
            Photos and videos documenting work across Murhanda Ward
          </p>
        </div>
      </div>

      {/* Filter bar */}
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
          <button className={`filter-pill ${activeTag === ALL_TAG ? "active" : ""}`}
            onClick={() => setActiveTag(ALL_TAG)} aria-pressed={activeTag === ALL_TAG}>
            All <span style={{ opacity: 0.6, fontSize: "0.75rem", marginLeft: "0.2rem" }}>{items.length}</span>
          </button>
          {tags.map((tag) => {
            const count = items.filter((i) => i.tag === tag).length;
            const on    = activeTag === tag;
            return (
              <button key={tag} className={`filter-pill ${on ? "active" : ""}`}
                onClick={() => setActiveTag(tag)} aria-pressed={on}
                style={{ textTransform: "capitalize" }}>
                {tag} <span style={{ opacity: 0.55, fontSize: "0.75rem", marginLeft: "0.3rem" }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery body */}
      <section aria-label="Gallery" style={{ background: "#fafafa", paddingTop: "2.5rem", paddingBottom: "5rem", minHeight: "60vh" }}>
        <div className="container-site">

          {loading && (
            <div className="gallery-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "#a1a1aa", fontFamily: "'Inter',sans-serif" }}>
              No items in this category yet.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* Photos */}
              {photos.length > 0 && (
                <div style={{ marginBottom: videos.length > 0 ? "3.5rem" : 0 }}>
                  {videos.length > 0 && (
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#a1a1aa", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                      Photos ({photos.length})
                    </p>
                  )}
                  <div className="gallery-grid" role="list" aria-label="Photo gallery">
                    {photos.map((item, i) => {
                      const lbIdx = lightboxItems.findIndex((x) => x.id === item.id);
                      return (
                        <figure
                          key={item.id}
                          role="listitem"
                          className="gal-figure card-lift"
                          onClick={() => item.url && lbIdx >= 0 && setLbIndex(lbIdx)}
                          style={{
                            margin: 0, borderRadius: "1rem", overflow: "hidden",
                            background: item.url ? "#f4f4f5" : "#eff6ff",
                            border: "1.5px solid #e4e4e7",
                            cursor: item.url ? "zoom-in" : "default",
                          }}
                          aria-label={item.caption || "Gallery photo"}
                        >
                          {/* Image area */}
                          <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                            {item.url ? (
                              <LazyImage
                                src={item.url}
                                alt={item.caption || "Gallery photo"}
                                fill objectFit="cover"
                                priority={i < 3}
                              />
                            ) : (
                              <div style={{
                                position: "absolute", inset: 0,
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: "0.75rem",
                                background: "#eff6ff",
                              }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#93c5fd" strokeWidth="1.5" />
                                  <circle cx="8.5" cy="8.5" r="1.5" fill="#93c5fd" />
                                  <path d="M21 15l-5-5L5 21" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={{ color: "#93c5fd", fontFamily: "'Inter',sans-serif", fontSize: "0.72rem" }}>
                                  Upload via admin
                                </span>
                              </div>
                            )}

                            {/* Tag badge */}
                            {item.tag && (
                              <div style={{
                                position: "absolute", top: "0.625rem", left: "0.625rem",
                                background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.9)",
                                fontFamily: "'Inter',sans-serif", fontSize: "0.65rem", fontWeight: 500,
                                letterSpacing: "0.06em", textTransform: "capitalize",
                                padding: "0.2rem 0.5rem", borderRadius: "0.375rem", zIndex: 2,
                              }} aria-hidden="true">{item.tag}</div>
                            )}

                            {/* Expand icon hint on hover (desktop) */}
                            {item.url && (
                              <div style={{
                                position: "absolute", bottom: "0.625rem", right: "0.625rem",
                                background: "rgba(0,0,0,0.4)", borderRadius: "0.375rem",
                                width: 28, height: 28,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                zIndex: 2, opacity: 0.8,
                              }} aria-hidden="true">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}

                            {/* Caption overlay on hover */}
                            {item.caption && (
                              <figcaption style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
                                color: "#fff", fontFamily: "'Inter',sans-serif",
                                fontSize: "clamp(0.78rem,2vw,0.85rem)", lineHeight: 1.45,
                                padding: "2rem 0.875rem 0.875rem", zIndex: 2,
                              }}>
                                {item.caption}
                              </figcaption>
                            )}
                          </div>

                          {/* Caption always visible below */}
                          {item.caption && (
                            <div style={{ padding: "0.75rem 0.875rem 0.875rem" }}>
                              <p style={{
                                fontFamily: "'Inter',sans-serif",
                                color: "#3f3f46",
                                fontSize: "clamp(0.85rem,2.5vw,0.9rem)",
                                lineHeight: 1.55, fontWeight: 500,
                              }}>
                                {item.caption}
                              </p>
                            </div>
                          )}
                        </figure>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <div>
                  <p style={{ fontFamily: "'Inter',sans-serif", color: "#a1a1aa", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                    Videos ({videos.length})
                  </p>
                  <div className="gallery-grid">
                    {videos.map((item) => (
                      <div key={item.id} style={{
                        borderRadius: "1rem", overflow: "hidden",
                        background: "#18181b", border: "1.5px solid #27272a",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                      }}>
                        <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                          {item.url ? (
                            <video src={item.url} controls preload="metadata" style={{
                              position: "absolute", inset: 0,
                              width: "100%", height: "100%", objectFit: "cover",
                            }}>
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div style={{
                              position: "absolute", inset: 0,
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center", gap: "0.75rem",
                            }}>
                              <div style={{
                                width: 56, height: 56, borderRadius: "50%",
                                background: "rgba(255,255,255,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }} aria-hidden="true">
                                <div style={{ marginLeft: 5, borderLeft: "18px solid rgba(255,255,255,0.3)", borderTop: "10px solid transparent", borderBottom: "10px solid transparent" }} />
                              </div>
                              <p style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter',sans-serif", fontSize: "0.78rem" }}>
                                Add video URL via admin
                              </p>
                            </div>
                          )}
                        </div>
                        {item.caption && (
                          <div style={{ padding: "0.875rem 1rem 1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <p style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.85rem,2.5vw,0.9rem)", lineHeight: 1.55 }}>
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          startIndex={lightboxIndex}
          onClose={() => setLbIndex(null)}
        />
      )}
    </>
  );
}
