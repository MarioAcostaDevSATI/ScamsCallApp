import './globals.css'

export const metadata = {
  title: 'Scams Call Colombia',
  description: 'Reporta estafas telefónicas en Colombia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
