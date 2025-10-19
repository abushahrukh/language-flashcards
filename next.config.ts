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
  
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
