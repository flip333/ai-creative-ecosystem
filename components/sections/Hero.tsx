"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Activity, Layers, Target } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-40 overflow-hidden">
            <div className="glow-mesh" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/5 backdrop-blur-md mb-8"
                    >
                        <Sparkles size={14} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            El Futuro de la Creatividad Estratégica
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-display font-medium leading-[0.9] mb-10 tracking-tight"
                    >
                        Potencia tus procesos <br />
                        <span className="text-gradient-primary">con inteligencia artificial</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed mt-4"
                    >
                        No implementamos IA. <br />
                        <span className="text-white font-medium">Potenciamos la intuición humana con inteligencia de datos.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <button className="btn-premium group">
                            <span className="flex items-center gap-2">
                                Hablemos de tu Proyecto <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                        <button className="btn-secondary">
                            Ver Casos de Uso
                        </button>
                    </motion.div>
                </div>

                {/* Hero Asset */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="mt-24 relative aspect-video max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 group"
                >
                    <img
                        src="/hero_ai_creative_abstract_1769822779877.png"
                        alt="AI Creative Visualization"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                    {/* Floating Info */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 right-10 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hidden lg:block"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles size={24} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Creatividad Ilimitada</p>
                                <p className="text-xs text-zinc-400">Impulsado por Algoritmos Propios</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
