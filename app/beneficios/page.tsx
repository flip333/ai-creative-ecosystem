"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    Rocket, ShieldCheck, TrendingUp, HandHeart, 
    BookOpen, Lightbulb, Users, CheckCircle 
} from "lucide-react";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { Diagnosis } from "@/components/sections/Diagnosis";

const businessBenefits = [
    {
        icon: <TrendingUp className="text-primary" size={28} />,
        title: "Retorno Inmediato en Eficiencia",
        description: "Automatiza tareas que hoy drenan tiempo y energía. Reduce cuellos de botella para que tu valioso equipo humano se concentre en estrategia, no en tareas repetitivas."
    },
    {
        icon: <ShieldCheck className="text-primary" size={28} />,
        title: "Soberanía y Arquitectura Privada",
        description: "Tu conocimiento corporativo se queda contigo. Construimos sistemas herméticos que resguardan tu ADN sin fugas de información hacia modelos LLMs públicos."
    },
    {
        icon: <Rocket className="text-primary" size={28} />,
        title: "Escalabilidad Sin Sobrecostos",
        description: "Crecer el talento humano es costoso; escalar un ecosistema de agentes IA requiere cambiar simples parámetros computacionales. Crece tu capacidad productiva exponencialmente."
    },
    {
        icon: <BookOpen className="text-primary" size={28} />,
        title: "Comunidad y Recursos Internos",
        description: "Al formar parte de nuestro ecosistema, accederás a nuestra librería de herramientas exclusivas y newsletters periódicos en tendencias de Marketing estratégico e Inteligencia Artificial corporativa."
    }
];

export default function BeneficiosPage() {
    return (
        <main className="bg-[#02040a] min-h-screen text-white pt-32 pb-16">
            
            {/* Hero Section */}
            <div className="container mx-auto px-6 mb-24 relative">
                {/* Visual Glow */}
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="text-center max-w-4xl mx-auto relative z-10">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-4"
                    >
                        Más motivos para evolucionar
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-medium text-white mb-6 leading-tight"
                    >
                        Beneficios para ti, <br />
                        <NeonEmphasis>Impacto para el ecosistema</NeonEmphasis>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto"
                    >
                        No solo adquieres infraestructura autónoma que acelera la facturación de tu empresa. 
                        Inviertes en un modelo solidario que empodera e impulsa el desarrollo tecnológico de 
                        otras mentes brillantes.
                    </motion.p>
                </div>
            </div>

            {/* Core Business Benefits Grid */}
            <div className="container mx-auto px-6 mb-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {businessBenefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#15171e]/60 border border-white/5 hover:border-primary/30 p-8 rounded-3xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(204,255,0,0.05)]">
                                {benefit.icon}
                            </div>
                            <h3 className="text-2xl font-display text-white mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed font-light text-sm">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Social Impact / Colombia Segment */}
            <div className="py-24 bg-gradient-to-b from-[#15171e]/20 to-[#02040a] border-t border-primary/20 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row items-center gap-16"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-3 py-1 rounded-full bg-primary/20 text-primary uppercase font-bold text-[10px] tracking-widest border border-primary/30 flex items-center gap-2">
                                        <HandHeart size={14} /> Hackeando Cultura Nacional
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                                    Tu inversión <NeonEmphasis>financia tecnología</NeonEmphasis> a otros pioneros.
                                </h2>
                                <p className="text-zinc-300 font-light text-lg mb-8 leading-relaxed">
                                    Parte de nuestros ingresos como agencia se destinan a cerrar la brecha tecnológica. 
                                    <strong>Dotamos de herramientas, conocimiento en IA y marketing a emprendimientos e ideas 
                                    de negocio semilla del ecosistema colombiano.</strong>
                                </p>
                                
                                <ul className="space-y-5">
                                    {[
                                        "Incentivamos activamente la formalización de nuevos emprendedores.",
                                        "Proveemos acceso a flujos que normalmente no podrían costear.",
                                        "Generamos una comunidad de retroalimentación en marketing estratégico."
                                    ].map((point, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="mt-1 bg-primary/20 p-1 rounded-full text-primary">
                                                <CheckCircle size={16} />
                                            </div>
                                            <span className="text-zinc-400 text-sm leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="md:w-[400px] w-full shrink-0">
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(204,255,0,0.1)]">
                                    {/* Arte abstracto representando conexión / Colombia */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-zinc-900 to-black p-8 flex flex-col justify-end">
                                        <div className="absolute top-8 right-8 text-primary/30">
                                            <Lightbulb size={120} />
                                        </div>
                                        <div className="relative z-10 backdrop-blur-md bg-black/40 border border-white/10 p-6 rounded-2xl">
                                            <Users className="text-primary mb-3" size={24} />
                                            <h4 className="text-white font-display text-xl mb-2">Construyendo País</h4>
                                            <p className="text-xs text-zinc-400 font-light">Ecosistemas que devuelven valor. Tecnología con propósito colectivo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Diagnóstico Final CTA */}
            <div id="diagnostico" className="mt-12">
                <Diagnosis />
            </div>
        </main>
    );
}
