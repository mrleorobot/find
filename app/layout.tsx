import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LedgerIQ — Auditoria Fiscal com IA',
  description: 'Extração automática de notas fiscais, categorização de despesas e auditoria financeira com inteligência artificial. Reduza o tempo de processamento de 4h para 15 min.',
  keywords: ['auditoria fiscal', 'nota fiscal', 'IA', 'extração de documentos', 'contabilidade', 'Natal RN'],
  authors: [{ name: 'Leonilson Souza' }],
  creator: 'Leonilson Souza',
  metadataBase: new URL('https://mrleorobot.github.io'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://mrleorobot.github.io',
    siteName: 'LedgerIQ',
    title: 'LedgerIQ — Auditoria Fiscal com IA',
    description: 'Extração automática de notas fiscais e auditoria financeira com IA.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'LedgerIQ — Dashboard de auditoria fiscal',
    }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LedgerIQ — Auditoria Fiscal com IA',
    description: 'Extração automática de notas fiscais e auditoria financeira com IA.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://mrleorobot.github.io',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  )
}
