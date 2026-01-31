"use client";

import React, { useState } from "react";
import { CheckCircle2, Sparkles, Zap, Target, TrendingUp, Globe, Box, ShieldCheck } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const benefits = [
    {
        title: "Enfoque Estratégico",
        description: "Eliminamos la ejecución repetitiva para que tu equipo lidere la visión.",
        icon: <Target className="text-primary" size={24} />,
        color: "bg-primary/10"
    },
    {
        title: "Velocidad Creativa",
        description: "Multiplicamos la producción por 10 sin perder profundidad ni calidad.",
        icon: <Zap className="text-secondary" size={24} />,
        color: "bg-secondary/10"
    },
    {
        title: "Consistencia de ADN",
        description: "Sistemas que garantizan la identidad de tu marca en cada activo generado.",
        icon: <ShieldCheck className="text-blue-500" size={24} />,
        color: "bg-blue-500/10"
    },
    {
        title: "Fricción Cero",
        description: "Reducción drástica de cuellos de botella mediante flujos inteligentes.",
        icon: <Box className="text-orange-500" size={24} />,
        color: "bg-orange-500/10"
    },
    {
        title: "Escala Global",
        description: "Expansión sin fronteras y sin necesidad de aumentar el headcount masivamente.",
        icon: <Globe className="text-green-500" size={24} />,
        color: "bg-green-500/10"
    },
    {
        title: "Optimización Real",
        description: "Evolución constante basada en el rendimiento y data de negocio.",
        icon: <TrendingUp className="text-purple-500" size={24} />,
        color: "bg-purple-500/10"
    }
];

const BenefitCard = ({ benefit, index }: { benefit: any; index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="premium-card p-8 group relative"
        >
            <div
                style={{ transform: "translateZ(50px)" }}
                className="relative z-10"
            >
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
                    {benefit.icon}
                </div>
                <h3 className="text-2xl font-display font-medium mb-3 text-white">{benefit.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed">{benefit.description}</p>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};

export const Benefits = () => {
    return (
        <section className="py-32 bg-[#050505] overflow-hidden" id="beneficios">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-8"
                    >
                        <Sparkles size={14} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Capacidades Exponenciales
                        </span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-display font-medium mb-8 leading-[1.1]">
                        Beneficios del <br />
                        <span className="text-gradient-primary italic">Ecosistema Creativo</span>
                    </h2>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed">
                        Construimos arquitecturas que transforman profundamente la capacidad operativa y la ambición de tu organización.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <BenefitCard key={index} benefit={benefit} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};
