"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, BrainCircuit, Layers, Target, Compass, Sparkles } from "lucide-react";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { Diagnosis } from "@/components/sections/Diagnosis";

const steps = [
    {
        icon: <Search className="text-primary" size={32} />,
        title: "Diagnóstico y Contexto",
        subtitle: "Auditoría 1:1 Inicial",
        description: "El flujo inicia con un diagnóstico gratuito. Agendamos una llamada 1:1 para entender tu operación y mapear la fricción. De esta sesión, generamos un brief inicial riguroso que dota de contexto profundo al ecosistema.",
    },
    {
        icon: <BrainCircuit className="text-primary" size={32} />,
        title: "Inteligencia Aplicada",
        subtitle: "Inmersión IA",
        description: "Alimentamos nuestro sistema de IA con tu contexto corporativo y tu ADN de marca. Esto nos permite ejecutar análisis algorítmicos complejos para encontrar insights reales y consideraciones de mejora que el ojo humano podría pasar por alto.",
    },
    {
        icon: <Layers className="text-primary" size={32} />,
        title: "Arquitectura Específica",
        subtitle: "No es consumo masivo",
        description: "No te entregamos un SaaS genérico. Filtramos nuestra librería de flujos para encontrar los casos de uso precisos y los adaptamos de manera artesanal a las necesidades únicas de tus ideas de negocio.",
    },
    {
        icon: <Target className="text-primary" size={32} />,
        title: "Puesta en Marcha",
        subtitle: "Consultoría Dirigida",
        description: "Implementamos tu nuevo nodo tecnológico como un apoyo colaborativo. Desplegamos la infraestructura, te entrenamos en su uso e incentivamos la investigación y crecimiento de tus procesos de la mano de consultoría dedicada.",
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
                        Nuestra Filosofía Operativa
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-medium text-white mb-6 leading-tight"
                    >
                        Más que software, un <br />
                        <NeonEmphasis>Nodo de Crecimiento</NeonEmphasis>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-400 font-light leading-relaxed"
                    >
                        No construimos soluciones de IA de consumo masivo. En Genflow <strong>hackeamos la cultura operativa</strong> de tu empresa mediante sistemas sistémicos. Diseñamos flujos de automatización que se alinean al ADN de tu marca, trabajando estrechamente <span className="text-white font-medium italic">1:1 contigo</span> para adaptar <em>flujos (Flow)</em> de <em>generación (Gen)</em> tecnológica al corazón de tu proyecto.
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
