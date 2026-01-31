"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Activity, Layers, Target } from "lucide-react";

const challenges = [
    {
        title: "Saturación",
        description: "Equipos agotados por la demanda constante sin espacio para la estrategia real.",
        icon: <Zap size={24} className="text-primary" />,
        size: "large"
    },
    {
        title: "Fricción",
        description: "Procesos fragmentados que matan la escalabilidad.",
        icon: <Layers size={21} className="text-secondary" />,
        size: "small"
    },
    {
        title: "Ruido",
        description: "Datos sin contexto que nublan la toma de decisiones.",
        icon: <Activity size={21} className="text-primary" />,
        size: "small"
    },
    {
        title: "El Techo Creativo",
        description: "La ejecución devora la innovación. Los líderes apagan incendios en lugar de diseñar el futuro.",
        icon: <Target size={24} className="text-secondary" />,
        size: "medium"
    }
];

export const Challenge = () => {
    return (
        <section className="py-32 relative bg-black overflow-hidden" id="el-reto">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-display font-medium mb-8">
                            El reto no es hacer más,<br />
                            sino <span className="text-zinc-500 italic">operar mejor</span>.
                        </h2>
                    </div>
                    <div className="max-w-sm text-zinc-500 text-lg leading-relaxed font-light">
                        Las estructuras tradicionales están colapsando. Ayudamos a equipos a romper el ciclo de ejecución reactiva.
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {challenges.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`premium-card p-10 group overflow-hidden relative ${item.size === "large" ? "md:col-span-2" : "md:col-span-1"
                                } ${item.size === "medium" ? "md:col-span-2" : ""}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-primary/10" />

                            <div className="mb-8 w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            <h3 className="text-3xl font-display font-medium mb-4">{item.title}</h3>
                            <p className="text-zinc-500 text-lg leading-relaxed font-light">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
