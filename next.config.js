/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resizer.otstatic.com',
      },
    ],
  },
}

module.exports = nextConfig
