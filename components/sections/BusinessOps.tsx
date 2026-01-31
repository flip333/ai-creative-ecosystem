"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Settings, Users, Activity } from "lucide-react";

export const BusinessOps = () => {
    return (
        <section className="py-32 bg-black overflow-hidden" id="metodologia">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-secondary/10 blur-[100px] rounded-full" />
                        <div className="premium-card p-4 relative aspect-[4/3] rounded-[2rem] overflow-hidden">
                            <img
                                src="/business_ops_dashboard_1769822805872.png"
                                alt="Business OS Optimization"
                                className="w-full h-full object-cover rounded-[1.5rem]"
                            />
                        </div>

                        {/* Floating Metric */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-10 -left-10 p-8 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl max-w-[240px]"
                        >
                            <Activity className="text-primary mb-4" size={32} />
                            <p className="text-4xl font-display font-medium text-white mb-2">+40%</p>
                            <p className="text-sm font-light text-zinc-400">Incremento en la eficiencia operativa reportada por nuestros socios creativos.</p>
                        </motion.div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <h2 className="text-5xl md:text-7xl font-display font-medium mb-10 leading-[1.1]">
                            El <span className="text-zinc-500 italic">S.O. Creativo</span> <br />
                            de tu negocio
                        </h2>
                        <p className="text-xl text-zinc-400 font-light leading-relaxed mb-12">
                            La IA no es solo una herramienta de diseño; es el motor que optimiza cada punto de contacto entre tu marca y el mundo.
                        </p>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Settings size={22} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium mb-2">Automatización Inteligente</h4>
                                    <p className="text-zinc-500 font-light">Flujos de trabajo que eliminan tareas repetitivas, devolviendo el foco a lo estratégico.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                    <BarChart3 size={22} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium mb-2">Data-Driven Creativity</h4>
                                    <p className="text-zinc-500 font-light">Decisiones basadas en datos para crear contenido que realmente resuena con tu audiencia.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
