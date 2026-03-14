"use client";

import React from "react";
import { motion } from "framer-motion";

interface NeonEmphasisProps {
    children: React.ReactNode;
    className?: string;
}

export const NeonEmphasis = ({ children, className = "" }: NeonEmphasisProps) => {
    return (
        <motion.span
            animate={{
                textShadow: [
                    "0 0 10px rgba(204,255,0,0.2)",
                    "0 0 25px rgba(204,255,0,0.6)",
                    "0 0 10px rgba(204,255,0,0.2)"
                ]
            }}
            transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`text-primary font-medium italic ${className}`}
        >
            {children}
        </motion.span>
    );
};
