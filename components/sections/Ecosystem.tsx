"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function Ecosystem() {
    return (
        <section id="ecosistema" className="py-24 bg-black relative overflow-hidden">
            {/* Radial gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <div className="container px-4 md:px-6 relative z-10 text-center">
                <div className="max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Visión de Ecosistema
                    </h2>
                    <p className="text-xl text-muted-foreground font-light">
                        Cuando la creatividad se conecta con sistemas inteligentes, el trabajo deja de ser reactivo y se vuelve estratégico.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative w-full max-w-5xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                >
                    <Image
                        src="/ecosystem.png"
                        alt="AI Ecosystem Visualization"
                        fill
                        className="object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
            </div>
        </section>
    )
}
