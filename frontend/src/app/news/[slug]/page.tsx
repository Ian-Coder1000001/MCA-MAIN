import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { mockNews } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await api
    .newsArticle(params.slug)
    .catch(() => mockNews.find((a) => a.slug === params.slug) ?? null);

  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await api
    .newsArticle(params.slug)
    .catch(() => mockNews.find((a) => a.slug === params.slug) ?? null);

  if (!article) notFound();

  // Resolve body — backend may send it as "content" or "body"
  const bodyHtml = article.content || article.body || "";

  // Fetch a few more articles for the "related" strip (best effort)
  const allNews = await api.news().catch(() => mockNews);
  const related = allNews.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      {/* ── Article header ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--forest-900) 0%, var(--forest-800) 60%, var(--forest-700) 100%)",
          paddingTop: "3.5rem",
          paddingBottom: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(224,127,58,0.07) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="container-site"
          style={{ position: "relative", zIndex: 1, maxWidth: 820 }}
        >
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{ marginBottom: "1.5rem" }}
          >
            <ol
              style={{
                listStyle: "none",
                padding: 0, margin: 0,
                display: "flex", alignItems: "center", gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <li>
                <Link
                  href="/"
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
                /
              </li>
              <li>
                <Link
                  href="/news"
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  News
                </Link>
              </li>
              <li aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
                /
              </li>
              <li
                aria-current="page"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "200px",
                }}
              >
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                background: "rgba(224,127,58,0.18)",
                border: "1px solid rgba(224,127,58,0.32)",
                color: "var(--clay-300)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              {article.author}
            </span>
            {article.published_at && (
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                {formatDate(article.published_at)}
              </span>
            )}
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#ffffff",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "1.25rem",
            }}
          >
            {article.title}
          </h1>

          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              fontStyle: "italic",
              lineHeight: 1.6,
              maxWidth: 680,
            }}
          >
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* ── Cover image ── */}
      {article.cover_image && (
        <div
          style={{
            width: "100%",
            maxHeight: 480,
            overflow: "hidden",
            background: "var(--stone-900)",
            position: "relative",
            aspectRatio: "16/7",
          }}
        >
          <LazyImage
            src={article.cover_image}
            alt={article.title}
            fill
            objectFit="cover"
            objectPosition="center"
            priority
          />
        </div>
      )}

      {/* ── Article body ── */}
      <article
        aria-label={article.title}
        style={{
          background: "#fff",
          paddingTop: "3.5rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid var(--stone-100)",
        }}
      >
        <div
          className="container-site"
          style={{ maxWidth: 760 }}
        >
          {bodyHtml ? (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--stone-400)",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              Full article body will appear here once added via the admin panel.
            </p>
          )}

          {/* Back link */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--stone-100)" }}>
            <Link
              href="/news"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--forest-600)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M10 7H4M6.5 4L3 7l3.5 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to all news
            </Link>
          </div>
        </div>
      </article>

      {/* ── More articles ── */}
      {related.length > 0 && (
        <section
          aria-labelledby="more-news-heading"
          style={{
            background: "var(--stone-50)",
            paddingTop: "4rem",
            paddingBottom: "4rem",
          }}
        >
          <div className="container-site">
            <div className="divider" aria-hidden="true" />
            <h2
              id="more-news-heading"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "var(--stone-800)",
                fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
                marginBottom: "1.75rem",
              }}
            >
              More from Murhanda Ward
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {related.map((a, i) => {
                const gradients = [
                  "linear-gradient(135deg, var(--forest-700), var(--forest-500))",
                  "linear-gradient(135deg, var(--forest-800), var(--forest-600))",
                  "linear-gradient(135deg, var(--forest-900), var(--forest-700))",
                ];
                return (
                  <Link
                    key={a.id}
                    href={`/news/${a.slug}`}
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
                  >
                    <div
                      style={{
                        height: 160,
                        background: a.cover_image ? "var(--stone-100)" : gradients[i % 3],
                        flexShrink: 0,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {a.cover_image && (
                        <LazyImage
                          src={a.cover_image}
                          alt={a.title}
                          fill
                          objectFit="cover"
                        />
                      )}
                    </div>
                    <div style={{ padding: "1rem 1.25rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      {a.published_at && (
                        <p
                          style={{
                            color: "var(--stone-400)",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.72rem",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {formatDate(a.published_at)}
                        </p>
                      )}
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: "var(--stone-800)",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          lineHeight: 1.35,
                          flex: 1,
                        }}
                      >
                        {a.title}
                      </h3>
                      <p
                        style={{
                          color: "var(--clay-400)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          marginTop: "0.75rem",
                        }}
                      >
                        Read &rarr;
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
