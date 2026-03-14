"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Database, Workflow, Brain, ArrowRight, Layers, Sparkles } from "lucide-react";

import { TypewriterPulse } from "@/components/ui/TypewriterPulse";

const cards = [
    {
        id: "nexus",
        title: "Nexus OS",
        subtitle: "(Soberanía Operativa)",
        desc: "Tu propio centro de control. Unificamos tus silos de datos en una infraestructura soberana que elimina la dependencia comercial y centraliza la inteligencia de tu marca.",
        icon: <Database className="text-primary" size={24} />,
        animation: "Optimización Propia"
    },
    {
        id: "vivid",
        title: "Vivid Stream",
        subtitle: "(Sistemas de Contenido)",
        desc: "Escala tu identidad sin perder el alma. Diseñamos motores de generación de contenido entrenados con tu ADN visual para una presencia infinita y coherente.",
        icon: <Layers className="text-primary" size={24} />,
        animation: "Expansión Genética"
    },
    {
        id: "synergy",
        title: "Synergy AI",
        subtitle: "(Cultura de Inteligencia)",
        desc: "Sincronía total entre equipo e IA. No es automatización, es simbiosis: flujos donde la IA potencia el criterio humano para decisiones de alto impacto.",
        icon: <Brain className="text-primary" size={24} />,
        animation: "Cerebro Colectivo"
    }
];

const ImpactCard = ({ card, index }: { card: any; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="premium-card p-10 flex flex-col h-full group cursor-pointer border-primary/5 hover:border-primary/20"
        >
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(204,255,0,0.1)] group-hover:shadow-[0_0_30px_rgba(204,255,0,0.2)] transition-all">
                    {card.icon}
                </div>
                <Sparkles className="text-primary/20 group-hover:text-primary transition-colors" size={20} />
            </div>

            <h3 className="text-3xl font-display font-medium text-white mb-2 relative z-10 group-hover:text-primary transition-colors">
                {card.title}
            </h3>
            <div className="mb-6 relative z-10">
                <TypewriterPulse
                    text={card.subtitle}
                    delay={index * 0.3 + 0.5}
                    className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
                />
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed mb-8 flex-grow relative z-10 font-light">
                {card.desc}
            </p>

            <div className="mt-auto relative z-10">
                <div className="h-24 w-full bg-black/40 rounded-xl border border-white/5 mb-8 relative overflow-hidden flex items-center justify-center shadow-inner group-hover:border-primary/20 transition-colors">
                    {/* Minimalist Flow Animation Placeholder */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        </div>
                        <span className="text-[10px] font-mono text-neon-muted uppercase tracking-[0.4em] font-bold">{card.animation}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-white/80 font-medium group/btn text-sm uppercase tracking-widest group-hover:text-white transition-colors">
                    <span>Definir Arquitectura</span>
                    <ArrowRight size={16} className="text-primary transition-transform group-hover/btn:translate-x-2" />
                </div>
            </div>
        </motion.div>
    );
};

export const ImpactSystems = () => {
    return (
        <section className="py-32 relative bg-[#02040a]" id="impact-systems">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-24">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-5xl md:text-7xl font-display font-medium text-white mb-8"
                    >
                        Sistemas de <br />
                        <span className="text-shimmer italic">Impacto Exponencial</span>
                    </motion.h2>
                    <p className="text-xl text-zinc-500 max-w-2xl">
                        No implementamos soluciones aisladas. Construimos la arquitectura
                        que permite a tu marca evolucionar hacia la soberanía operativa y creativa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, i) => (
                        <ImpactCard key={card.id} card={card} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};
