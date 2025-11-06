/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/ScamsCallApp',
  assetPrefix: '/ScamsCallApp/',
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
