"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export const Footer = () => {
    const [openModal, setOpenModal] = useState<"privacidad" | "terminos" | null>(null);

    return (
        <footer className="py-20 bg-[#02040a] border-t border-primary/10 relative z-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <span className="text-black font-bold text-xl">G</span>
                        </div>
                        <span className="font-display font-medium text-xl tracking-tight text-white italic">
                            Gen<span className="text-primary NOT-italic">flow</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-10 text-sm text-zinc-500 font-medium tracking-widest uppercase">
                        <button onClick={() => setOpenModal("privacidad")} className="hover:text-primary transition-colors cursor-pointer">
                            Tratamiento de Datos
                        </button>
                        <button onClick={() => setOpenModal("terminos")} className="hover:text-primary transition-colors cursor-pointer">
                            Términos y Condiciones
                        </button>
                    </div>

                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] text-center md:text-right">
                        © 2026 Genflow // Hackeando Cultura.
                    </p>
                </div>
            </div>

            {/* Modals for Privacy and Terms */}
            {openModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                        onClick={() => setOpenModal(null)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-[#0a0c14] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#15171e]">
                            <h3 className="font-display text-xl text-white">
                                {openModal === "privacidad" ? "Política de Tratamiento de Datos" : "Términos y Condiciones Generales"}
                            </h3>
                            <button 
                                onClick={() => setOpenModal(null)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-zinc-300 text-sm leading-relaxed space-y-6">
                            {openModal === "privacidad" ? (
                                <>
                                    <p><strong>1. Responsable del Tratamiento:</strong> Genflow (en adelante "La Empresa"), asume el compromiso legal y ético de proteger la información personal y datos suministrados por nuestros usuarios y clientes mediante nuestras plataformas tecnológicas ecosistémicas.</p>
                                    <p><strong>2. Finalidad de Recolección:</strong> Los datos recaudados durante el acceso a flujos de automatización o el agendamiento del diagnóstico gratuito se utilizarán exclusivamente para: (a) estructurar análisis de fricción empresarial; (b) diseñar workflows de IA a medida; (c) enviar notificaciones relevantes y actualizaciones sobre nuestras librerías y componentes.</p>
                                    <p><strong>3. Principios de Privacidad:</strong> Todo manejo se fundamenta bajo rigurosos protocolos de tokenización y seguridad en tránsito. Los modelos de IA aplicados procesan la información de manera encriptada con política de "cero retención" externa.</p>
                                    <p><strong>4. Derechos de los Usuarios:</strong> Como titular, tienes el derecho de conocer, actualizar, rectificar y suprimir tu información personal en cualquier momento. Puedes enviar tu solicitud directamente a nuestro canal de privacidad en <em>privacy@genflow.com</em>.</p>
                                    <p className="pt-4 border-t border-white/5"><em>Última actualización: Marzo 2026. Al utilizar los sistemas Genflow confirmas estar alineado a estos términos corporativos y autorizas el procesamiento lícito de los datos en cuestión.</em></p>
                                </>
                            ) : (
                                <>
                                    <p><strong>1. Aceptación de Términos:</strong> El acceso a las plataformas, librerías y ecosistemas de Genflow está sujeto a la aceptación explícita de estos términos. El uso continuado representa la tácita conformidad con los acuerdos de nivel de servicio (SLA) aquí estipulados.</p>
                                    <p><strong>2. Propiedad Intelectual e Ingeniería de Prompts:</strong> Toda la arquitectura general, librerías de flujos, diseños estéticos, plantillas n8n y lógicas cognitivas integradas en los agentes IA (know-how de base) son propiedad intelectual exclusiva de Genflow, protegidos por normativas de copyright internacionales, a excepción del contenido o variables proporcionadas explícitamente por los clientes dentro de los espacios de trabajo.</p>
                                    <p><strong>3. Uso Legítimo:</strong> Nuestros sistemas están construidos para escalar y hackear culturas de forma positiva. Se prohíbe terminantemente su uso para enviar SPAM a nivel masivo, raspado ilegal de IPs protegidas gubernamentales o actos perversos que comprometan el bienestar digital de ecosistemas vulnerables.</p>
                                    <p><strong>4. Modificación Sistémica de Servicios:</strong> Debido a la naturaleza cambiante del ecosistema tecnológico (LLMs, integraciones SaaS o APIs de terceros), Genflow se reserva el derecho de auditar, modificar o reemplazar la infraestructura subyacente de nuestros módulos para garantizar la viabilidad y rentismo de los mismos.</p>
                                    <p className="pt-4 border-t border-white/5"><em>Al navegar y agendar tu diagnóstico estás confirmando ser una entidad alineada con el propósito de optimización digital progresista. Modificaciones a este término de contrato no verbal se notificarán vía email empresarial.</em></p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};
