"use client";

import { VideoEmbed } from "./VideoEmbed";

/**
 * VideoSection
 * Renders a video URL in a proper 16:9 container.
 * Handles YouTube, Vimeo, direct files, raw iframes.
 * Use this anywhere you want to show a video in a page.
 */
export function VideoSection({
  url,
  title,
  caption,
}: {
  url: string;
  title?: string;
  caption?: string;
}) {
  if (!url || !url.trim()) return null;

  return (
    <div style={{ width: "100%", marginBottom: "1.5rem" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%",
          borderRadius: "0.875rem",
          overflow: "hidden",
          background: "#0c0c0c",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}
      >
        <VideoEmbed url={url} title={title || caption || "Video"} />
      </div>
      {caption && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#71717a",
            fontSize: "0.82rem",
            marginTop: "0.5rem",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
