import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { mockHero, mockNews, mockTestimonials, mockCategories } from "@/lib/mock";
import { LazyImage } from "@/components/ui/LazyImage";
import { VideoEmbed } from "@/components/ui/VideoEmbed";

export const metadata: Metadata = {
  title: "Elphas Shilosio — MCA Murhanda Ward",
  description:
    "Official campaign site for Elphas Shilosio, MCA candidate for Murhanda Ward. Real projects in health, education, roads, and more.",
};

export default async function HomePage() {
  const [hero, news, testimonials, categories] = await Promise.all([
    api.hero().catch(() => mockHero),
    api.news(3).catch(() => mockNews.slice(0, 3)),
    api.testimonials().catch(() => mockTestimonials),
    api.categories().catch(() => mockCategories),
  ]);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO — white background
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Hero"
        style={{
          background: "#ffffff",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Light blue tint on right side */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, right: 0,
            width: "50%", height: "100%",
            background: "linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)",
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container-site hero-grid"
          style={{
            position: "relative", zIndex: 1,
            paddingTop: "clamp(3rem, 8vh, 5rem)",
            paddingBottom: "clamp(3rem, 8vh, 5rem)",
            minHeight: "clamp(460px, 75vh, 700px)",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Text content */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#1d4ed8",
                fontSize: "0.7rem",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "0.35rem 0.9rem", borderRadius: "9999px",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }}
                aria-hidden="true"
              />
              MCA Candidate · Murhanda Ward
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#0f172a",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              {hero.candidate_name.split(" ")[0]}
              <br />
              <span style={{ color: "#1d4ed8" }}>
                {hero.candidate_name.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#1d4ed8",
                fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                fontStyle: "italic",
                marginBottom: "1rem",
                lineHeight: 1.4,
              }}
            >
              {hero.tagline}
            </p>

            {/* FIX: was rgba(255,255,255,0.65) — invisible on white */}
            <p
              style={{
                color: "#52525b",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.75,
                marginBottom: "2.25rem",
                maxWidth: "480px",
              }}
            >
              {hero.bio_short}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link
                href="/projects"
                style={{
                  background: "#1d4ed8",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  padding: "0.85rem 2rem",
                  borderRadius: "0.6rem",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.3)",
                  display: "inline-block",
                }}
              >
                View our projects
              </Link>
              <Link
                href="/about"
                style={{
                  border: "1.5px solid #e4e4e7",
                  color: "#27272a",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  padding: "0.85rem 2rem",
                  borderRadius: "0.6rem",
                  textDecoration: "none",
                  display: "inline-block",
                  background: "#fff",
                }}
              >
                About Elphas
              </Link>
            </div>
          </div>

          {/* Candidate photo */}
          <div
            className="animate-fade-up animate-delay-2 hero-photo-wrap"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ position: "relative" }}>
              {hero.photo_url ? (
                <img
                  src={hero.photo_url}
                  alt={`${hero.candidate_name} — MCA Candidate, Murhanda Ward`}
                  loading="eager"
                  style={{
                    width: "clamp(240px, 32vw, 380px)",
                    height: "clamp(240px, 32vw, 380px)",
                    objectFit: "cover",
                    objectPosition: "center top",
                    borderRadius: "50%",
                    border: "4px solid #1d4ed8",
                    boxShadow: "0 8px 48px rgba(29,78,216,0.2), 0 2px 8px rgba(0,0,0,0.08)",
                    display: "block",
                    background: "#eff6ff",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "clamp(240px, 32vw, 380px)",
                    height: "clamp(240px, 32vw, 380px)",
                    borderRadius: "50%",
                    border: "4px solid #bfdbfe",
                    background: "#eff6ff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                  }}
                  aria-label="Upload candidate photo via admin panel"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" stroke="#93c5fd" strokeWidth="1.5" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {/* FIX: was rgba(255,255,255,0.2) — invisible on white */}
                  <span style={{ color: "#93c5fd", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", textAlign: "center", lineHeight: 1.5, padding: "0 1rem" }}>
                    Upload photo via<br />admin panel
                  </span>
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: "0.5rem",
                  right: "-0.5rem",
                  background: "#1d4ed8",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "9999px",
                  boxShadow: "0 4px 16px rgba(29,78,216,0.4)",
                  whiteSpace: "nowrap",
                }}
                aria-hidden="true"
              >
                Murhanda Ward
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar — completely outside the hero section so the
          diagonal blue background cannot overlap it */}
      <div
        role="region"
        aria-label="Key statistics"
        style={{
          borderTop: "1px solid #e4e4e7",
          borderBottom: "1px solid #e4e4e7",
          background: "#f8faff",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="container-site stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {hero.stats.map((s, i) => {
            const total = hero.stats.length;
            const cols = 2;
            const lastRowStart = total % cols === 0
              ? total - cols
              : total - (total % cols);
            return (
              <div
                key={i}
                style={{
                  padding: "1.25rem 1rem",
                  textAlign: "center",
                  borderRight: i % cols === 0 ? "1px solid #e4e4e7" : "none",
                  borderBottom: i < lastRowStart ? "1px solid #e4e4e7" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#0f172a",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                  }}
                >
                  {s.value}
                </p>
                <p style={{ color: "#71717a", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          VIDEO SECTION — dark background, light text (correct)
      ══════════════════════════════════════════════════════════ */}
      <section aria-label="Campaign video" style={{ background: "#0c0c0c" }}>
        <div className="container-site" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
          <div
            className="video-layout"
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", alignItems: "center" }}
          >
            {/* Video embed */}
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",
                borderRadius: "1rem",
                overflow: "hidden",
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              }}
            >
              {hero.video_url ? (
                <VideoEmbed url={hero.video_url} title={hero.video_title} />
              ) : (
                <div
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 72, height: 72, borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 0 0 12px rgba(255,255,255,0.1)",
                    }}
                    aria-hidden="true"
                  >
                    <div style={{ marginLeft: 6, borderLeft: "22px solid #0c0c0c", borderTop: "13px solid transparent", borderBottom: "13px solid transparent" }} />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
                    Video will appear once URL is set via admin panel
                  </p>
                </div>
              )}
            </div>

            {/* Video info — white text on dark bg, correct */}
            <div style={{ paddingLeft: "0.5rem" }}>
              <p style={{ color: "#93c5fd", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Featured campaign video
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#ffffff",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 600, lineHeight: 1.25, marginBottom: "0.75rem",
                }}
              >
                {hero.video_title}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", lineHeight: 1.7 }}>
                See the real impact of Elphas Shilosio&apos;s work across Murhanda Ward — from groundbreaking to ribbon-cutting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROJECT CATEGORIES — white bg, dark text (correct)
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="projects-heading"
        style={{ background: "#ffffff", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="container-site">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <div className="divider" aria-hidden="true" />
              <h2
                id="projects-heading"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#18181b", marginBottom: "0.4rem" }}
              >
                Projects by sector
              </h2>
              <p style={{ color: "#71717a", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                Real work delivered across every corner of Murhanda Ward
              </p>
            </div>
            <Link href="/projects" style={{ color: "#1d4ed8", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem", whiteSpace: "nowrap" }}>
              All projects &rarr;
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.875rem" }} role="list" aria-label="Project sectors">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/projects?category=${cat.slug}`}
                role="listitem"
                className="card-lift cat-card"
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "1rem 1.1rem",
                  borderRadius: "0.875rem",
                  border: "1.5px solid #e4e4e7",
                  background: "#ffffff",
                  textDecoration: "none",
                  transition: "border-color 0.18s",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 36, height: 36, borderRadius: "0.5rem",
                    background: "#eff6ff", border: "1px solid #dbeafe",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700, color: "#1d4ed8", fontSize: "0.95rem",
                  }}
                >
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: "#18181b", fontSize: "0.85rem", lineHeight: 1.3 }}>
                    {cat.name}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: "#71717a", fontSize: "0.75rem", marginTop: "0.15rem" }}>
                    {cat.project_count} project{cat.project_count !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LATEST NEWS — light bg, dark text (correct)
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="news-heading"
        style={{ background: "#fafafa", paddingTop: "5rem", paddingBottom: "5rem", borderTop: "1px solid #e4e4e7" }}
      >
        <div className="container-site">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <div className="divider" aria-hidden="true" />
              <h2 id="news-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#18181b", marginBottom: "0.4rem" }}>
                Latest news
              </h2>
              <p style={{ color: "#71717a", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                Updates from Murhanda Ward — published regularly
              </p>
            </div>
            <Link href="/news" style={{ color: "#1d4ed8", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", whiteSpace: "nowrap" }}>
              All articles &rarr;
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {news.map((article, i) => {
              const gradients = [
                "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
                "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              ];
              return (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="card-lift"
                  style={{ background: "#fff", borderRadius: "1rem", overflow: "hidden", border: "1.5px solid #e4e4e7", textDecoration: "none", display: "flex", flexDirection: "column" }}
                  aria-label={`Read article: ${article.title}`}
                >
                  <div style={{ height: 200, background: article.cover_image ? "#f4f4f5" : gradients[i % 3], flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    {article.cover_image ? (
                      <LazyImage src={article.cover_image} alt={article.title} fill objectFit="cover" priority={i === 0} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>Photo from admin panel</span>
                      </div>
                    )}
                    {article.published_at && (
                      <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.85)", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", padding: "0.25rem 0.6rem", borderRadius: "0.375rem", zIndex: 3 }}>
                        {new Date(article.published_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.25rem 1.4rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.35, marginBottom: "0.65rem" }}>
                      {article.title}
                    </h3>
                    <p style={{ color: "#71717a", fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.65, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {article.excerpt}
                    </p>
                    <p style={{ color: "#1d4ed8", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.8rem", marginTop: "1rem" }}>
                      Read article &rarr;
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS — dark bg, white text (correct)
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="testimonials-heading"
        style={{ background: "#0f172a", paddingTop: "5rem", paddingBottom: "5rem", position: "relative", overflow: "hidden" }}
      >
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 10% 50%, rgba(37,99,235,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="container-site" style={{ position: "relative", zIndex: 1 }}>
          <div className="divider" style={{ background: "#2563eb" }} aria-hidden="true" />
          <h2 id="testimonials-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "2.5rem" }}>
            What residents say
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {testimonials.map((t) => (
              <blockquote key={t.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "4px solid #2563eb", borderRadius: "0.875rem", padding: "1.5rem", margin: 0 }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "rgba(255,255,255,0.85)", fontSize: "1rem", fontStyle: "italic", lineHeight: 1.7, marginBottom: "1rem" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <cite style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", fontStyle: "normal", display: "block" }}>
                  &mdash; {t.author},{" "}
                  <span style={{ color: "rgba(255,255,255,0.28)" }}>{t.location}</span>
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA BAND — white bg, dark text (correct)
      ══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Call to action"
        style={{ background: "#f8faff", paddingTop: "5rem", paddingBottom: "5rem", borderTop: "1px solid #e4e4e7" }}
      >
        <div className="container-site" style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="divider" style={{ margin: "0 auto 1rem" }} aria-hidden="true" />
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0f172a", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>
            Have a concern or idea for Murhanda Ward?
          </h2>
          <p style={{ color: "#52525b", fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Every message is read by the team. Reach out — your voice shapes the ward&apos;s future.
          </p>
          <Link
            href="/contact"
            style={{ display: "inline-block", background: "#1d4ed8", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.95rem", padding: "0.9rem 2.5rem", borderRadius: "0.65rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
