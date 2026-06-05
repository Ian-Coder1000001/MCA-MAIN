"use client";

/**
 * LazyImage
 * ──────────────────────────────────────────────────────────────────────────
 * Uses IntersectionObserver to defer image loading until the element is near
 * the viewport (rootMargin: 200px). Shows a shimmer skeleton while loading.
 *
 * Usage:
 *   <LazyImage src={url} alt="description" aspectRatio="4/3" />
 *   <LazyImage src={url} alt="description" fill objectFit="cover" />
 *
 * Falls back to native loading="lazy" when IntersectionObserver is unavailable
 * (very old browsers / SSR).
 */

import { useRef, useState, useEffect, useCallback } from "react";

interface LazyImageProps {
  /** Image source URL */
  src: string | null | undefined;
  /** Alt text — required for accessibility */
  alt: string;
  /** CSS aspect-ratio e.g. "4/3", "16/9", "1". Applied to the wrapper. */
  aspectRatio?: string;
  /** Fill the parent container (position:absolute inset-0). Parent must be position:relative */
  fill?: boolean;
  /** object-fit — default "cover" */
  objectFit?: React.CSSProperties["objectFit"];
  /** object-position — default "center" */
  objectPosition?: React.CSSProperties["objectPosition"];
  /** Extra styles on the wrapper div */
  wrapperStyle?: React.CSSProperties;
  /** Extra styles on the <img> element */
  imgStyle?: React.CSSProperties;
  /** className on the wrapper */
  className?: string;
  /** Rendered while image is loading — defaults to shimmer skeleton */
  placeholder?: React.ReactNode;
  /** Called once image finishes loading */
  onLoad?: () => void;
  /** priority: skip lazy load — equivalent to eager. Use above-the-fold images */
  priority?: boolean;
  /** Width attribute (helps browser reserve layout space) */
  width?: number;
  /** Height attribute */
  height?: number;
}

export function LazyImage({
  src,
  alt,
  aspectRatio,
  fill = false,
  objectFit = "cover",
  objectPosition = "center",
  wrapperStyle,
  imgStyle,
  className,
  placeholder,
  onLoad,
  priority = false,
  width,
  height,
}: LazyImageProps) {
  const wrapperRef           = useRef<HTMLDivElement>(null);
  // Treat empty string the same as null — backend returns "" when no image set
  const normalizedSrc        = src && src.trim() !== "" ? src : null;
  const [visible, setVisible] = useState(priority);
  const [loaded, setLoaded]   = useState(false);
  const [error, setError]     = useState(false);

  // Trigger IntersectionObserver once on mount
  useEffect(() => {
    if (priority || !normalizedSrc) return;

    // Fallback: no IntersectionObserver → load immediately
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" } // start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, src]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  // Wrapper styles
  const wrapperBaseStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...wrapperStyle,
      }
    : {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        aspectRatio: aspectRatio ?? undefined,
        ...wrapperStyle,
      };

  // Skeleton placeholder (shimmer)
  const defaultPlaceholder = (
    <div
      className="skeleton"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );

  // Error fallback
  const errorFallback = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        background: "var(--stone-100)",
      }}
      role="img"
      aria-label={alt}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3" y="3" width="18" height="18"
          rx="2"
          stroke="var(--stone-300)"
          strokeWidth="1.5"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="var(--stone-300)" />
        <path
          d="M21 15l-5-5L5 21"
          stroke="var(--stone-300)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.68rem",
          color: "var(--stone-400)",
          textAlign: "center",
          padding: "0 0.5rem",
        }}
      >
        Image unavailable
      </span>
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={wrapperBaseStyle}
    >
      {/* Show skeleton while not yet loaded */}
      {!loaded && !error && normalizedSrc && (
        <>
          {placeholder ?? defaultPlaceholder}
        </>
      )}

      {/* Error state */}
      {error && errorFallback}

      {/* The actual image — only render src when visible */}
      {normalizedSrc && !error && (
        <img
          src={visible ? normalizedSrc : undefined}
          data-src={normalizedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit,
            objectPosition,
            display: "block",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.35s ease",
            zIndex: 2,
            ...imgStyle,
          }}
        />
      )}
    </div>
  );
}
