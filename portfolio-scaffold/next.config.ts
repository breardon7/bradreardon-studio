import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // For a fully static export (no server needed, pure CDN):
  // output: 'export',

  images: {
    // Formats served by Vercel CDN
    formats: ['image/avif', 'image/webp'],
    // Quality default — override per-image with quality prop
    quality: 85,
    // If exporting statically, use a loader:
    // loader: 'custom', loaderFile: './imageLoader.ts',
  },

  // Strict mode catches subtle React bugs
  reactStrictMode: true,
}

export default nextConfig
