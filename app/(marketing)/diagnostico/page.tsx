"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonEmphasis } from "@/components/ui/NeonEmphasis";
import { ArrowRight, CheckCircle, AlertCircle, Building, User, Mail, Briefcase, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DiagnosticoPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        role: "",
        challenge: ""
    });
    
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('diagnostics')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        company: formData.company,
                        role: formData.role,
                        challenge: formData.challenge
                    }
                ]);

            if (error) throw error;
            
            setStatus("success");
        } catch (error: any) {
            console.error("Error submitting form:", error);
            setStatus("error");
            setErrorMessage(error.message || "Ocurrió un error al procesar tu solicitud. Intenta nuevamente.");
        }
    };

    return (
        <main className="min-h-screen bg-[#02040a] text-white pt-32 pb-24 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
                    
                    {/* Columna Izquierda: Información */}
                    <div className="md:w-5/12 flex-shrink-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-4">
                                Sesión de 30 minutos
                            </p>
                            <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 leading-tight">
                                Media hora <br />
                                que te deja <br />
                                <NeonEmphasis>un plan</NeonEmphasis>
                            </h1>
                            <p className="text-zinc-400 font-light text-lg mb-8 leading-relaxed max-w-sm">
                                No es una llamada de ventas. Revisamos tu operación contigo y sales con un
                                diagnóstico escrito — lo uses con nosotros o por tu cuenta.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Miramos tu operación real", desc: "Qué herramientas pagas, qué se hace a mano y dónde se cae el proceso hoy." },
                                    { title: "Te decimos dónde estás gastando de más", desc: "Suscripciones duplicadas, planes sobredimensionados, tareas que no justifican su costo." },
                                    { title: "Priorizamos por impacto, no por moda", desc: "Qué automatizar primero, qué puede esperar y qué directamente no vale la pena." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1 tracking-wide">{step.title}</h4>
                                            <p className="text-sm text-zinc-500 font-light leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Columna Derecha: Formulario de Registro */}
                    <div className="md:w-7/12 w-full">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-[#15171e]/80 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16"
                                    >
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="text-primary" size={40} />
                                        </div>
                                        <h3 className="text-2xl font-display text-white mb-4">Listo, lo tenemos</h3>
                                        <p className="text-zinc-400 font-light mb-8 max-w-md mx-auto">
                                            Revisamos tu contexto y te escribimos en menos de 24 horas para
                                            cuadrar la sesión. Si tu caso no encaja con lo que hacemos, también
                                            te lo decimos — y te sugerimos por dónde ir.
                                        </p>
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all"
                                        >
                                            Enviar otra solicitud
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-display text-white mb-2">Agenda tu diagnóstico</h3>
                                            <p className="text-sm text-zinc-400">Cinco campos. Con esto preparamos la sesión antes de hablar contigo, para no gastar los 30 minutos en preguntas básicas.</p>
                                        </div>

                                        {status === "error" && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-400 text-sm">
                                                <AlertCircle className="shrink-0" size={18} />
                                                <p>{errorMessage}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Nombre */}
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Nombre Completo</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <User className="text-zinc-500" size={16} />
                                                    </div>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        name="name" 
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-sm"
                                                        placeholder="Camila Arango"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Email Corporativo</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Mail className="text-zinc-500" size={16} />
                                                    </div>
                                                    <input 
                                                        required
                                                        type="email" 
                                                        name="email" 
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-sm"
                                                        placeholder="nombre@tuempresa.co"
                                                    />
                                                </div>
                                            </div>

                                            {/* Empresa */}
                                            <div className="space-y-2">
                                                <label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Empresa / Proyecto</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Building className="text-zinc-500" size={16} />
                                                    </div>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        name="company" 
                                                        id="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-sm"
                                                        placeholder="Tu empresa SAS"
                                                    />
                                                </div>
                                            </div>

                                            {/* Rol */}
                                            <div className="space-y-2">
                                                <label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Tu Perfil / Posición</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Briefcase className="text-zinc-500" size={16} />
                                                    </div>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        name="role" 
                                                        id="role"
                                                        value={formData.role}
                                                        onChange={handleChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-sm"
                                                        placeholder="Ej: Fundadora, Directora de Operaciones..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fricción / Challenge */}
                                        <div className="space-y-2 mt-6">
                                            <label htmlFor="challenge" className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">¿Qué te está costando tiempo o dinero? (Opcional)</label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                                                    <MessageSquare className="text-zinc-500" size={16} />
                                                </div>
                                                <textarea 
                                                    name="challenge" 
                                                    id="challenge"
                                                    rows={4}
                                                    value={formData.challenge}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-sm resize-none"
                                                    placeholder="Ej: mi equipo pasa dos días al mes armando el reporte de ventas a mano. O: pagamos cuatro herramientas y no sé cuál está sirviendo."
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={status === "submitting"}
                                            className="w-full btn-premium group py-4 mt-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                {status === "submitting" ? (
                                                    "Enviando..."
                                                ) : (
                                                    <>Agendar mi diagnóstico <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                                )}
                                            </span>
                                        </button>

                                        <p className="text-center text-[10px] text-zinc-600 mt-4 leading-relaxed">
                                            Sin compromiso y sin costo. Usamos tus datos solo para contactarte,
                                            bajo los principios de privacidad del pie de página.
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
}
