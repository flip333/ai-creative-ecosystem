"use client";

import React from "react";
import { ArrowRight, Lock } from "lucide-react";

import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 shrink-0">
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
                    <Link href="/#plataforma" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Plataforma</Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 shrink-0">
                    {/* Acceso de clientes: discreto pero visible también en móvil,
                        donde el resto del menú se oculta. */}
                    <Link
                        href="/login"
                        aria-label="Entrar al portal de clientes"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-primary transition-colors shrink-0"
                    >
                        <Lock size={14} />
                        <span className="hidden sm:inline">Portal</span>
                    </Link>

                    <Link
                        href="/diagnostico"
                        className="btn-premium px-4 sm:px-6 py-2.5 text-xs sm:text-sm inline-block shrink-0 whitespace-nowrap"
                    >
                        <span className="flex items-center gap-2">
                            {/* En móvil el label largo parte el botón en dos líneas */}
                            <span className="sm:hidden">Diagnóstico</span>
                            <span className="hidden sm:inline">Diagnóstico gratis</span>
                            <ArrowRight size={16} />
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
