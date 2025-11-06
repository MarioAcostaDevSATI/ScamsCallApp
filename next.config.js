/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/ScamsCallApp' : '',
  assetPrefix: isProd ? '/ScamsCallApp/' : '',
  images: {
    unoptimized: true
  },
  // REMOVER la configuración experimental de appDir
}

module.exports = nextConfig
