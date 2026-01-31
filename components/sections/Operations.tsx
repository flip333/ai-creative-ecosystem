"use client"

import { Bot, LineChart, MessageSquare } from "lucide-react"

export function Operations() {
    return (
        <section className="py-24 bg-gradient-to-b from-transparent to-black/50">
            <div className="container px-4 md:px-6 text-center space-y-12">
                <div className="space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold">Marketing, Ventas y Operación</h2>
                    <p className="text-muted-foreground text-lg">
                        Conectamos la creatividad con el negocio para optimizar cada punto de contacto.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left space-y-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                            <LineChart className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold">Marketing Inteligente</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Contenido relevante a escala</li>
                            <li>• Mensajes personalizados</li>
                            <li>• Optimización continua basada en datos</li>
                        </ul>
                    </div>

                    {/* Card 2 */}
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left space-y-4">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold">Automatización Operativa</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Flujos inteligentes de trabajo</li>
                            <li>• Reducción de tareas repetitivas</li>
                            <li>• Mayor foco estratégico del equipo</li>
                        </ul>
                    </div>

                    {/* Card 3 */}
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Atención y Experiencia</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Asistentes digitales 24/7</li>
                            <li>• Respuestas coherentes con la marca</li>
                            <li>• Experiencia de usuario fluida</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
