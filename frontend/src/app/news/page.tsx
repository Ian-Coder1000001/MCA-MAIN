import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { mockNews } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest news and updates from Murhanda Ward — published regularly by the Elphas Shilosio campaign team.",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CARD_GRADIENTS = [
  "linear-gradient(135deg, var(--forest-700), var(--forest-500))",
  "linear-gradient(135deg, var(--forest-800), var(--forest-600))",
  "linear-gradient(135deg, var(--forest-900), var(--forest-700))",
  "linear-gradient(135deg, var(--forest-600), var(--forest-400))",
];

export default async function NewsPage() {
  const articles = await api.news().catch(() => mockNews);

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
            News &amp; Updates
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Stay informed on what&apos;s happening across Murhanda Ward
          </p>
        </div>
      </div>

      {/* ── Articles grid ── */}
      <section
        aria-label="News articles"
        style={{
          background: "var(--stone-50)",
          paddingTop: "3.5rem",
          paddingBottom: "5rem",
        }}
      >
        <div className="container-site">
          {articles.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--stone-400)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              No articles published yet. Check back soon.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {articles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="card-lift"
                  style={{
                    background: "#fff",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: "1.5px solid var(--stone-100)",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  aria-label={`Read: ${article.title}`}
                >
                  {/* ── Cover image with LazyImage ── */}
                  <div
                    style={{
                      height: 220,
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                      background: article.cover_image
                        ? "var(--stone-100)"
                        : CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                    }}
                  >
                    {article.cover_image ? (
                      <LazyImage
                        src={article.cover_image}
                        alt={article.title}
                        fill
                        objectFit="cover"
                        /* First card loads eagerly — above the fold on most screens */
                        priority={i === 0}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(255,255,255,0.15)",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Photo from admin panel
                        </span>
                      </div>
                    )}

                    {/* Author chip */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        background: "rgba(0,0,0,0.42)",
                        color: "rgba(255,255,255,0.85)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "0.375rem",
                        zIndex: 3,
                      }}
                    >
                      {article.author}
                    </div>

                    {/* Date chip */}
                    {article.published_at && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0.75rem",
                          left: "0.75rem",
                          background: "rgba(0,0,0,0.45)",
                          color: "rgba(255,255,255,0.85)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.7rem",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "0.375rem",
                          zIndex: 3,
                        }}
                      >
                        {formatDate(article.published_at)}
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div
                    style={{
                      padding: "1.25rem 1.4rem 1.5rem",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "var(--stone-800)",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        lineHeight: 1.35,
                        marginBottom: "0.65rem",
                      }}
                    >
                      {article.title}
                    </h2>
                    <p
                      style={{
                        color: "var(--stone-500)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.65,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.excerpt}
                    </p>
                    <p
                      style={{
                        color: "var(--clay-400)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      Read article
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
