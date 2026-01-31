"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
    return (
        <section className="py-40 bg-black text-white relative overflow-hidden">
            <div className="glow-mesh opacity-30" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-8xl font-display font-medium mb-12 leading-[1]"
                    >
                        Súbete a la ola <br />
                        de la <span className="text-gradient-primary">IA</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-2xl mx-auto font-light"
                    >
                        ¿Listos para escalar vuestro ecosistema creativo? Diseñemos el mañana de tu organización hoy mismo.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8"
                    >
                        <button className="btn-premium group text-xl px-12 py-6">
                            <span className="flex items-center gap-3">
                                Agendar una cita <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
