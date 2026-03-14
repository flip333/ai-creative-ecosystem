"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Activity, Grid } from "lucide-react";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";

export const ProblemSolution = () => {
    return (
        <section className="py-24 bg-[#02040a] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 backdrop-blur-md mb-8"
                        >
                            <Activity size={14} className="text-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/80">
                                Diagnóstico Crítico
                            </span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-display font-medium text-white leading-tight mb-8">
                            Tienes las herramientas, <br />
                            <span className="text-zinc-600">pero no el ecosistema.</span>
                        </h2>

                        <div className="space-y-6">
                            <p className="text-xl text-zinc-400 font-light leading-relaxed">
                                ¿Sientes que tu equipo usa IA de forma aislada? ¿Que cada nueva herramienta añade más caos que claridad?
                            </p>
                            <p className="text-xl text-zinc-400 font-light leading-relaxed">
                                El problema no es la tecnología, es la <strong>fragmentación</strong>. Tu "ADN Digital" está roto en silos que no se comunican.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Visual Representation of Fragmentation vs Unity */}
                        <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl opacity-20" />
                        <div className="relative bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                            <div className="flex flex-col gap-8">
                                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                    <span className="text-zinc-500 uppercase tracking-widest text-xs">Estado Actual</span>
                                    <span className="text-red-400 text-xs font-mono bg-red-500/10 px-2 py-1 rounded">FRAGMENTADO</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 opacity-50">
                                        <Grid size={20} className="text-zinc-600" />
                                        <span className="text-[10px] text-zinc-600 uppercase">Silo Marketing</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 opacity-50">
                                        <Grid size={20} className="text-zinc-600" />
                                        <span className="text-[10px] text-zinc-600 uppercase">Silo Ventas</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center py-4">
                                    <Zap className="text-primary animate-bounce" size={24} />
                                </div>

                                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                    <span className="text-zinc-500 uppercase tracking-widest text-xs">Con Genflow</span>
                                    <span className="text-primary text-xs font-mono bg-primary/10 px-2 py-1 rounded">
                                        <NeonEmphasis className="not-italic text-[10px]">SECUENCIADO</NeonEmphasis>
                                    </span>
                                </div>
                                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex items-center justify-center gap-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10 blur-xl animate-pulse" />
                                    <span className="relative z-10 text-white font-display text-lg">
                                        <NeonEmphasis className="not-italic">Ecosistema Unificado</NeonEmphasis>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
