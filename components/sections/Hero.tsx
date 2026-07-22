"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Lock } from "lucide-react";
import Link from "next/link";

import { DNAHelix } from "@/components/ui/DNAHelix";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";

export const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 overflow-hidden bg-[#02040a]">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <DNAHelix />

            <div className="container mx-auto px-6 relative z-10 mt-10">
                <div className="max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-8"
                    >
                        <Zap size={14} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">
                            Acompañamiento 1:1 · Sistemas a medida
                        </span>
                    </motion.div>

                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                            className="text-5xl md:text-[7.5rem] font-display font-medium leading-[0.9] mb-12 tracking-tighter text-white"
                        >
                            Toda tu IA <br />
                            en un solo lugar. <br />
                            <NeonEmphasis>Y TRAZABLE</NeonEmphasis>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="text-lg md:text-2xl text-zinc-400 mb-14 max-w-3xl leading-relaxed font-light"
                    >
                        Diseñamos y operamos tus automatizaciones —{" "}
                        <span className="text-white font-medium">de marketing a operaciones</span> — con un
                        consultor asignado y un portal donde ves qué está corriendo, qué resultados da y
                        cuánto cuesta cada pieza.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                    >
                        <Link
                            href="/diagnostico"
                            className="inline-block btn-premium group text-lg px-10 py-4 shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)]"
                        >
                            <span className="flex items-center gap-3">
                                Solicitar diagnóstico gratuito{" "}
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>

                        <Link href="/login" className="inline-block btn-secondary group text-lg px-8 py-4">
                            <span className="flex items-center gap-3">
                                <Lock size={16} />
                                Ya soy cliente
                            </span>
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-6 text-xs text-zinc-600 uppercase tracking-widest"
                    >
                        30 min · Sin compromiso · Sales con un diagnóstico escrito
                    </motion.p>
                </div>

                {/* Los tres compromisos que sostienen la promesa de arriba */}
                <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                    {[
                        { label: "Costos", val: "Visibles y optimizados" },
                        { label: "Arquitectura", val: "Segura y escalable" },
                        { label: "Acompañamiento", val: "1:1, orientado a metas" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 + i * 0.1 }}
                            viewport={{ once: true }}
                            className="border-l border-primary/20 pl-4 group"
                        >
                            <p className="text-[10px] uppercase tracking-widest text-neon-muted mb-1 font-bold">
                                {stat.label}
                            </p>
                            <p className="text-xl font-display font-medium text-white group-hover:text-primary transition-colors">
                                {stat.val}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
