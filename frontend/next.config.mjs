/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any HTTPS source (Render, Supabase, Cloudinary, etc.)
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "localhost" },
      { protocol: "http",  hostname: "127.0.0.1" },
    ],
  },
  // Needed for video/media from external sources in some browsers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
