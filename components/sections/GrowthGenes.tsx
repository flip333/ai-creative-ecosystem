"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Brain, Layers, ArrowRight, MessageSquare, LineChart, Image as ImageIcon, Zap, TrendingUp, Video, Play, Activity } from "lucide-react";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { TypewriterPulse } from "@/components/ui/TypewriterPulse";

const InterfaceMockup = ({ type }: { type: 'crm' | 'node' | 'chat' }) => {
    if (type === 'crm') {
        return (
            <div className="w-full h-full bg-[#050505] rounded-xl border border-white/10 relative overflow-hidden font-mono group/mockup">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-primary/20 border border-primary/40 px-3 py-1 rounded text-[8px] text-primary flex items-center gap-2 shadow-sm font-bold tracking-widest"
                        >
                            <Activity size={10} /> GENFLOW_OPS ACTIVE
                        </motion.div>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                        </div>
                    </div>

                    {/* CRM Conversion Funnel Animation */}
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Stream of incoming leads */}
                        <div className="absolute left-4 space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        x: [0, 80, 160],
                                        y: [0, -10, 0],
                                        opacity: [0, 1, 1, 0],
                                        scale: [0.5, 1, 0.8]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 1, ease: "easeInOut" }}
                                    className="w-6 h-6 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg transform rotate-12"
                                >
                                    <MessageSquare size={10} className="text-primary/60" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Enrichment Step */}
                        <motion.div
                            animate={{ borderColor: ['rgba(204,255,0,0.1)', 'rgba(204,255,0,0.3)', 'rgba(204,255,0,0.1)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute left-[35%] w-12 h-20 border-l border-r border-dashed border-primary/20 flex flex-col items-center justify-around py-2"
                        >
                            <div className="text-[6px] text-zinc-600 uppercase font-black">Validar</div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                        </motion.div>

                        <div className="relative z-10 left-10">
                            <motion.div
                                animate={{
                                    boxShadow: ['0 0 20px rgba(204,255,0,0.05)', '0 0 60px rgba(204,255,0,0.2)', '0 0 20px rgba(204,255,0,0.05)']
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-24 h-24 rounded-3xl border-2 border-primary/20 flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden"
                            >
                                <Database size={40} className="text-primary" />
                                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                {/* Internal Data Bars */}
                                <div className="absolute bottom-2 flex gap-0.5">
                                    {[1, 2, 3, 4].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, 12, 4] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-1 bg-primary/40 rounded-t-full"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] text-zinc-500 font-bold uppercase">Tiempo de ciclo</span>
                            <span className="text-[8px] text-primary font-bold">-62%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: ['0%', '85%'] }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary/20 to-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'node') {
        return (
            <div className="w-full h-full bg-[#030408] rounded-xl border border-white/10 relative overflow-hidden font-mono group/mockup">
                {/* Vibrant Background DNA Grid */}
                <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(204,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative h-full flex flex-col">
                    {/* Header: Pro Interface */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">Vivid Synthesis Engine</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-2 py-0.5 rounded-sm bg-zinc-800 text-[6px] text-zinc-400 font-bold uppercase">UHD 4K</div>
                            <div className="px-2 py-0.5 rounded-sm bg-primary/20 border border-primary/30 text-[6px] text-primary font-bold uppercase">AI Active</div>
                        </div>
                    </div>

                    {/* Main Node Workspace */}
                    <div className="flex-1 relative p-6 flex flex-col justify-center">
                        <div className="flex justify-between items-center relative h-40">
                            {/* Connecting Lines (SVG) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <motion.path
                                    d="M 50 80 Q 150 80 150 80"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    className="stroke-primary/20 stroke-1 fill-none"
                                />
                                <motion.path
                                    d="M 150 80 Q 250 80 280 80"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    className="stroke-primary/20 stroke-1 fill-none border-dashed"
                                />
                            </svg>

                            {/* Input Nodes: Photos & Videos */}
                            <div className="space-y-4 relative z-10">
                                {[
                                    { icon: <ImageIcon size={14} />, label: "photo_01.raw" },
                                    { icon: <Video size={14} />, label: "b-roll_seq.mp4" }
                                ].map((input, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        className="w-24 p-2 bg-zinc-900/80 border border-white/10 rounded-lg backdrop-blur-md flex items-center gap-2"
                                    >
                                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            {input.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-zinc-800 rounded mb-1" />
                                            <div className="h-0.5 w-1/2 bg-zinc-800 rounded" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Central Logic Node: DNA / Brain */}
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        boxShadow: ['0 0 20px rgba(204,255,0,0.1)', '0 0 40px rgba(204,255,0,0.3)', '0 0 20px rgba(204,255,0,0.1)'],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-20 h-20 rounded-2xl bg-black border-2 border-primary/40 flex items-center justify-center relative z-20"
                                >
                                    <Brain size={32} className="text-primary" />
                                    {/* Orbital Data Rings */}
                                    <div className="absolute inset-0 border border-primary/20 rounded-2xl animate-spin [animation-duration:5s]" />
                                    <div className="absolute -inset-2 border border-primary/10 rounded-2xl animate-reverse-spin [animation-duration:8s]" />
                                </motion.div>

                                {/* DNA Spiral Elements */}
                                <div className="absolute inset-0 -z-10 opacity-30">
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                            className="absolute inset-0 border border-primary rounded-full blur-xl"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Output Node: Final Content */}
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-28 h-32 bg-zinc-900 border border-primary/30 rounded-xl relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                                {/* Content Stream Animation */}
                                <motion.div
                                    animate={{
                                        y: ['0%', '-100%']
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 space-y-2 p-2"
                                >
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="aspect-video w-full rounded-md bg-zinc-800 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                                            <Play size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" />
                                        </div>
                                    ))}
                                </motion.div>
                                <div className="absolute bottom-2 left-2 right-2 z-20 h-1 bg-primary/20 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: ['0%', '100%'] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Floating Data Streams along the flow */}
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{
                                    x: [40, 300],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    delay: i * 1.5,
                                    ease: "linear"
                                }}
                                className="absolute top-[50%] left-0 w-1.5 h-1.5 bg-primary rounded-full blur-[1px]"
                            />
                        ))}
                    </div>

                    {/* Interaction Footer */}
                    <div className="h-14 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center px-6 justify-between">
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[6px] text-zinc-500 font-bold uppercase">Asset Efficiency</span>
                                <span className="text-[10px] text-white font-bold">12.5x</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[6px] text-zinc-500 font-bold uppercase">Synthesis Rate</span>
                                <span className="text-[10px] text-primary font-bold">98.2%</span>
                            </div>
                        </div>
                        <div className="text-[8px] text-zinc-600 font-mono italic">
                            GENFLOW_AUTO_FLOW: SYNCHRONIZING...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'chat') {
        return (
            <div className="w-full h-full bg-[#050505] rounded-xl border border-white/10 relative overflow-hidden font-mono">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />
                <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Hub de Adopción</div>
                            <div className="text-[6px] text-cyan-400 font-mono">EQUIPOS ACTIVOS: 5</div>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.2, zIndex: 20 }}
                                    className="w-7 h-7 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center relative shadow-xl overflow-hidden"
                                >
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800" />
                                    <div className="absolute bottom-0 w-full h-1/2 bg-cyan-400/10" />
                                </motion.div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-cyan-400/20 border-2 border-black flex items-center justify-center text-[8px] text-cyan-400 font-bold z-10 backdrop-blur-md">+5</div>
                        </div>
                    </div>

                    {/* Central Synthesis Brain */}
                    <div className="relative flex items-center justify-center">
                        <div className="relative">
                            {/* Central Synergy Core */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.05, 1],
                                    boxShadow: ['0 0 30px rgba(34,211,238,0.1)', '0 0 60px rgba(34,211,238,0.4)', '0 0 30px rgba(34,211,238,0.1)']
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 rounded-full bg-zinc-900 border border-cyan-400/30 flex items-center justify-center relative z-10"
                            >
                                <Brain size={32} className="text-cyan-400" />
                                {/* Rotating Ring */}
                                <div className="absolute inset-0 border-2 border-dashed border-cyan-400/20 rounded-full animate-spin [animation-duration:15s]" />
                            </motion.div>

                            {/* Communication Streamers */}
                            {[0, 45, 90, 135, 180, 225, 270, 315].map(degree => (
                                <motion.div
                                    key={degree}
                                    animate={{
                                        opacity: [0, 0.4, 0],
                                        width: [0, 120]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, delay: degree / 180 }}
                                    className="absolute top-1/2 left-1/2 w-32 h-[0.5px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-cyan-400/0 origin-left"
                                    style={{ transform: `rotate(${degree}deg)` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                            className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded-xl text-[7px] text-cyan-100 flex gap-3 items-center backdrop-blur-md"
                        >
                            <Zap size={10} className="text-cyan-400" />
                            <div className="flex-1">
                                <span className="font-bold text-cyan-400 uppercase">Genflow_Sync:</span>
                                Ana resolvió su consulta con el copiloto interno. Sin escalar a soporte.
                            </div>
                        </motion.div>
                        <div className="flex justify-between items-center text-[6px] text-zinc-600 font-bold uppercase tracking-widest">
                            <span>Adopción: 5 equipos</span>
                            <span className="animate-pulse">Active_Sync</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

const genes = [
    {
        id: "origin",
        title: "Origin OS",
        subtitle: "Gen Operativo",
        description:
            "Sistemas construidos sobre tu proceso, no sobre el promedio del mercado. Conciliaciones, reportes, aprobaciones, inventario, seguimiento de pedidos: el trabajo repetitivo que se come las horas de tu equipo, convertido en flujos que corren solos y avisan cuando algo falla.",
        icon: <Database className="text-primary" size={24} />,
        color: "from-primary/20",
        borderColor: "group-hover:border-primary/50",
        features: ["Procesos a medida", "Datos unificados", "Alertas ante fallos"],
        mockupType: 'crm'
    },
    {
        id: "vivid",
        title: "Vivid Synthesis",
        subtitle: "Gen Creativo & Marketing",
        description:
            "Producir y captar a escala sin sonar a plantilla. Contenido, campañas y seguimiento de leads construidos sobre la voz real de tu marca — siempre con revisión humana antes de que algo salga publicado.",
        icon: <Video className="text-purple-400" size={24} />,
        color: "from-purple-500/20",
        borderColor: "group-hover:border-purple-500/50",
        features: ["Contenido a escala", "Consistencia de marca", "Revisión humana"],
        mockupType: 'node'
    },
    {
        id: "synergy",
        title: "Synergy AI",
        subtitle: "Gen de Capacitación & Cultura IA",
        description:
            "Un sistema que nadie sabe usar es dinero quemado. Formamos a tu equipo, documentamos cada flujo y dejamos copilotos internos, para que la IA deje de ser un proyecto del área de tecnología y pase a ser parte de cómo trabaja la empresa.",
        icon: <Brain className="text-cyan-400" size={24} />,
        color: "from-cyan-500/20",
        borderColor: "group-hover:border-cyan-500/50",
        features: ["Formación al equipo", "Documentación viva", "Copilotos internos"],
        mockupType: 'chat'
    }
];

const GeneCard = ({ gene, index }: { gene: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`group relative rounded-[2.5rem] bg-white/[0.02] border border-white/5 ${gene.borderColor} transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full md:h-[400px]`}
        >
            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center md:w-1/2 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-black/40 rounded-lg border border-white/10 backdrop-blur-sm">
                        {gene.icon}
                    </div>
                    <TypewriterPulse
                        text={gene.subtitle}
                        className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]"
                    />
                </div>

                <h3 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                    {gene.title}
                </h3>

                <p className="text-lg text-zinc-300 font-light leading-relaxed mb-8">
                    {gene.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {gene.features.map((feature: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-black/20 border border-white/5 text-[10px] text-white/70 uppercase tracking-wider">
                            {feature}
                        </span>
                    ))}
                </div>
            </div>

            {/* Visual Side */}
            <div className="md:w-1/2 bg-black/20 relative overflow-hidden border-t md:border-t-0 md:border-l border-white/5">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full h-full max-h-[300px] shadow-2xl shadow-black rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-700">
                        {/* Mockup Container */}
                        <InterfaceMockup type={gene.mockupType} />
                    </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
        </motion.div>
    );
};

export const GrowthGenes = () => {
    return (
        <section className="py-32 bg-[#02040a] relative" id="genes">
            <div className="container mx-auto px-6">
                <div className="mb-24 md:pl-32">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-6"
                    >
                        Dónde intervenimos
                    </motion.p>
                    <h2 className="text-5xl md:text-7xl font-display font-medium text-white leading-tight mb-8">
                        Tres frentes. <br />
                        Un solo <NeonEmphasis>ecosistema</NeonEmphasis>
                    </h2>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
                        Ninguno se entrega igual a dos empresas: cada solución se desarrolla sobre tu
                        proceso real. El diagnóstico define por cuál empezamos — y con frecuencia la
                        respuesta no es marketing, sino la operación que nadie quiere tocar.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {genes.map((gene, i) => (
                        <GeneCard key={gene.id} gene={gene} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};
