"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About"    },
  { href: "/projects", label: "Projects" },
  { href: "/news",     label: "News"     },
  { href: "/gallery",  label: "Gallery"  },
  { href: "/contact",  label: "Contact"  },
];

export function Navbar() {
  const pathname                = usePathname();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      role="banner"
      style={{
        background: "#16a34a",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.18)" : "0 1px 0 rgba(255,255,255,0.1)",
        transition: "box-shadow 0.3s ease",
      }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="container-site flex items-center justify-between h-16">

        {/* Brand */}
        <Link
          href="/"
          aria-label="Elphas Shilosio — Home"
          style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#ffffff",
            fontSize: "1.15rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}>
            Elphas Shilosio
          </span>
          <span style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>
            MCA Candidate · Murhanda Ward
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                style={{
                  color: active ? "#ffffff" : "rgba(255,255,255,0.82)",
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  borderBottom: active ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  padding: "0.5rem 0.9rem",
                  borderRadius: "0.375rem 0.375rem 0 0",
                  transition: "all 0.18s ease",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.82)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            style={{
              background: "#ffffff",
              color: "#15803d",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 700,
              padding: "0.45rem 1.2rem",
              borderRadius: "0.5rem",
              marginLeft: "0.5rem",
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f0fdf4";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#ffffff";
            }}
          >
            Get in touch
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 items-center rounded-lg"
          style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block", width: 20, height: 2,
                background: "#fff", borderRadius: 2,
                transition: "all 0.22s ease",
                transform:
                  i === 0 && open ? "rotate(45deg) translateY(6px)" :
                  i === 2 && open ? "rotate(-45deg) translateY(-6px)" : "none",
                opacity: i === 1 && open ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        style={{
          background: "#14532d",
          maxHeight: open ? "480px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div className="container-site py-3 flex flex-col gap-1 pb-5">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  color: active ? "#ffffff" : "rgba(255,255,255,0.75)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  borderLeft: active ? "3px solid rgba(255,255,255,0.8)" : "3px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  padding: "0.7rem 1rem",
                  borderRadius: "0 0.375rem 0.375rem 0",
                  textDecoration: "none",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            style={{
              background: "#ffffff",
              color: "#15803d",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.8rem 1.25rem",
              borderRadius: "0.5rem",
              marginTop: "0.5rem",
              textAlign: "center",
              textDecoration: "none",
              display: "block",
            }}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  );
}
