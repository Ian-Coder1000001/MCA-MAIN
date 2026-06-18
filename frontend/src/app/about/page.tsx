import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { mockAbout } from "@/lib/mock";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Elphas Shilosio — his background, vision for Murhanda Ward, values, and timeline of service.",
};

export default async function AboutPage() {
  const about = await api.about().catch(() => mockAbout);

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container-site" style={{ position: "relative", zIndex: 1 }}>
          <div className="divider" style={{ background: "#1d4ed8" }} aria-hidden="true" />
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.4rem" }}>
            About Elphas Shilosio
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
            Background, vision, and commitment to Murhanda Ward
          </p>
        </div>
      </div>

      {/* Bio + Photo */}
      <section aria-labelledby="bio-heading" style={{ background: "#fff", paddingTop: "4rem", paddingBottom: "4rem", borderBottom: "1px solid #e4e4e7" }}>
        <div className="container-site">
          <div
            className="about-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3.5rem", alignItems: "start" }}
          >
            {/* Main content */}
            <div>
              <h2 id="bio-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "1.25rem" }}>
                Biography
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#52525b", fontSize: "1rem", lineHeight: 1.85, marginBottom: "2rem" }}>
                {about.bio}
              </p>

              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", marginBottom: "1rem" }}>
                Vision for Murhanda Ward
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#52525b", fontSize: "1rem", lineHeight: 1.85, marginBottom: "2rem" }}>
                {about.vision}
              </p>

              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)", marginBottom: "1rem" }}>
                Commitment to residents
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#52525b", fontSize: "1rem", lineHeight: 1.85 }}>
                {about.commitment}
              </p>
            </div>

            {/* Sidebar */}
            <aside className="about-sidebar" style={{ position: "sticky", top: "5rem" }}>

              {/* Photo — passport circle, same as home hero */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                <div style={{ position: "relative" }}>
                  {about.photo_url ? (
                    <img
                      src={about.photo_url}
                      alt="Elphas Shilosio"
                      loading="eager"
                      style={{
                        width: "clamp(200px, 28vw, 300px)",
                        height: "clamp(200px, 28vw, 300px)",
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
                        width: "clamp(200px, 28vw, 300px)",
                        height: "clamp(200px, 28vw, 300px)",
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
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="8" r="4" stroke="#93c5fd" strokeWidth="1.5" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span style={{ color: "#93c5fd", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", textAlign: "center", lineHeight: 1.5, padding: "0 1rem" }}>
                        Upload photo via<br />admin panel
                      </span>
                    </div>
                  )}

                  {/* Ward badge */}
                  <div
                    style={{
                      position: "absolute", bottom: "0.5rem", right: "-0.5rem",
                      background: "#1d4ed8", color: "#fff",
                      fontFamily: "'Inter', sans-serif", fontWeight: 600,
                      fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "0.35rem 0.8rem", borderRadius: "9999px",
                      boxShadow: "0 4px 16px rgba(29,78,216,0.4)", whiteSpace: "nowrap",
                    }}
                    aria-hidden="true"
                  >
                    Murhanda Ward
                  </div>
                </div>
              </div>

              {/* Quick facts */}
              <div style={{ background: "#0f172a", borderRadius: "1rem", padding: "1.5rem" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>
                  Quick facts
                </p>
                {[
                  { label: "Position", value: "MCA Candidate" },
                  { label: "Ward",     value: "Murhanda Ward" },
                  { label: "County",   value: "Kakamega County" },
                  { label: "Projects", value: "18+ completed" },
                  { label: "Sectors",  value: "14 covered" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", paddingBottom: "0.6rem", marginBottom: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem" }}>{label}</span>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 500, textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-heading" style={{ background: "#fafafa", paddingTop: "4rem", paddingBottom: "4rem", borderBottom: "1px solid #e4e4e7" }}>
        <div className="container-site" style={{ maxWidth: 800 }}>
          <div className="divider" aria-hidden="true" />
          <h2 id="timeline-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "2.5rem" }}>
            Timeline of service
          </h2>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div aria-hidden="true" style={{ position: "absolute", left: "3.25rem", top: 0, bottom: 0, width: 2, background: "#e4e4e7" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {about.timeline.map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative" }}>
                  <div style={{ flexShrink: 0, width: "6.5rem", textAlign: "right", paddingRight: "1.75rem", position: "relative" }}>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: "#1d4ed8", fontSize: "1.1rem" }}>
                      {entry.year}
                    </span>
                    {/* FIX: was var(--clay-200) — wrong variable */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute", right: "-5px", top: "50%",
                        transform: "translateY(-50%)",
                        width: 10, height: 10, borderRadius: "50%",
                        background: "#1d4ed8",
                        border: "2px solid #fff",
                        boxShadow: "0 0 0 2px #bfdbfe",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, background: "#fff", border: "1.5px solid #e4e4e7", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", color: "#3f3f46", fontSize: "0.9rem", lineHeight: 1.65 }}>
                      {entry.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" style={{ background: "#fff", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-site">
          <div className="divider" aria-hidden="true" />
          <h2 id="values-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "2rem" }}>
            Core values
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {about.values.map((v, i) => (
              <div
                key={i}
                style={{ background: "#fafafa", border: "1.5px solid #e4e4e7", borderTop: "3px solid #2563eb", borderRadius: "0.875rem", padding: "1.5rem" }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#18181b", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#71717a", fontSize: "0.875rem", lineHeight: 1.65 }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Call to action" style={{ background: "#0f172a", paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" }}>
        <div className="container-site" style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "1rem" }}>
            See the work on the ground
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", marginBottom: "2rem", lineHeight: 1.7 }}>
            Browse all 18+ completed projects across 14 sectors of Murhanda Ward.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/projects"
              style={{
                background: "#1d4ed8", color: "#fff",
                fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9rem",
                padding: "0.85rem 2rem", borderRadius: "0.6rem", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(29,78,216,0.4)",
              }}
            >
              View projects
            </Link>
            <Link
              href="/contact"
              style={{
                border: "1.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)",
                fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.9rem",
                padding: "0.85rem 2rem", borderRadius: "0.6rem", textDecoration: "none",
              }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
