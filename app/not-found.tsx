"use client";

import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-emerald-400">404</h1>
        <p className="text-lg text-zinc-400 mb-8">Página não encontrada.</p>
        <a href="/" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-colors">
          Voltar ao início
        </a>
      </div>
    </div>
  );
}
