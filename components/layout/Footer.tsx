"use client";

import React from "react";

export const Footer = () => {
    return (
        <footer className="py-20 bg-black border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                            <span className="text-primary font-bold text-xl">A</span>
                        </div>
                        <span className="font-display font-medium text-xl tracking-tight text-white">
                            AI Creative <span className="text-zinc-500">Ecosystem</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-10 text-sm text-zinc-500 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>

                    <p className="text-sm text-zinc-600 font-light">
                        © 2026 AI Creative Ecosystem. Built for the era of hyper-creativity.
                    </p>
                </div>
            </div>
        </footer>
    );
};
