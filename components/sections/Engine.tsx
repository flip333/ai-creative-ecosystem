"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Search, PenTool, Zap, TrendingUp } from "lucide-react";

const TypewriterText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    const letters = text.split("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.span ref={ref} className={className}>
            {letters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, textShadow: "0 0 0px rgba(204, 255, 0, 0)" }}
                    animate={isInView ? {
                        opacity: 1,
                        textShadow: ["0 0 0px rgba(204, 255, 0, 0)", "0 0 20px rgba(204, 255, 0, 0.8)", "0 0 0px rgba(204, 255, 0, 0)"]
                    } : {}}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.03,
                        times: [0, 0.5, 1]
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

const steps = [
    {
        id: "mapping",
        number: "01",
        label: "Mapeo Genético",
        desc: "Analizamos el ADN de tu marca para identificar nodos de oportunidad. Definimos la arquitectura de tu System of Intelligence.",
        icon: <Search size={24} />,
    },
    {
        id: "architecture",
        number: "02",
        label: "Arquitectura Simbiótica",
        desc: "Construimos tu capa de inteligencia propia. No instalamos herramientas; edificamos tu soberanía tecnológica y operativa.",
        icon: <PenTool size={24} />,
    },
    {
        id: "ignition",
        number: "03",
        label: "Sincronía Radical",
        desc: "Activamos el motor. El núcleo humano y la IA convergen en un flujo de trabajo optimizado que escala la visión de marca.",
        icon: <Zap size={24} />,
    },
    {
        id: "evolution",
        number: "04",
        label: "Evolución Sistémica",
        desc: "Tu sistema aprende y se adapta. Escalamos la visión de tu marca con procesos que se optimizan orgánicamente en tiempo real.",
        icon: <TrendingUp size={24} />,
    },
];

const StepCard = ({ step, index }: { step: any, index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex flex-col items-center text-center p-8 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-colors duration-700 group overflow-hidden bg-white/[0.01]"
        >
            {/* Cursor Spotlight Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(204, 255, 0, 0.08) 0%, transparent 60%)`
                }}
            />

            {/* Number / Node */}
            <div className="relative mb-12">
                <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center relative z-10 transition-all duration-700 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(204, 255, 0, 0.2)]">
                    <span className="text-4xl font-display font-bold text-white tracking-tighter group-hover:text-primary transition-colors">
                        {step.number}
                    </span>

                    {/* Constant subtle pulsing light */}
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl animate-pulse" />
                </div>

                {/* Icon Floating Below Number */}
                <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-zinc-900 group-hover:bg-primary border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-black z-20 transition-all duration-500 shadow-xl">
                    {step.icon}
                </div>
            </div>

            <h4 className="text-3xl font-display font-medium text-white mb-4 tracking-tight group-hover:text-primary transition-colors">
                <TypewriterText text={step.label} delay={index * 0.3 + 0.5} />
            </h4>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-[300px] font-light group-hover:text-zinc-400 transition-colors">
                {step.desc}
            </p>
        </motion.div>
    );
};

export const Engine = () => {
    return (
        <section className="py-60 relative overflow-hidden bg-[#02040a]" id="process">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-40">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.8em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="text-primary uppercase text-xs font-bold mb-6"
                    >
                        Metodología de Implementación
                    </motion.p>
                    <h2 className="text-6xl md:text-[9.5rem] font-display font-medium text-white leading-[0.85] tracking-tighter mb-4">
                        <TypewriterText text="Ciclo de" className="block" delay={0.2} />
                        <TypewriterText text="Evolución" className="text-shimmer italic" delay={0.6} />
                    </h2>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Static Line Background */}
                    <div className="absolute top-[48px] left-0 w-full h-[1px] bg-white/5 hidden lg:block" />

                    {/* Decorative revealing line */}
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="absolute top-[48px] left-0 h-[1px] bg-primary hidden lg:block shadow-[0_0_20px_var(--primary-glow)]"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-4">
                        {steps.map((step, i) => (
                            <StepCard key={step.id} step={step} index={i} />
                        ))}
                    </div>
                </div>

                {/* Final Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-48 p-20 rounded-[4rem] bg-white/[0.03] border-t border-white/5 backdrop-blur-3xl text-center max-w-5xl mx-auto relative group overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-primary/5 pointer-events-none" />
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-primary/50" />
                    <h3 className="text-4xl md:text-5xl font-display text-white mb-8 italic">Soberanía Técnica</h3>
                    <p className="text-zinc-400 text-2xl leading-relaxed font-light">
                        Diseñamos procesos que no solo resuelven el hoy, sino que se preparan orgánicamente para los desafíos del mañana, convirtiendo la inteligencia en el mayor activo de tu marca.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
