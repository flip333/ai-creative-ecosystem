"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
    { label: "Ideas & Datos", desc: "Input creativo" },
    { label: "Procesamiento IA", desc: "Generación y patrones" },
    { label: "Decisión Humana", desc: "Curaduría y estrategia" },
    { label: "Escalamiento", desc: "Producción final" }
]

export function HowItWorks() {
    return (
        <section id="como-funciona" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/5 -skew-y-3 transform origin-top-left -z-10" />

            <div className="container px-4 md:px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Cómo Funciona</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Un enfoque sistémico donde la creatividad humana dirige y la tecnología amplifica.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[40px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <div className="grid md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-background border border-primary/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] z-10 relative">
                                    <div className="text-2xl font-bold text-primary">{idx + 1}</div>
                                    {idx < steps.length - 1 && (
                                        <div className="md:hidden absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-muted-foreground">
                                            <ArrowRight className="rotate-90" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold">{step.label}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
