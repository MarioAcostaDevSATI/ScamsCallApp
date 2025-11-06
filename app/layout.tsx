import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scams Call - Reporta Estafas Telefónicas',
  description: 'Plataforma para reportar estafas telefónicas en Colombia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
