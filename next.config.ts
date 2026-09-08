import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The source art in public/ is heavy (cap.png 1.7MB, acc.png 1.4MB,
    // hero4.png 937KB, logo1.png 638KB rendered at 58px). Serving AVIF/WebP
    // and holding the optimized variants for 30 days keeps that off the
    // critical path instead of re-encoding them constantly.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
