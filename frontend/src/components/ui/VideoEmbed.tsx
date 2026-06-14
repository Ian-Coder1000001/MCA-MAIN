/**
 * VideoEmbed
 * Accepts ANY video input and renders correctly:
 *   - YouTube watch URL:  https://www.youtube.com/watch?v=ID
 *   - YouTube short URL:  https://youtu.be/ID
 *   - YouTube embed URL:  https://www.youtube.com/embed/ID
 *   - Vimeo URL:          https://vimeo.com/123456789
 *   - Raw <iframe> code:  <iframe src="..." ...></iframe>
 *   - Direct video file:  https://example.com/video.mp4
 */

const IFRAME_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0,
  width: "100%", height: "100%",
  border: "none",
};

function getYouTubeId(url: string): string | null {
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}

function extractIframeSrc(raw: string): string | null {
  const match = raw.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`;
}

export function VideoEmbed({ url, title = "Video" }: { url: string; title?: string }) {
  if (!url || !url.trim()) return null;
  const t = url.trim();

  // Raw <iframe> embed code
  if (t.startsWith("<iframe") || t.startsWith("<IFRAME")) {
    const src = extractIframeSrc(t);
    if (src) {
      return (
        <iframe src={src} title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen style={IFRAME_STYLE} />
      );
    }
  }

  // YouTube
  const ytId = getYouTubeId(t);
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen style={IFRAME_STYLE} />
    );
  }

  // Vimeo
  const vimeoUrl = getVimeoEmbedUrl(t);
  if (vimeoUrl) {
    return (
      <iframe src={vimeoUrl} title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen style={IFRAME_STYLE} />
    );
  }

  // Direct video file
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(t)) {
    return (
      <video src={t} controls preload="metadata"
        style={{ ...IFRAME_STYLE, objectFit: "cover" }}>
        Your browser does not support the video tag.
      </video>
    );
  }

  // Generic URL fallback
  if (t.startsWith("http")) {
    return <iframe src={t} title={title} allowFullScreen style={IFRAME_STYLE} />;
  }

  return null;
}
