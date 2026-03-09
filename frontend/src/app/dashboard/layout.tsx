"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../../components/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('fighterToken');
        if (!token) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <div className="min-h-screen bg-[var(--color-fighter-bg)]" />;

    return (
        <div className="min-h-screen bg-[var(--color-fighter-bg)] text-white pb-20">
            <main className="max-w-md mx-auto relative min-h-screen">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
