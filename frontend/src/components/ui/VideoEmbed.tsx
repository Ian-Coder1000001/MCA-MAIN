/**
 * VideoEmbed
 * ─────────────────────────────────────────────────────────────────────────
 * Accepts ANY of these formats from the admin panel and renders correctly:
 *
 *  YouTube watch URL:   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *  YouTube short URL:   https://youtu.be/dQw4w9WgXcQ
 *  YouTube embed URL:   https://www.youtube.com/embed/dQw4w9WgXcQ
 *  YouTube with params: https://youtu.be/dQw4w9WgXcQ?si=XXXX
 *  Raw iframe code:     <iframe src="https://www.youtube.com/embed/..." ...></iframe>
 *  Self-hosted video:   https://example.com/video.mp4
 *  Vimeo:               https://vimeo.com/123456789
 *
 * It fills its parent container (position:absolute inset:0).
 * Parent must be:  position:relative; padding-bottom:56.25%; (16:9)
 */

const IFRAME_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: "none",
};

/**
 * Extract a YouTube video ID from any YouTube URL format.
 * Returns null if not a YouTube URL.
 */
function getYouTubeId(url: string): string | null {
  // Already an embed URL — extract ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Standard watch URL: youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Short URL: youtu.be/ID or youtu.be/ID?si=...
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  return null;
}

/**
 * If the admin pasted a raw <iframe ...> string, extract just the src.
 */
function extractIframeSrc(raw: string): string | null {
  const match = raw.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Convert a Vimeo URL to its embed form.
 */
function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`;
}

export function VideoEmbed({ url, title = "Video" }: { url: string; title?: string }) {
  if (!url || !url.trim()) return null;

  const trimmed = url.trim();

  // ── Case 1: raw <iframe> embed code pasted from YouTube / Vimeo ──────────
  if (trimmed.startsWith("<iframe") || trimmed.startsWith("<IFRAME")) {
    const src = extractIframeSrc(trimmed);
    if (src) {
      return (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={IFRAME_STYLE}
        />
      );
    }
  }

  // ── Case 2: any YouTube URL format ───────────────────────────────────────
  const youtubeId = getYouTubeId(trimmed);
  if (youtubeId) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;
    return (
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={IFRAME_STYLE}
      />
    );
  }

  // ── Case 3: Vimeo URL ─────────────────────────────────────────────────────
  const vimeoUrl = getVimeoEmbedUrl(trimmed);
  if (vimeoUrl) {
    return (
      <iframe
        src={vimeoUrl}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={IFRAME_STYLE}
      />
    );
  }

  // ── Case 4: direct video file (mp4, webm, etc.) ───────────────────────────
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(trimmed)) {
    return (
      <video
        src={trimmed}
        controls
        preload="metadata"
        style={{ ...IFRAME_STYLE, objectFit: "cover" }}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // ── Case 5: fallback — try as a generic iframe src ────────────────────────
  // Covers custom embed URLs or anything else that looks like a URL
  if (trimmed.startsWith("http")) {
    return (
      <iframe
        src={trimmed}
        title={title}
        allowFullScreen
        style={IFRAME_STYLE}
      />
    );
  }

  // Nothing matched — render nothing (parent shows placeholder)
  return null;
}
