import type { Metadata } from "next";
import { api } from "@/lib/api";
import { mockNews } from "@/lib/mock";
import { NewsCard } from "@/components/ui/NewsCard";

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest news and updates from Murhanda Ward — published regularly by the Elphas Shilosio campaign team.",
};

export default async function NewsPage() {
  const articles = await api.news().catch(() => mockNews);
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? "";

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
          }}>
            News &amp; Updates
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Inter',sans-serif",
            fontSize: "clamp(0.875rem,2.5vw,1rem)",
          }}>
            Stay informed on what&apos;s happening across Murhanda Ward
          </p>
        </div>
      </div>

      {/* Articles */}
      <section
        aria-label="News articles"
        style={{ background: "#fafafa", paddingTop: "3.5rem", paddingBottom: "5rem" }}
      >
        <div className="container-site">
          {articles.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "5rem 0",
              color: "#a1a1aa", fontFamily: "'Inter',sans-serif",
            }}>
              No articles published yet. Check back soon.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.75rem",
            }}>
              {articles.map((article, i) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={i}
                  siteUrl={siteUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
