import React from 'react';

/**
 * Custom 100% handcrafted Glassmorphism & Y2K Apple Aqua visual components.
 * Built with layered SVG gradients, specular highlight paths, and glossy bevels.
 */

export function AquaOrbLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aquaSphere" cx="30%" cy="25%" r="75%" fx="25%" fy="20%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="45%" stopColor="#2563eb" />
          <stop offset="85%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <linearGradient id="topHighlight" x1="20" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="innerBevel" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Outer Glow Ring */}
      <circle cx="20" cy="20" r="19" fill="url(#innerBevel)" />
      <circle cx="20" cy="20" r="18" fill="url(#aquaSphere)" />
      {/* Top Specular Gloss Arc */}
      <path d="M 6 18 C 6 10, 12 5, 20 5 C 28 5, 34 10, 34 18 C 28 12, 12 12, 6 18 Z" fill="url(#topHighlight)" />
      {/* Document Glyph cut in metallic white */}
      <path d="M 15 13 H 23 L 26 16 V 27 C 26 28.1 25.1 29 24 29 H 15 C 13.9 29 13 28.1 13 27 V 15 C 13 13.9 13.9 13 15 13 Z" fill="white" fillOpacity="0.9" />
      <path d="M 23 13 V 16 H 26" fill="black" fillOpacity="0.3" />
      <line x1="16" y1="19" x2="23" y2="19" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="22" x2="23" y2="22" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="25" x2="20" y2="25" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AquaDocumentIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="docGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="foldGrad" x1="20" y1="2" x2="28" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <rect x="5" y="3" width="22" height="26" rx="4" fill="url(#docGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      <path d="M 20 3 L 27 10 H 22 C 20.9 10 20 9.1 20 8 V 3 Z" fill="url(#foldGrad)" />
      <rect x="9" y="12" width="14" height="2" rx="1" fill="#1e293b" fillOpacity="0.7" />
      <rect x="9" y="16" width="14" height="2" rx="1" fill="#1e293b" fillOpacity="0.7" />
      <rect x="9" y="20" width="9" height="2" rx="1" fill="#2563eb" fillOpacity="0.8" />
    </svg>
  );
}

export function AquaUploadIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="uploadGlow" cx="24" cy="24" r="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="arrowGel" x1="24" y1="12" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#uploadGlow)" />
      <circle cx="24" cy="24" r="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      {/* Glass Cloud / Tray */}
      <path d="M 14 30 C 14 30, 18 34, 24 34 C 30 34, 34 30, 34 30" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
      {/* Upward Aqua Arrow */}
      <path d="M 24 12 L 16 20 H 21 V 28 H 27 V 20 H 32 L 24 12 Z" fill="url(#arrowGel)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function AquaScanLensIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lensGrad" cx="16" cy="16" r="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#lensGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M 8 12 C 8 8, 12 6, 16 6 C 18 6, 21 7, 23 9 C 18 8, 11 11, 8 12 Z" fill="white" fillOpacity="0.7" />
      <line x1="8" y1="16" x2="24" y2="16" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="1 1" />
    </svg>
  );
}

export function AquaShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <path d="M 16 3 L 28 7 V 16 C 28 23 23 28 16 30 C 9 28 4 23 4 16 V 7 L 16 3 Z" fill="url(#shieldGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <path d="M 16 5 L 26 8.5 V 15 C 26 21 21.5 25.5 16 27.5 V 5 Z" fill="white" fillOpacity="0.2" />
      <path d="M 11 16 L 14.5 19.5 L 21 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AquaArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 4 10 H 16 M 11 5 L 16 10 L 11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AquaCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 4 10.5 L 8 14.5 L 16 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AquaSearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AquaGearIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M 10 2 V 4 M 10 16 V 18 M 2 10 H 4 M 16 10 H 18 M 4.3 4.3 L 5.7 5.7 M 14.3 14.3 L 15.7 15.7 M 4.3 15.7 L 5.7 14.3 M 14.3 5.7 L 15.7 4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Mac OS X Aqua Window Chrome Header with Red/Yellow/Green Traffic Lights
 */
export function AquaWindowBar({ title, icon, rightContent }: { title: string; icon?: React.ReactNode; rightContent?: React.ReactNode }) {
  return (
    <div className="aqua-window-header px-4 py-2.5 flex items-center justify-between select-none -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 rounded-t-3xl border-b border-white/20">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full gel-traffic-red transition-transform hover:scale-110 cursor-pointer" title="Close Window" />
        <div className="w-3 h-3 rounded-full gel-traffic-yellow transition-transform hover:scale-110 cursor-pointer" title="Minimize Window" />
        <div className="w-3 h-3 rounded-full gel-traffic-green transition-transform hover:scale-110 cursor-pointer" title="Zoom Window" />
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightContent || <span className="text-[10px] font-mono text-cyan-200/60 font-bold">LedgerIQ v3.5</span>}
      </div>
    </div>
  );
}

