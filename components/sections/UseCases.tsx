"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, MessageSquare, Paintbrush, Users, BarChart3, Workflow as WorkflowIcon, ArrowRight, CheckCircle2, Bot, Database, Mail, Share2, Search, Smartphone, Globe } from "lucide-react";

const useCases = [
    {
        id: "automation",
        title: "Automatización de Procesos",
        tagline: "Sistemas autónomos que ejecutan tareas críticas 24/7.",
        icon: <Zap className="text-primary" size={24} />,
        bg: "bg-primary/5",
        workflow: [
            { title: "Entrada de Data", desc: "Captura de leads o documentos." },
            { title: "Lógica IA", desc: "Clasificación y extracción automática." },
            { title: "Acción Instantánea", desc: "Ejecución en CRM o ERP." }
        ],
        examples: [
            {
                title: "Calificación automática de leads B2B",
                tools: [<Mail size={16} />, <Bot size={16} />, <Database size={16} />],
                user: { name: "Carlos M.", role: "Ops Director", avatar: "CM" },
                extra: "+12"
            },
            {
                title: "Procesamiento de facturas sin errores",
                tools: [<Database size={16} />, <WorkflowIcon size={16} />],
                user: { name: "Laura G.", role: "Finance Lead", avatar: "LG" },
                extra: "+5"
            }
        ],
        image: "/use_case_automation_intelligent_flows_1769826157518.png"
    },
    {
        id: "support",
        title: "Atención al Cliente IA",
        tagline: "Experiencia de soporte inmediata con lenguaje natural.",
        icon: <MessageSquare className="text-secondary" size={24} />,
        bg: "bg-secondary/5",
        workflow: [
            { title: "Consulta Usuario", desc: "Pregunta en lenguaje natural." },
            { title: "Búsqueda Semántica", desc: "Consulta a base de conocimiento." },
            { title: "Resolución", desc: "Respuesta precisa y personalizada." }
        ],
        examples: [
            {
                title: "Chatbot de soporte técnico 24/7",
                tools: [<MessageSquare size={16} />, <Search size={16} />, <Bot size={16} />],
                user: { name: "Elena R.", role: "CS Manager", avatar: "ER" },
                extra: "+8"
            }
        ],
        image: "/use_case_digital_assistants_support_1769826173870.png"
    },
    {
        id: "creative",
        title: "Generación de Contenido",
        tagline: "Escala tu presencia visual y escrita sin fricción.",
        icon: <Paintbrush className="text-blue-500" size={24} />,
        bg: "bg-blue-500/5",
        workflow: [
            { title: "Briefing", desc: "Definición de tono y objetivos." },
            { title: "Augmentación", desc: "IA genera variantes de alto nivel." },
            { title: "Distribución", desc: "Publicación multicanal optimizada." }
        ],
        examples: [
            {
                title: "Adaptación de campañas globales",
                tools: [<Paintbrush size={16} />, <Globe size={16} />, <Share2 size={16} />],
                user: { name: "Julian P.", role: "Creative Dir", avatar: "JP" },
                extra: "+15"
            }
        ],
        image: "/use_case_ai_creativity_production_1769826187723.png"
    },
    {
        id: "marketing",
        title: "Marketing Predictivo",
        tagline: "Anticipa el deseo del cliente con hiper-relevancia.",
        icon: <Users className="text-orange-500" size={24} />,
        bg: "bg-orange-500/10",
        workflow: [
            { title: "Segmentación", desc: "Análisis de patrones de conducta." },
            { title: "Personalización", desc: "Creación de oferta individual." },
            { title: "Conversión", desc: "Impacto en el momento justo." }
        ],
        examples: [
            {
                title: "Recomendaciones personalizadas e-commerce",
                tools: [<Users size={16} />, <BarChart3 size={16} />, <Smartphone size={16} />],
                user: { name: "Sofia V.", role: "Growth Lead", avatar: "SV" },
                extra: "+20"
            }
        ],
        image: "/use_case_personalized_marketing_segments_1769826200946.png"
    }
];

const RecipeCard = ({ item }: { item: any }) => (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-all duration-300 group cursor-default">
        <div className="flex gap-2 mb-4">
            {item.tools.map((icon: any, i: number) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                    {icon}
                </div>
            ))}
            {item.extra && (
                <div className="w-10 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                    {item.extra}
                </div>
            )}
        </div>
        <h4 className="text-white text-sm sm:text-base font-medium mb-6 group-hover:text-primary transition-colors leading-tight">{item.title}</h4>
        <div className="flex items-center gap-3 border-t border-white/5 pt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {item.user.avatar}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-300 flex items-center gap-1 truncate">
                    {item.user.name} <CheckCircle2 size={10} className="text-blue-500 fill-blue-500 shrink-0" />
                </p>
                <p className="text-[10px] text-zinc-500 truncate">{item.user.role}</p>
            </div>
        </div>
    </div>
);

const WorkflowStep = ({ step, index, total }: { step: any, index: number, total: number }) => (
    <div className="relative flex flex-col items-center text-center group">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400 mb-3 sm:mb-4 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300 shrink-0">
            {index + 1}
        </div>
        <h5 className="text-white text-[11px] sm:text-sm font-semibold mb-1 leading-tight">{step.title}</h5>
        <p className="hidden sm:block text-zinc-500 text-[10px] sm:text-[11px] leading-tight">{step.desc}</p>

        {index < total - 1 && (
            <div className="hidden lg:block absolute left-full top-5 w-full -translate-x-1/2 z-0">
                <div className="w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
        )}
    </div>
);

export const UseCases = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const next = () => setActiveIndex((prev) => (prev + 1) % useCases.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + useCases.length) % useCases.length);

    const current = useCases[activeIndex];

    return (
        <section className="py-20 sm:py-32 bg-[#050505] overflow-hidden" id="casos-de-uso">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-20 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium mb-4 sm:mb-8 leading-[1.1]">
                            Flujos que <br className="hidden sm:block" />
                            <span className="text-gradient-primary italic">Transforman Datos</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-400 font-light">
                            Soluciones modulares listas para escalar tus procesos estratégicos.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={prev} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <ChevronLeft size={20} className="text-zinc-400" />
                        </button>
                        <button onClick={next} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <ChevronRight size={20} className="text-zinc-400" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;
                                if (swipe < -50) {
                                    next();
                                } else if (swipe > 50) {
                                    prev();
                                }
                            }}
                            initial={{ opacity: 0, scale: 0.98, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 1.02, x: -20 }}
                            transition={{ duration: 0.5, type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-20 overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                                <div className="lg:col-span-5 space-y-8 sm:space-y-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-bold tracking-[0.3em]">
                                            <div className="w-8 h-[1px] bg-primary" />
                                            Caso 0{activeIndex + 1}
                                        </div>
                                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white leading-tight">{current.title}</h3>
                                        <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">{current.tagline}</p>
                                    </div>

                                    {/* Workflow Grid */}
                                    <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/5 sm:border-t-0">
                                        {current.workflow.map((step, i) => (
                                            <WorkflowStep key={i} step={step} index={i} total={current.workflow.length} />
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4 sm:pt-8 flex justify-center lg:justify-start">
                                        <button className="flex items-center gap-3 text-sm font-semibold text-white group bg-white/5 lg:bg-transparent px-6 py-3 lg:p-0 rounded-full lg:rounded-none">
                                            Explorar este flujo
                                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Recetas de Aplicación</h4>
                                        <div className="flex gap-1">
                                            {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-zinc-800" />)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {current.examples.map((item, i) => (
                                            <RecipeCard key={i} item={item} />
                                        ))}
                                    </div>

                                    {/* Visual Context */}
                                    <div className="mt-8 sm:mt-12 opacity-30 sm:opacity-40">
                                        <img
                                            src={current.image}
                                            alt={current.title}
                                            className="w-full h-24 sm:h-32 object-cover rounded-xl sm:rounded-2xl grayscale"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-3 mt-8 sm:mt-12 justify-center lg:justify-start">
                        {useCases.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-1 transition-all duration-700 ${activeIndex === i ? "w-8 sm:w-12 bg-primary" : "w-2 sm:w-4 bg-zinc-800"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
