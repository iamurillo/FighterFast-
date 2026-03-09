"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('fighterToken');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-fighter-bg)] text-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-[var(--color-fighter-surface)] border border-[var(--color-fighter-red)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.4)] mb-4">
          <svg className="w-8 h-8 text-[var(--color-fighter-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-sm font-bold tracking-widest uppercase text-gray-400">Cargando FighterFast...</p>
      </div>
    </div>
  );
}
