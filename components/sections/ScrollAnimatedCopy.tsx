"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollAnimatedCopy = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Configuramos useScroll para rastrear la visibilidad de esta sección en el viewport
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 75%", "end 50%"]
    });

    const copy = "Tu negocio no es estándar. Tus automatizaciones tampoco deberían serlo.";
    const words = copy.split(" ");

    return (
        <section ref={containerRef} className="py-32 bg-[#02040a] relative overflow-hidden" id="conversion-copy">
            {/* Fondo con resplandor sútil */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                {/* Copia que evoluciona con el scroll letra por letra / palabra por palabra */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium w-full flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2 md:gap-y-4 leading-[1.1] mb-16">
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        // Transforma el progreso del scroll a opacidad transparente -> visible
                        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
                        // Opcionalmente, un poco de translateY
                        const y = useTransform(scrollYProgress, [start, end], [10, 0]);

                        return (
                            <motion.span key={i} style={{ opacity, y }} className="text-white">
                                {word}
                            </motion.span>
                        );
                    })}
                </h2>

                <motion.div
                    // Fade in del CTA cuando terminamos de leer
                    style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]) }}
                >
                    <p className="text-primary tracking-[0.3em] text-xs font-bold uppercase mb-8">
                        ¿Listo para mutar tu ADN digital?
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
