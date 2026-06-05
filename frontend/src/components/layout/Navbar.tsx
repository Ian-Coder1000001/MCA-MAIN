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
  const pathname                  = usePathname();
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      role="banner"
      style={{
        background: "var(--forest-800)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.35)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="container-site flex items-center justify-between h-16">

        {/* Brand */}
        <Link
          href="/"
          aria-label="Elphas Shilosio — Home"
          className="flex flex-col leading-tight shrink-0"
          style={{ textDecoration: "none" }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#ffffff",
              fontSize: "1.1rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Elphas Shilosio
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
            }}
          >
            MCA Candidate · Murhanda Ward
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                style={{
                  color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  borderBottom: active ? "2px solid var(--clay-400)" : "2px solid transparent",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: active ? 500 : 400,
                  padding: "0.5rem 0.875rem",
                  borderRadius: "0.375rem 0.375rem 0 0",
                  transition: "all 0.18s ease",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            style={{
              background: "var(--clay-400)",
              color: "#ffffff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "0.45rem 1.1rem",
              borderRadius: "0.5rem",
              marginLeft: "0.75rem",
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
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
          style={{ background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          <span style={{
            display: "block", width: 20, height: 2, background: "#fff",
            borderRadius: 2,
            transform: open ? "rotate(45deg) translateY(6px)" : "none",
            transition: "transform 0.22s ease",
          }} />
          <span style={{
            display: "block", width: 20, height: 2, background: "#fff",
            borderRadius: 2, opacity: open ? 0 : 1,
            transition: "opacity 0.15s ease",
          }} />
          <span style={{
            display: "block", width: 20, height: 2, background: "#fff",
            borderRadius: 2,
            transform: open ? "rotate(-45deg) translateY(-6px)" : "none",
            transition: "transform 0.22s ease",
          }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        style={{
          background: "var(--forest-900)",
          maxHeight: open ? "420px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div className="container-site py-3 flex flex-col gap-0.5 pb-5">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  borderLeft: active ? "3px solid var(--clay-400)" : "3px solid transparent",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  padding: "0.65rem 1rem",
                  borderRadius: "0 0.375rem 0.375rem 0",
                  textDecoration: "none",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            style={{
              background: "var(--clay-400)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.5rem",
              marginTop: "0.75rem",
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
