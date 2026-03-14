"use client";

import React from "react";
import { motion } from "framer-motion";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { AlertTriangle, Activity, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const frictions = [
    {
        id: "fragmentation",
        title: "Fragmentación",
        subtitle: "Caos Operativo",
        icon: <Activity className="text-orange-500" size={32} />,
        symptoms: [
            "Datos aislados en silos (Marketing vs Ventas)",
            "Múltiples suscripciones SaaS redundantes",
            "Pérdida de contexto en handoffs manuales"
        ],
        diagnosis: "Tu ADN digital está roto. Necesitas unificar flujos."
    },
    {
        id: "saturation",
        title: "Saturación",
        subtitle: "Techo de Escala",
        icon: <AlertTriangle className="text-red-500" size={32} />,
        symptoms: [
            "El equipo crece linealmente, el coste también",
            "Calidad inconsistente al escalar contenido",
            "Burnout creativo por tareas repetitivas"
        ],
        diagnosis: "Tu proceso es manual. Necesitas automatización inteligente."
    },
    {
        id: "dependence",
        title: "Dependencia",
        subtitle: "Riesgo de Soberanía",
        icon: <Lock className="text-yellow-500" size={32} />,
        symptoms: [
            "Tu 'know-how' vive en plataformas de terceros",
            "Sin control sobre los modelos de IA usados",
            "Fuga de datos sensibles a LLMs públicos"
        ],
        diagnosis: "No eres dueño de tu inteligencia. Necesitas sistemas propietarios."
    }
];

export const Diagnosis = () => {
    return (
        <section className="py-24 bg-[#02040a] relative border-t border-white/5" id="diagnosis">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-4"
                    >
                        Diagnóstico de Sistemas
                    </motion.p>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                        Identifica tu <NeonEmphasis>Fricción</NeonEmphasis> Actual
                    </h2>
                    <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
                        Antes de prescribir una solución, entendemos dónde duele. ¿Cuál de estos escenarios describe tu realidad?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {frictions.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col"
                        >
                            <div className="mb-6 bg-black/40 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                {item.icon}
                            </div>

                            <h3 className="text-2xl font-display text-white mb-1">{item.title}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">{item.subtitle}</p>

                            <div className="space-y-4 mb-8 flex-grow">
                                {item.symptoms.map((symptom, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                        <span className="text-sm text-zinc-400 leading-relaxed">{symptom}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                <p className="text-xs text-primary/80 font-mono leading-relaxed">
                                    <span className="font-bold text-primary">Diagnóstico:</span> {item.diagnosis}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/diagnostico" className="inline-block btn-premium group text-lg px-12 py-4 shadow-[0_0_30px_rgba(204,255,0,0.2)] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]">
                        <span className="flex items-center gap-3">
                            Solicitar Diagnóstico Gratuito <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                    <p className="mt-4 text-xs text-zinc-600 uppercase tracking-widest">
                        Sesión de 30 min • Sin Compromiso • Análisis de Madurez Digital
                    </p>
                </div>
            </div>
        </section>
    );
};
