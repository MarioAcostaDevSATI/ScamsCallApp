/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Elimina la configuración de env aquí, se maneja en el workflow
}

module.exports = nextConfig
