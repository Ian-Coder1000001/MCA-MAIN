"use client";

import Link from "next/link";
import { LazyImage } from "@/components/ui/LazyImage";
import { ShareButton } from "@/components/ui/ShareButton";
import type { NewsArticle } from "@/types";

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
  "linear-gradient(135deg, #1e293b 0%, #2563eb 100%)",
  "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "long", year: "numeric",
  });
}

interface Props {
  article: NewsArticle;
  index: number;
  siteUrl: string;
}

export function NewsCard({ article, index, siteUrl }: Props) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="card-lift"
      style={{
        background: "#fff",
        borderRadius: "1rem",
        overflow: "hidden",
        border: "1.5px solid #e4e4e7",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label={`Read: ${article.title}`}
    >
      {/* Cover image */}
      <div style={{
        height: 220, flexShrink: 0,
        position: "relative", overflow: "hidden",
        background: article.cover_image ? "#f4f4f5" : CARD_GRADIENTS[index % CARD_GRADIENTS.length],
      }}>
        {article.cover_image ? (
          <LazyImage
            src={article.cover_image}
            alt={article.title}
            fill objectFit="cover"
            priority={index === 0}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Inter',sans-serif", fontSize: "0.75rem" }}>
              Photo from admin panel
            </span>
          </div>
        )}

        {/* Author chip */}
        <div style={{
          position: "absolute", top: "0.75rem", left: "0.75rem",
          background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.9)",
          fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 500,
          padding: "0.25rem 0.6rem", borderRadius: "0.375rem", zIndex: 3,
        }}>
          {article.author}
        </div>

        {/* Date chip */}
        {article.published_at && (
          <div style={{
            position: "absolute", bottom: "0.75rem", left: "0.75rem",
            background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.9)",
            fontFamily: "'Inter',sans-serif", fontSize: "0.7rem",
            padding: "0.25rem 0.6rem", borderRadius: "0.375rem", zIndex: 3,
          }}>
            {formatDate(article.published_at)}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "1.25rem 1.4rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h2 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          color: "#18181b", fontSize: "clamp(1rem,3vw,1.1rem)",
          fontWeight: 600, lineHeight: 1.35, marginBottom: "0.65rem",
        }}>
          {article.title}
        </h2>
        <p style={{
          color: "#71717a", fontFamily: "'Inter',sans-serif",
          fontSize: "clamp(0.85rem,2.5vw,0.875rem)", lineHeight: 1.65,
          flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {article.excerpt}
        </p>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem", gap: "0.5rem", flexWrap: "wrap",
        }}>
          <p style={{
            color: "#1d4ed8", fontFamily: "'Inter',sans-serif",
            fontWeight: 600, fontSize: "0.82rem",
            display: "flex", alignItems: "center", gap: "0.25rem",
          }}>
            Read article
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
          {/* Stop the Link from navigating when share is tapped */}
          <div onClick={(e) => e.preventDefault()}>
            <ShareButton
              url={`${siteUrl}/news/${article.slug}`}
              title={article.title}
              description={article.excerpt}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
