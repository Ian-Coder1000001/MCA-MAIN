"use client";

import Link from "next/link";

const navLinks = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About"    },
  { href: "/projects", label: "Projects" },
  { href: "/news",     label: "News"     },
  { href: "/gallery",  label: "Gallery"  },
  { href: "/contact",  label: "Contact"  },
];

const sectors = [
  "Health", "Education", "Transport & Roads",
  "Water & Sanitation", "Agriculture", "Security & Lighting",
  "Youth & Sports", "Women Empowerment", "ICT & Digital",
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" style={{ background: "#0f0f0f", flexShrink: 0 }}>
      {/* Top accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)" }} />

      <div className="container-site py-14">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem",
        }}>

          {/* Brand */}
          <div>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              lineHeight: 1.2,
            }}>
              Elphas<br />Shilosio
            </p>
            <p style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.85rem",
              lineHeight: 1.8,
              fontFamily: "'Inter', sans-serif",
              marginBottom: "1.5rem",
            }}>
              MCA Candidate for Murhanda Ward, Kakamega County.
              Committed to development, accountability, and servant leadership.
            </p>
            <a
              href="https://facebook.com/YOUR_PAGE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Facebook"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#1877F2",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                padding: "0.5rem 1.1rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              Facebook
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "1.25rem",
            }}>
              Navigation
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="footer-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <p style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "1.25rem",
            }}>
              Project sectors
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {sectors.map((s) => (
                <li key={s} style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Pledge */}
          <div>
            <p style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "1.25rem",
            }}>
              Our pledge
            </p>
            <blockquote style={{ borderLeft: "3px solid #16a34a", paddingLeft: "1rem", margin: 0 }}>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
              }}>
                &ldquo;Promises made are promises kept — in concrete and iron.&rdquo;
              </p>
              <cite style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                fontStyle: "normal",
                display: "block",
                marginTop: "0.75rem",
              }}>
                &mdash; Elphas Shilosio
              </cite>
            </blockquote>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem" }}>
            &copy; {year} Elphas Shilosio Campaign &middot; Murhanda Ward, Kakamega County
          </p>
          <p style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
            Murhanda Ward
          </p>
        </div>
      </div>
    </footer>
  );
}
