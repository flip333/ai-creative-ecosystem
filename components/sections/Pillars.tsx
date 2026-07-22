"use client";

import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, TrendingDown, ShieldCheck, HeartHandshake } from "lucide-react";

import { NeonEmphasis } from "@/components/ui/NeonEmphasis";

const pillars = [
    {
        id: "diagnostico",
        icon: Stethoscope,
        kicker: "Punto de partida",
        title: "El diagnóstico es tuyo, no una plantilla",
        body: "Antes de proponer nada, nos metemos en tu operación: qué herramientas pagas, qué hace cada persona a mano, dónde se cae el proceso. De ahí sale una arquitectura específica para tu empresa.",
        proof: "Sesión 1:1 de 30 min · Diagnóstico escrito",
    },
    {
        id: "costos",
        icon: TrendingDown,
        kicker: "Optimización",
        title: "Bajamos el costo, no solo el esfuerzo",
        body: "Auditamos lo que ya pagas: suscripciones duplicadas, planes sobredimensionados, tokens quemados en llamadas mal diseñadas. Elegimos el modelo más barato que cumpla el trabajo, no el más grande.",
        proof: "Desglose de costos visible en tu portal",
    },
    {
        id: "seguridad",
        icon: ShieldCheck,
        kicker: "Arquitectura",
        title: "Sistemas seguros que aguantan crecer",
        body: "Tus datos no se van a un LLM público por defecto. Accesos segmentados, credenciales aisladas y flujos que soportan diez veces tu volumen actual sin rediseñarse desde cero.",
        proof: "Datos aislados · Escala sin rehacer",
    },
    {
        id: "acompanamiento",
        icon: HeartHandshake,
        kicker: "Relación",
        title: "Un consultor que conoce tu negocio",
        body: "No abres un ticket para que lo tome quien esté libre. Te responde la persona que construyó tu sistema, con objetivos acordados y revisiones donde miramos si se cumplieron o no.",
        proof: "Consultor asignado · Metas medibles",
    },
];

export const Pillars = () => {
    return (
        <section
            className="py-32 bg-[#02040a] relative overflow-hidden border-t border-white/5"
            id="pilares"
        >
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mb-20">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-6"
                    >
                        Por qué Genflow
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-display font-medium text-white leading-tight mb-8"
                    >
                        Cuatro compromisos, <br />
                        <NeonEmphasis>verificables</NeonEmphasis>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-400 font-light leading-relaxed"
                    >
                        Cualquiera promete resultados. Estos cuatro los puedes comprobar desde tu portal el
                        primer mes.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pillars.map((pillar, i) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={pillar.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                viewport={{ once: true, margin: "-80px" }}
                                className="group relative rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500 p-10 flex flex-col overflow-hidden"
                            >
                                {/* Glow que aparece al pasar el cursor */}
                                <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary/10 rounded-full blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="relative z-10 flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                                        <Icon size={20} className="text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                        {pillar.kicker}
                                    </span>
                                </div>

                                <h3 className="relative z-10 text-2xl md:text-3xl font-display font-medium text-white mb-5 leading-snug">
                                    {pillar.title}
                                </h3>

                                <p className="relative z-10 text-lg text-zinc-400 font-light leading-relaxed mb-8 flex-grow">
                                    {pillar.body}
                                </p>

                                <div className="relative z-10 pt-6 border-t border-white/5">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-primary/70">
                                        {pillar.proof}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
