"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Database, Cpu, Users, ArrowRight } from "lucide-react";

export const SystemFlow = () => {
    return (
        <section className="py-32 bg-[#050505] overflow-hidden" id="metodologia">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-5xl md:text-7xl font-display font-medium mb-8">
                        Nuestro <span className="text-gradient-primary italic">Flujo Sistémico</span>
                    </h2>
                    <p className="text-xl text-zinc-400 font-light">
                        Diseñamos infraestructuras donde la creatividad y la data coexisten en armonía.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        <FlowStep
                            icon={<Lightbulb size={30} />}
                            title="ADN & Data"
                            desc="Capturamos la esencia de marca y objetivos estratégicos."
                            delay={0}
                        />
                        <FlowStep
                            icon={<Cpu size={30} />}
                            title="Motor IA"
                            desc="Entrenamos modelos personalizados con tu identidad."
                            delay={0.1}
                        />
                        <FlowStep
                            icon={<Database size={30} />}
                            title="Optimización"
                            desc="Generación de activos y optimización técnica continua."
                            delay={0.2}
                        />
                        <FlowStep
                            icon={<Users size={30} />}
                            title="Impacto Humano"
                            desc="Resultados tangibles potenciados por humanos."
                            delay={0.3}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const FlowStep = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="premium-card p-10 flex flex-col items-center text-center group"
    >
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <h4 className="text-2xl font-display font-medium mb-4">{title}</h4>
        <p className="text-zinc-500 font-light leading-relaxed">{desc}</p>
    </motion.div>
);
