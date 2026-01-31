"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Target } from "lucide-react";

const capabilities = [
    {
        title: "Ideación Estratégica",
        description: "Algoritmos que analizan tendencias y generan conceptos creativos de alto impacto.",
        icon: <Sparkles size={24} className="text-primary" />,
    },
    {
        title: "Ejecución Multicanal",
        description: "Transformamos una idea en cientos de variantes optimizadas para cada plataforma.",
        icon: <Zap size={24} className="text-secondary" />,
    },
    {
        title: "Consistencia de Marca",
        description: "IA entrenada con tu ADN visual para garantizar coherencia en cada pixel.",
        icon: <Target size={24} className="text-primary" />,
    }
];

export const CreativeAlly = () => {
    return (
        <section className="py-32 bg-[#080808]" id="soluciones">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-display font-medium mb-8 leading-[1.1]">
                            IA como tu <br />
                            <span className="text-gradient-primary italic">co-piloto creativo</span>
                        </h2>
                        <p className="text-xl text-zinc-400 font-light leading-relaxed mb-10 max-w-lg">
                            No reemplazamos la visión humana; la expandimos. Nuestra tecnología elimina la fricción operativa para que tu equipo se concentre en lo que importa: la estrategia.
                        </p>

                        <div className="space-y-6">
                            {capabilities.map((cap, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="mt-1 w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        {cap.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-medium mb-1">{cap.title}</h4>
                                        <p className="text-zinc-500 font-light">{cap.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse-slow" />
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                            <img
                                src="/creative_ally_visualization_1769822792454.png"
                                alt="Creative Collaboration"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
