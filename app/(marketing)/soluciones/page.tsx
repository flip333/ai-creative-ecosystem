"use client";

import React from "react";
import { useCasesData } from "@/lib/data/useCases";
import { UseCases } from "@/components/sections/UseCases";
import { Diagnosis } from "@/components/sections/Diagnosis";
import { ScrollAnimatedCopy } from "@/components/sections/ScrollAnimatedCopy";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { motion } from "framer-motion";

const groups = [
    {
        title: <>Soluciones de <NeonEmphasis>Ventas y Crecimiento</NeonEmphasis></>,
        subtitle: "Growth & Sales",
        description: "Automatizaciones diseñadas para captar, calificar y cerrar prospectos sin intervención humana.",
        tags: ["ventas", "growth", "conversion"],
    },
    {
        title: <>Cerebro de <NeonEmphasis>Marketing</NeonEmphasis></>,
        subtitle: "Creative & Marketing",
        description: "Motores generativos que entienden tu marca y producen contenido a escala.",
        tags: ["marketing", "creatividad", "estrategia"],
    },
    {
        title: <>Sistemas <NeonEmphasis>Operativos</NeonEmphasis></>,
        subtitle: "Ops & Analytics",
        description: "Elimina silos y unifica el flujo de datos para decisiones instantáneas.",
        tags: ["operaciones", "analitica", "soporte"],
    }
];

export default function SolucionesPage() {
    return (
        <main className="bg-[#02040a] min-h-screen text-white pt-32 pb-16">
            {/* Hero Section para la página de Soluciones */}
            <div className="container mx-auto px-6 mb-24 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-4"
                >
                    Librería Interactiva
                </motion.p>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-display font-medium text-white mb-6"
                >
                    Ecosistemas de <br />
                    <NeonEmphasis>Automatización</NeonEmphasis>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-zinc-400 font-light max-w-2xl mx-auto"
                >
                    Explora nuestras plantillas inteligentes según la fricción de tu negocio. 
                    Personalizamos cada flujo para adaptarlo al ADN de tu empresa.
                </motion.p>
            </div>

            {/* Renderizar cada grupo con el componente UseCases en modo Carrusel */}
            {groups.map((group, index) => {
                const groupItems = useCasesData.filter(uc => group.tags.includes(uc.category));
                
                if (groupItems.length === 0) return null;

                return (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-12 border-b border-white/5 pb-12 last:border-0 overflow-hidden"
                    >
                        <UseCases 
                            title={group.title}
                            subtitle={group.subtitle}
                            description={group.description}
                            items={groupItems}
                            showBackground={false}
                            variant="carousel"
                            ctaText="Saber más sobre estos flujos"
                            ctaLink="#diagnosis"
                        />
                    </motion.div>
                );
            })}

            {/* Animations on scroll CTA */}
            <div className="mt-24">
                <ScrollAnimatedCopy />
            </div>

            {/* El CTA Final (Diagnóstico) */}
            <div id="diagnosis" className="mt-12">
                <Diagnosis />
            </div>
        </main>
    );
}
