"use client";

import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
  /** Full URL to share — defaults to current page if omitted */
  url?: string;
  /** Title used in share text */
  title: string;
  /** Short description used in share text */
  description?: string;
}

interface Platform {
  id: string;
  label: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
  getHref: (url: string, title: string, description: string) => string | null;
}

const platforms: Platform[] = [
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    hoverColor: "#166fe5",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    getHref: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    color: "#000000",
    hoverColor: "#333",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getHref: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    hoverColor: "#1ebe5d",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
    getHref: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "#229ED9",
    hoverColor: "#1a8bbf",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    getHref: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export function ShareButton({ url, title, description = "" }: ShareButtonProps) {
  const [open, setOpen]       = useState(false);
  const [copied, setCopied]   = useState(false);
  const menuRef               = useRef<HTMLDivElement>(null);
  const buttonRef             = useRef<HTMLButtonElement>(null);

  // Resolve URL — use prop or current page
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setResolvedUrl(window.location.href);
    }
  }, [url]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("input");
      el.value = resolvedUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, text: description, url: resolvedUrl }).catch(() => {});
      return true;
    }
    return false;
  }

  function handleShareClick() {
    // On mobile, try native share sheet first
    if (handleNativeShare()) return;
    setOpen((prev) => !prev);
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={handleShareClick}
        aria-expanded={open}
        aria-label="Share this page"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.55rem 1.1rem",
          borderRadius: "0.5rem",
          border: "1.5px solid #e4e4e7",
          background: "#fff",
          color: "#3f3f46",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.18s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#1d4ed8";
          (e.currentTarget as HTMLElement).style.color = "#1e3a5f";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#e4e4e7";
          (e.currentTarget as HTMLElement).style.color = "#3f3f46";
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Share
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Share options"
          style={{
            position: "absolute",
            bottom: "calc(100% + 0.5rem)",
            right: 0,
            background: "#fff",
            border: "1.5px solid #e4e4e7",
            borderRadius: "0.875rem",
            boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
            padding: "0.5rem",
            minWidth: 220,
            zIndex: 50,
            animation: "fadeUp 0.18s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* Platform buttons */}
          {platforms.map((p) => {
            const href = p.getHref(resolvedUrl, title, description);
            if (!href) return null;
            return (
              <a
                key={p.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.875rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  color: "#27272a",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#f4f4f5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: "0.4rem",
                  background: p.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {p.icon}
                </span>
                {p.label}
              </a>
            );
          })}

          {/* Divider */}
          <div style={{ height: 1, background: "#f4f4f5", margin: "0.375rem 0.5rem" }} />

          {/* Copy link */}
          <button
            role="menuitem"
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.65rem 0.875rem",
              borderRadius: "0.5rem",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#27272a",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f4f4f5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{
              width: 30, height: 30, borderRadius: "0.4rem",
              background: copied ? "#1d4ed8" : "#18181b",
              color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}>
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </span>
            {copied ? "Copied!" : "Copy link"}
          </button>

          {/* URL preview */}
          <div style={{
            margin: "0.375rem 0.5rem 0.25rem",
            padding: "0.5rem 0.625rem",
            background: "#fafafa",
            borderRadius: "0.4rem",
            border: "1px solid #e4e4e7",
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#a1a1aa",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {resolvedUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
