"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const TypewriterPulse = ({
    text,
    className,
    delay = 0,
    highlightWords = []
}: {
    text: string,
    className?: string,
    delay?: number,
    highlightWords?: string[]
}) => {
    const letters = text.split("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.span ref={ref} className={className}>
            {letters.map((char, i) => {
                const isHighlight = highlightWords.some(word =>
                    text.substring(text.lastIndexOf(" ", i) + 1).startsWith(word)
                );

                return (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, textShadow: "0 0 0px rgba(204, 255, 0, 0)" }}
                        animate={isInView ? {
                            opacity: 1,
                            textShadow: [
                                "0 0 0px rgba(204, 255, 0, 0)",
                                "0 0 15px rgba(204, 255, 0, 0.6)",
                                "0 0 0px rgba(204, 255, 0, 0)"
                            ]
                        } : {}}
                        transition={{
                            duration: 0.4,
                            delay: delay + i * 0.02,
                        }}
                        className={isHighlight ? "text-primary italic" : ""}
                    >
                        {char}
                    </motion.span>
                );
            })}
        </motion.span>
    );
};
