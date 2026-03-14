"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Database,
    Globe,
    FileText,
    Sheet,
    Bot,
    Search,
    Brain
} from "lucide-react";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";

// Mapping icons for visualization in the "n8n style" card header
const IconMap = {
    chat: <MessageSquare size={16} />,
    db: <Database size={16} />,
    web: <Globe size={16} />,
    doc: <FileText size={16} />,
    sheet: <Sheet size={16} />,
    bot: <Bot size={16} />,
    search: <Search size={16} />,
    brain: <Brain size={16} />
};

import { useCasesData } from "@/lib/data/useCases";

interface UseCasesProps {
    title?: React.ReactNode;
    subtitle?: string;
    description?: string;
    items?: typeof useCasesData;
    ctaText?: string;
    ctaLink?: string;
    showBackground?: boolean;
    variant?: "grid" | "carousel";
}

export const UseCases = ({
    title = (
        <>
            Donde hay voluntad, <br />
            hay un <NeonEmphasis>Workflow Inteligente</NeonEmphasis>
        </>
    ),
    subtitle = "Librería de Flujos",
    description = "Comienza con una base probada. Adaptamos estas plantillas de agentes autónomos a tu caso de uso específico.",
    items = useCasesData,
    ctaText = "Explorar todas las plantillas",
    ctaLink = "/soluciones",
    showBackground = true,
    variant = "grid"
}: UseCasesProps) => {

    const renderCard = (useCase: typeof useCasesData[0], i: number) => (
        <motion.div
            key={`${useCase.id}-${i}`}
            initial={variant === "grid" ? { opacity: 0, y: 20 } : {}}
            whileInView={variant === "grid" ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`group bg-[#15171e] hover:bg-[#1c1f26] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col h-full ${variant === "carousel" ? "min-w-[320px] max-w-[320px] md:min-w-[380px] md:max-w-[380px]" : ""}`}
        >
            {/* Icons Header */}
            <div className="flex items-center gap-2 mb-6">
                {useCase.icons.map((iconKey, j) => (
                    <div key={j} className="w-8 h-8 rounded-lg bg-[#2b2f38] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors flex-shrink-0">
                        {IconMap[iconKey as keyof typeof IconMap]}
                    </div>
                ))}
                {useCase.icons.length < 4 && (
                    <div className="px-2 py-1 rounded bg-[#2b2f38] text-[10px] text-zinc-500 font-mono">
                        + connectors
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mb-8 flex-grow">
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-primary transition-colors">
                    {useCase.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    {useCase.desc}
                </p>
            </div>

            {/* Footer Badge */}
            <div className="flex items-center gap-2 mt-auto">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-black shadow-[0_0_10px_var(--primary-glow)]">
                    GF
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                    {useCase.badge}
                </span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#ccff00]" />
                </div>
            </div>
        </motion.div>
    );

    return (
        <section className={`py-24 md:py-32 ${showBackground ? 'bg-[#02040a]' : 'bg-transparent'} relative overflow-hidden`}>
            {/* Si es grid usamos container standard, si es carousel el título sí va centrado pero el content se desborda */}
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-4"
                    >
                        {subtitle}
                    </motion.p>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                        {title}
                    </h2>
                    <p className="text-zinc-400 font-light max-w-xl mx-auto">
                        {description}
                    </p>
                </div>
            </div>

            {variant === "grid" ? (
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {items.map((useCase, i) => renderCard(useCase, i))}
                    </div>
                </div>
            ) : (
                <div className="w-full relative flex items-center mb-8">
                    {/* Fades para los bordes del carousel */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#02040a] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#02040a] to-transparent z-10 pointer-events-none" />
                    
                    <motion.div
                        className="flex gap-6 w-max pl-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: Math.max(items.length * 8, 30) }}
                    >
                        <div className="flex gap-6 pr-6">
                            {items.map((useCase, i) => renderCard(useCase, i))}
                        </div>
                        <div className="flex gap-6 pr-6">
                            {items.map((useCase, i) => renderCard(useCase, i))}
                        </div>
                    </motion.div>
                </div>
            )}

            {ctaLink && ctaText && (
                <div className="mt-16 text-center container mx-auto px-6 relative z-20">
                    <a href={ctaLink} className="inline-block px-8 py-3 rounded-full bg-primary text-[#02040a] font-bold text-sm tracking-wide shadow-[0_0_20px_var(--primary-glow)] hover:scale-105 transition-all">
                        {ctaText}
                    </a>
                </div>
            )}
        </section>
    );
};
