/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Once an image is optimized at a given size, keep serving that cached
    // copy for a year instead of Next's short default TTL — repeat visits
    // shouldn't re-trigger optimization work against Vercel's quota.
    minimumCacheTTL: 31536000,
  },
};

module.exports = nextConfig;
