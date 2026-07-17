import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinCategorizer',
  description: 'Inteligência para as suas Notas Fiscais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
