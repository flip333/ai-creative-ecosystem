"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, BrainCircuit, Layers, Target, Compass, Sparkles } from "lucide-react";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { Diagnosis } from "@/components/sections/Diagnosis";

const steps = [
    {
        icon: <Search className="text-primary" size={32} />,
        title: "Diagnóstico",
        subtitle: "30 minutos, 1:1, gratis",
        description: "Nos sentamos con quien opera el día a día, no solo con la gerencia. Mapeamos qué herramientas pagas, qué se hace a mano y dónde se cae el proceso. Sales de esa sesión con un diagnóstico escrito, contrates o no.",
    },
    {
        icon: <BrainCircuit className="text-primary" size={32} />,
        title: "Auditoría de costos",
        subtitle: "Antes de sumar, restamos",
        description: "Revisamos tu gasto actual en herramientas e IA: suscripciones duplicadas, planes que nadie usa, llamadas mal diseñadas que queman tokens. Muchas veces el primer ahorro paga buena parte del proyecto.",
    },
    {
        icon: <Layers className="text-primary" size={32} />,
        title: "Arquitectura a medida",
        subtitle: "Segura y preparada para crecer",
        description: "Diseñamos el sistema para tu caso, no adaptamos una plantilla. Accesos segmentados, credenciales aisladas, datos sensibles fuera de modelos públicos y una estructura que aguanta diez veces tu volumen actual.",
    },
    {
        icon: <Target className="text-primary" size={32} />,
        title: "Operación y acompañamiento",
        subtitle: "Con tu portal desde el día uno",
        description: "Desplegamos, entrenamos a tu equipo y te damos acceso al portal donde ves cada flujo, su estado, sus resultados y su costo. De ahí en adelante: revisiones periódicas contra objetivos acordados, con tu consultor asignado.",
    }
];

export default function MetodologiaPage() {
    return (
        <main className="bg-[#02040a] min-h-screen text-white pt-32 pb-16">
            <div className="container mx-auto px-6 mb-24">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-4"
                    >
                        Cómo trabajamos
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-medium text-white mb-6 leading-tight"
                    >
                        Cuatro pasos, <br />
                        <NeonEmphasis>sin sorpresas</NeonEmphasis>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-400 font-light leading-relaxed"
                    >
                        No vendemos licencias ni entregamos un SaaS genérico. Diseñamos, construimos y
                        operamos el sistema contigo, <span className="text-white font-medium">1:1</span>,
                        desde el diagnóstico hasta las revisiones mensuales. Cada paso deja algo
                        tangible en tus manos: un documento, un ahorro, un flujo corriendo o una
                        métrica que antes no existía.
                    </motion.p>
                </div>

                {/* Grid de Metodología */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
                    {/* Línea conectora central para desktop */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />
                    
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-8 rounded-3xl bg-zinc-900/20 border border-white/5 hover:border-primary/20 hover:bg-zinc-900/40 transition-all duration-300 group ${index % 2 === 0 ? "md:mr-8 md:text-right" : "md:ml-8 md:mt-24"}`}
                        >
                            {/* Dot conector para desktop */}
                            <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#02040a] border border-primary z-10 ${index % 2 === 0 ? "-right-[41px]" : "-left-[41px]"}`}>
                                <div className="absolute inset-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                            </div>

                            <div className={`mb-6 p-4 bg-black/50 rounded-2xl border border-white/5 shadow-inner w-inline-block inline-flex ${index % 2 === 0 ? "md:ml-auto" : ""}`}>
                                {step.icon}
                            </div>
                            
                            <p className="text-primary font-mono text-xs font-bold uppercase tracking-widest mb-3">
                                0{index + 1} — {step.subtitle}
                            </p>
                            <h3 className="text-3xl font-display text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed font-light">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subsección de Manifiesto */}
            <div className="py-24 bg-[#15171e]/30 border-y border-white/5 mb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
                                Un enfoque en la <br /><NeonEmphasis>Investigación Continua</NeonEmphasis>
                            </h2>
                            <p className="text-zinc-400 font-light text-lg mb-6 leading-relaxed">
                                Creemos que cada idea de negocio es un organismo vivo. Nuestra tecnología actúa como un <strong>nodo que potencia tus ecosistemas</strong> a largo plazo.
                            </p>
                            <ul className="space-y-4">
                                {["Proceso consultivo personalizado", "Soluciones que evolucionan contigo", "Independencia tecnológica", "Insights apalancados en Data"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <Sparkles size={16} className="text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/3 w-full flex justify-center">
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Decoración concéntrica visual */}
                                <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                <div className="absolute inset-4 border border-dashed border-primary/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                <div className="absolute inset-12 bg-black/50 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Compass size={40} className="text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diagnóstico */}
            <div id="diagnostico">
                <Diagnosis />
            </div>
        </main>
    );
}
