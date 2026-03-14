"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export const GradientTypewriter = ({
    text,
    className = "",
    delay = 0,
    speed = 0.05
}: {
    text: string,
    className?: string,
    delay?: number,
    speed?: number
}) => {
    const letters = text.split("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Use solid neon color with glow instead of gradient
    const neonClass = "text-[#ccff00] drop-shadow-[0_0_15px_rgba(204,255,0,0.6)]";

    return (
        <span ref={ref} className={`${className} inline-block relative`}>
            {letters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
                    transition={{
                        duration: 0.3,
                        delay: delay + i * speed,
                        ease: "easeOut"
                    }}
                    className={`${neonClass} inline-block`}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="inline-block w-[3px] h-[0.9em] bg-[#ccff00] ml-1 align-middle shadow-[0_0_10px_#ccff00]"
            />
        </span>
    );
};
