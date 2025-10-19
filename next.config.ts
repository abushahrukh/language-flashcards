// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  assetPrefix: '.', // Current directory
  basePath: '',
  images: {
    unoptimized: true,
  },
  // Disable optimization to keep file names predictable
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;