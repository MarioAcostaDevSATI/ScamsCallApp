import './globals.css'

export const metadata = {
  title: 'Scams Call Colombia',
  description: 'Plataforma colaborativa para reportar estafas telefónicas',
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
