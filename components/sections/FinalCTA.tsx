"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";

export const FinalCTA = () => {
    return (
        <section className="py-60 bg-[#02040a] text-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-6xl md:text-9xl font-display font-medium mb-12 leading-[0.85] tracking-tighter"
                    >
                        El futuro es <br />
                        <NeonEmphasis>Sistémico</NeonEmphasis>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-3xl text-zinc-400 mb-16 max-w-2xl mx-auto font-light leading-snug"
                    >
                        No implementamos herramientas. <br />
                        <span className="text-white font-medium italic">Construimos el futuro de tu marca.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8"
                    >
                        <Link href="/diagnostico" className="inline-block btn-premium group text-xl px-12 py-6">
                            <span className="flex items-center gap-3">
                                Iniciar Transformación <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
