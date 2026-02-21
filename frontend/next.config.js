/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
    ],
    // Local images from /public are always allowed
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
}

module.exports = nextConfig
