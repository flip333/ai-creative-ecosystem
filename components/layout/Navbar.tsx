"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)]">
                        <span className="text-black font-bold text-xl">G</span>
                    </div>
                    <span className="font-display font-medium text-xl tracking-tight text-white italic">
                        Gen<span className="text-primary NOT-italic">flow</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/soluciones" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Soluciones</Link>
                    <Link href="/metodologia" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Metodología</Link>
                    <Link href="/beneficios" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Beneficios</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/diagnostico" className="btn-premium px-6 py-2.5 text-sm inline-block">
                        <span className="flex items-center gap-2">
                            Empezar <ArrowRight size={16} />
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
