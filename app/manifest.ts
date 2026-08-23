import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LedgerIQ — Auditoria Fiscal com IA',
    short_name: 'LedgerIQ',
    description: 'Extração automática de notas fiscais e auditoria financeira com inteligência artificial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    orientation: 'portrait',
    scope: '/',
    lang: 'pt-BR',
    categories: ['finance', 'productivity', 'business'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
