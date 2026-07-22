"use client";

import React from "react";
import { motion } from "framer-motion";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { AlertTriangle, Activity, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const frictions = [
    {
        id: "opacidad",
        title: "Opacidad",
        subtitle: "Operas a ciegas",
        icon: <Activity className="text-orange-500" size={32} />,
        symptoms: [
            "Nadie te sabe decir qué flujos están activos hoy",
            "Los resultados llegan en un reporte mensual, si llegan",
            "Te enteras de que algo falló por el cliente, no por el sistema"
        ],
        diagnosis: "Tu operación no es medible. Necesitas trazabilidad."
    },
    {
        id: "sobrecosto",
        title: "Sobrecosto",
        subtitle: "Pagas más de lo que usas",
        icon: <AlertTriangle className="text-red-500" size={32} />,
        symptoms: [
            "Suscripciones que nadie recuerda haber contratado",
            "La factura de IA sube y no hay quien explique por qué",
            "Cada nuevo volumen exige contratar otra persona"
        ],
        diagnosis: "Estás pagando de más. Necesitas auditar y rediseñar."
    },
    {
        id: "dependencia",
        title: "Dependencia",
        subtitle: "El sistema no es tuyo",
        icon: <Lock className="text-yellow-500" size={32} />,
        symptoms: [
            "El know-how vive en la cabeza de un proveedor",
            "No hay documentación de cómo está construido",
            "Datos sensibles viajando a modelos públicos"
        ],
        diagnosis: "No eres dueño de tu inteligencia. Necesitas sistemas propios y documentados."
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
                        Empieza por aquí
                    </motion.p>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                        ¿En cuál te <NeonEmphasis>reconoces</NeonEmphasis>?
                    </h2>
                    <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
                        No recetamos antes de examinar. Estos son los tres cuadros que más vemos —
                        identificar el tuyo es el primer paso del diagnóstico.
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
                            Quiero mi diagnóstico gratuito <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                    <p className="mt-4 text-xs text-zinc-600 uppercase tracking-widest">
                        30 min 1:1 • Sin compromiso • Sales con un plan escrito
                    </p>
                </div>
            </div>
        </section>
    );
};
