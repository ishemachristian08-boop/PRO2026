/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '.next',
  images: {
    // Allow images from Cloudinary and other external sources
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
      },
    ],
    // Local images from /public are always allowed
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
  // Add path alias
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': require('path').resolve(__dirname, 'lib'),
    };
    return config;
  },
}

module.exports = nextConfig


