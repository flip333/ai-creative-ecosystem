"use client";

import React from "react";
import { motion } from "framer-motion";
import { brainStats } from "./brainData";

export const BrainStatsBar = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {brainStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="border-l border-primary/20 pl-4"
        >
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">
            {stat.label}
          </p>
          <p className="text-xl font-display font-medium text-white">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};
