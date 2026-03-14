"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const plans = [
    {
        id: "audit",
        name: "Secuenciación (Audit)",
        price: "$2,500",
        period: "One-time",
        desc: "Diagnóstico completo de tu ADN digital y mapa de ruta para la implementación.",
        features: [
            "Mapeo de Herramientas Actuales",
            "Identificación de Silos",
            "Blueprint de Arquitectura Soberana",
            "Roadmap de Implementación (3 meses)"
        ],
        cta: "Iniciar Diagnóstico",
        highlight: false
    },
    {
        id: "genesis",
        name: "Genflow Core",
        price: "$650 USD",
        period: "/ mes + Tokens",
        desc: "Implementación y gestión de los 3 Genes de Crecimiento. Costo variable según consumo de API.",
        features: [
            "Implementación de Origin OS",
            "Content Factory (Vivid Synthesis)",
            "Soporte Synergy AI",
            "Mantenimiento de Flujos n8n",
            "Reporting Mensual"
        ],
        cta: "Activar Genflow",
        highlight: true
    },
    {
        id: "evolve",
        name: "Evolution Scale",
        price: "Custom",
        period: "",
        desc: "Para corporaciones que requieren arquitecturas de datos complejas e integración custom.",
        features: [
            "Todo lo de Genflow Core",
            "Servidores Propios (Self-Hosted)",
            "Modelos LLM Fine-Tuned Privados",
            "SLA Garantizado",
            "Onboarding Presencial"
        ],
        cta: "Contactar Ventas",
        highlight: false
    }
];

export const Pricing = () => {
    return (
        <section className="py-32 bg-[#02040a] relative border-t border-white/5" id="pricing">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                        Inversión en <span className="text-shimmer italic">Evolución</span>
                    </h2>
                    <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
                        Un plan para cada etapa de tu Genflow. Sin contratos infinitos, solo resultados secuenciados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.id}
                            className={`relative p-8 rounded-[2.5rem] border ${plan.highlight ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-white/[0.02]'} flex flex-col group hover:border-primary/30 transition-all duration-500`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-[#02040a] text-xs font-bold uppercase tracking-widest rounded-full">
                                    Recomendado
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-display text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                                    <span className="text-zinc-500 text-sm">{plan.period}</span>
                                </div>
                                <p className="text-zinc-400 text-sm mt-4 leading-relaxed h-[60px]">
                                    {plan.desc}
                                </p>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feat, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-white/10 text-zinc-400'}`}>
                                            <Check size={10} />
                                        </div>
                                        <span className="text-sm text-zinc-300">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-4 rounded-xl font-medium tracking-wide transition-all duration-300 ${plan.highlight ? 'bg-primary text-[#02040a] hover:bg-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
