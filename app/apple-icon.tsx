import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          borderRadius: '22%',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="#ffffff" strokeWidth="2" fill="none"/>
          <line x1="6" y1="9" x2="18" y2="9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="6" y1="13" x2="14" y2="13" stroke="#888888" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="6" y1="17" x2="10" y2="17" stroke="#888888" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    ),
    { ...size }
  )
}
