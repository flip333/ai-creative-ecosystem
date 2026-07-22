"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Activity,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    LayoutDashboard,
    LifeBuoy,
    Lock,
    Receipt,
    Workflow,
} from "lucide-react";

import { NeonEmphasis } from "@/components/ui/NeonEmphasis";

/* ────────────────────────────────────────────────────────────
   Mockups animados del portal.
   Cada uno reproduce en pequeño la vista real de /portal para que
   la promesa de la landing y el producto sean la misma cosa.
   ──────────────────────────────────────────────────────────── */

const MockShell = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full bg-[#050505] rounded-xl border border-white/10 relative overflow-hidden font-mono">
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "15px 15px",
            }}
        />
        <div className="relative h-full p-5 flex flex-col gap-3">{children}</div>
    </div>
);

const MockHeader = ({ label }: { label: string }) => (
    <div className="flex justify-between items-center shrink-0">
        <div className="bg-primary/20 border border-primary/40 px-2.5 py-1 rounded text-[7px] text-primary flex items-center gap-1.5 font-bold tracking-widest uppercase">
            <Activity size={9} /> {label}
        </div>
        <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
        </div>
    </div>
);

/** Vista 1 — KPIs subiendo desde cero. */
const MockDashboard = () => (
    <MockShell>
        <MockHeader label="Panel Ejecutivo" />
        <div className="grid grid-cols-3 gap-2 shrink-0">
            {[
                { v: "+320%", l: "ROI Estimado" },
                { v: "214", l: "Leads / mes" },
                { v: "86h", l: "Horas ahorradas" },
            ].map((k, i) => (
                <motion.div
                    key={k.l}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="bg-black/50 border border-primary/10 rounded-lg p-2.5"
                >
                    <div className="text-primary text-[13px] font-bold leading-none">{k.v}</div>
                    <div className="text-[6px] text-zinc-500 uppercase mt-1.5 leading-tight">{k.l}</div>
                </motion.div>
            ))}
        </div>

        <div className="flex-1 bg-black/40 rounded-lg border border-white/5 p-3 flex flex-col justify-center gap-2 min-h-0">
            <div className="text-[6px] text-zinc-600 uppercase tracking-widest">Alertas del sistema</div>
            <motion.div
                animate={{ borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.2)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-md px-2.5 py-2"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                <span className="text-[7px] text-zinc-300 leading-tight">
                    Recuperación de Carritos está en Error
                </span>
            </motion.div>
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-md px-2.5 py-2">
                <CheckCircle2 size={9} className="text-primary shrink-0" />
                <span className="text-[7px] text-zinc-500 leading-tight">
                    Otros 4 flujos operando con normalidad
                </span>
            </div>
        </div>
    </MockShell>
);

/** Vista 2 — pipeline de nodos dibujándose paso a paso. */
const MockFlows = () => (
    <MockShell>
        <MockHeader label="Trazabilidad" />
        <div className="flex items-center justify-between gap-1 shrink-0 py-3">
            {["Trigger", "Enrich", "IA", "Envío"].map((n, i) => (
                <React.Fragment key={n}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.35, duration: 0.4 }}
                        className="flex flex-col items-center gap-1 shrink-0"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-primary/25 flex items-center justify-center">
                            <Workflow size={12} className="text-primary" />
                        </div>
                        <span className="text-[6px] text-zinc-500 uppercase">{n}</span>
                    </motion.div>
                    {i < 3 && (
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.35 + 0.2, duration: 0.3 }}
                            style={{ originX: 0 }}
                            className="flex-1 h-[1px] bg-primary/30"
                        />
                    )}
                </React.Fragment>
            ))}
        </div>

        <div className="flex-1 flex flex-col gap-1.5 min-h-0 overflow-hidden">
            <div className="text-[6px] text-zinc-600 uppercase tracking-widest">Últimas ejecuciones</div>
            {[
                { ok: true, t: "12 contactos procesados", h: "Hoy 09:42" },
                { ok: true, t: "8 contactos procesados", h: "Hoy 06:10" },
                { ok: false, t: "Timeout en API externa", h: "Ayer 14:27" },
            ].map((log, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + i * 0.2, duration: 0.4 }}
                    className="flex items-center gap-2 border-b border-white/5 pb-1.5"
                >
                    <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                            log.ok ? "bg-primary/15" : "bg-red-500/15"
                        }`}
                    >
                        <div className={`w-1 h-1 rounded-full ${log.ok ? "bg-primary" : "bg-red-500"}`} />
                    </div>
                    <span className="flex-1 text-[7px] text-zinc-400 truncate">{log.t}</span>
                    <span className="text-[6px] text-zinc-600">{log.h}</span>
                </motion.div>
            ))}
        </div>
    </MockShell>
);

/** Vista 3 — barras de costo creciendo hacia su valor real. */
const MockCosts = () => {
    const rows = [
        { n: "Gestión Genflow 1:1", v: 120.0, w: "58%" },
        { n: "OpenAI (tokens)", v: 42.3, w: "22%" },
        { n: "Klaviyo API", v: 22.0, w: "12%" },
        { n: "GoHighLevel", v: 15.0, w: "8%" },
    ];

    return (
        <MockShell>
            <MockHeader label="Costos Reales" />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 border border-primary/10 rounded-lg p-3 shrink-0"
            >
                <div className="text-[6px] text-zinc-500 uppercase tracking-widest">Total mes en curso</div>
                <div className="text-primary text-xl font-bold leading-none mt-1">$199.30</div>
            </motion.div>

            <div className="flex-1 flex flex-col justify-center gap-2.5 min-h-0">
                {rows.map((r, i) => (
                    <div key={r.n} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[7px] text-zinc-400">{r.n}</span>
                            <span className="text-[7px] text-primary font-bold">${r.v.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: r.w }}
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary/30 to-primary rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </MockShell>
    );
};

/** Vista 4 — conversación de soporte que se escribe sola. */
const MockSupport = () => (
    <MockShell>
        <MockHeader label="Soporte 1:1" />
        <div className="flex-1 flex flex-col justify-center gap-2.5 min-h-0">
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-black/50 border border-white/5 rounded-lg p-2.5 max-w-[85%]"
            >
                <div className="text-[6px] text-zinc-600 uppercase tracking-widest mb-1">Tú</div>
                <p className="text-[7px] text-zinc-300 leading-relaxed">
                    Necesito que el flujo de onboarding corra a las 10am por zona horaria del equipo.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="flex items-center gap-1.5 pl-2"
            >
                {[0, 1, 2].map((d) => (
                    <motion.div
                        key={d}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                        className="w-1 h-1 rounded-full bg-primary"
                    />
                ))}
                <span className="text-[6px] text-zinc-600 ml-1">Tu consultor está escribiendo</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.1, duration: 0.5 }}
                className="bg-primary/5 border-l-2 border-primary/40 rounded-r-lg p-2.5 ml-auto max-w-[85%]"
            >
                <div className="text-[6px] text-primary uppercase tracking-widest mb-1">Genflow</div>
                <p className="text-[7px] text-zinc-300 leading-relaxed">
                    Listo. Reprogramado a las 10:00 (America/Bogotá). Activo desde el próximo ciclo.
                </p>
            </motion.div>
        </div>

        <div className="flex justify-between items-center text-[6px] text-zinc-600 uppercase tracking-widest shrink-0">
            <span>Respuesta media &lt; 24h</span>
            <span className="text-primary">Humano, no bot</span>
        </div>
    </MockShell>
);

/* ──────────────────────────────────────────────────────────── */

const capabilities = [
    {
        id: "home",
        icon: LayoutDashboard,
        tab: "Panel",
        title: "Sabes cómo vas sin pedirle el dato a nadie",
        description:
            "ROI estimado, leads generados y horas ahorradas al mes, calculados sobre la operación real. Si un flujo se cae, la alerta aparece aquí antes de que lo notes en el negocio.",
        mock: MockDashboard,
    },
    {
        id: "flows",
        icon: Workflow,
        tab: "Trazabilidad",
        title: "Cada automatización, abierta y auditable",
        description:
            "Entra a cualquier flujo y ve su secuencia de nodos completa, el estado en vivo y el historial de ejecuciones con sus errores. Se acabó el software que funciona pero nadie sabe cómo.",
        mock: MockFlows,
    },
    {
        id: "billing",
        icon: Receipt,
        tab: "Costos",
        title: "Cuánto cuesta cada pieza, sin letra chica",
        description:
            "El consumo desglosado servicio por servicio: tokens de IA, APIs, herramientas y nuestro acompañamiento. Descargable en un clic. Así es como detectamos dónde recortar.",
        mock: MockCosts,
    },
    {
        id: "support",
        icon: LifeBuoy,
        tab: "Soporte",
        title: "Un consultor asignado, no una cola de tickets",
        description:
            "Abres una solicitud y la responde la persona que construyó tu sistema. La conversación queda registrada junto al flujo del que hablas, no perdida en un hilo de correo.",
        mock: MockSupport,
    },
];

export const PlatformShowcase = () => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    // Rota solo para que la sección se muestre viva; cualquier clic la detiene
    // y deja el control al usuario.
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setActive((i) => (i + 1) % capabilities.length), 6000);
        return () => clearInterval(id);
    }, [paused]);

    const current = capabilities[active];
    const Mock = current.mock;

    return (
        // overflow-hidden es obligatorio: el glow decorativo mide 600px y sin
        // recorte empuja el ancho del documento en móvil.
        <section
            className="py-32 bg-[#02040a] relative overflow-hidden border-t border-white/5"
            id="plataforma"
        >
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-primary uppercase tracking-[0.5em] text-xs font-bold mb-6"
                    >
                        Tu Portal Genflow
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-display font-medium text-white leading-tight mb-8"
                    >
                        Contratar IA a ciegas <br />
                        <NeonEmphasis>se acabó.</NeonEmphasis>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-400 font-light leading-relaxed"
                    >
                        Cada cliente recibe acceso a un portal privado donde vive su ecosistema completo:
                        qué está corriendo, qué resultados da, cuánto cuesta y a quién preguntarle.
                        <span className="text-white font-medium">
                            {" "}Sin pedir reportes. Sin esperar a la reunión mensual.
                        </span>
                    </motion.p>
                </div>

                {/* Selector de capacidades */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {capabilities.map((cap, i) => {
                        const Icon = cap.icon;
                        const isActive = i === active;
                        return (
                            <button
                                key={cap.id}
                                onClick={() => {
                                    setActive(i);
                                    setPaused(true);
                                }}
                                aria-pressed={isActive}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border ${
                                    isActive
                                        ? "bg-primary text-black border-primary shadow-[0_0_24px_rgba(204,255,0,0.35)]"
                                        : "bg-white/[0.02] text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
                                }`}
                            >
                                <Icon size={14} />
                                {cap.tab}
                            </button>
                        );
                    })}
                </div>

                {/* Panel: copy + mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-10 md:p-12 flex flex-col justify-center"
                        >
                            <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-6 leading-snug">
                                {current.title}
                            </h3>
                            <p className="text-lg text-zinc-400 font-light leading-relaxed mb-8">
                                {current.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href="/login"
                                    className="inline-block btn-premium group px-7 py-3 text-sm"
                                >
                                    <span className="flex items-center gap-2">
                                        Acceder a mi portal
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </span>
                                </Link>
                                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600">
                                    <Lock size={12} />
                                    Acceso por invitación
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${current.id}-mock`}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.35 }}
                            className="rounded-[2.5rem] bg-black/20 border border-white/5 p-8 min-h-[420px]"
                        >
                            <div className="w-full h-full min-h-[356px] shadow-2xl shadow-black rounded-xl overflow-hidden">
                                <Mock />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Cierre con documentación, que no tiene tab propio */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 flex flex-col md:flex-row md:items-center gap-6"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <BookOpen size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-display text-xl mb-1">
                            Y la documentación es tuya
                        </h4>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Prompts maestros, arquitectura de cada flujo y accesos quedan documentados en tu
                            portal. Si mañana decides operar sin nosotros, te llevas el sistema entendido —
                            no una caja negra.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
