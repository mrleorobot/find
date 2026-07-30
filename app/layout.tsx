import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LedgerIQ',
  description: 'AI-Powered Financial Audit & Document Extraction',
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
