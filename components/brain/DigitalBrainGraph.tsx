"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { brainNodes, brainLinks, CATEGORY_META, type BrainNode } from "./brainData";

interface DigitalBrainGraphProps {
  className?: string;
}

const findNode = (id: string): BrainNode | undefined =>
  brainNodes.find((n) => n.id === id);

const dotSize = (node: BrainNode) =>
  node.id === "core" ? 20 : 8 + (node.size - 6) * 1.1;

export const DigitalBrainGraph = ({ className = "" }: DigitalBrainGraphProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  if (brainNodes.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono ${className}`}>
        Sin datos del Cerebro Digital.
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[220px] bg-[#050505] rounded-xl border border-white/10 overflow-hidden font-mono ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Links + traveling pulses: rendered in a stretch-fit SVG (thin strokes tolerate the stretch) */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {brainLinks.map((link, i) => {
          const source = findNode(link.source);
          const target = findNode(link.target);
          if (!source || !target) return null;

          const isDimmed = hovered && hovered !== source.id && hovered !== target.id;
          const color = CATEGORY_META[target.category].color;

          return (
            <React.Fragment key={`${link.source}-${link.target}`}>
              <motion.line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={color}
                strokeWidth={0.3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isDimmed ? 0.08 : 0.25 }}
                transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
              />
              {/* Traveling data pulse */}
              <motion.circle
                r={0.5}
                fill={color}
                initial={{ opacity: 0 }}
                animate={{
                  cx: [source.x, target.x],
                  cy: [source.y, target.y],
                  opacity: isDimmed ? 0 : [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1.2 + i * 0.3,
                  ease: "easeInOut",
                }}
              />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Nodes: absolutely positioned HTML so circles/text never skew with container aspect */}
      {brainNodes.map((node, idx) => {
        const meta = CATEGORY_META[node.category];
        const isCore = node.id === "core";
        const isHovered = hovered === node.id;
        const isDimmed = hovered && !isHovered;
        const size = dotSize(node);

        return (
          <motion.div
            key={node.id}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            className="absolute flex flex-col items-center gap-1.5 cursor-pointer -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={isCore ? undefined : { y: [0, -4, 0] }}
            transition={isCore ? undefined : { duration: 3 + (idx % 4) * 0.5, repeat: Infinity, delay: idx * 0.2, ease: "easeInOut" }}
          >
            <div className="relative flex items-center justify-center">
              {isCore && (
                <motion.span
                  className="absolute rounded-full border"
                  style={{ borderColor: meta.color, width: size, height: size }}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <motion.span
                className="rounded-full"
                style={{ backgroundColor: meta.color, width: size, height: size }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isDimmed ? 0.25 : isCore ? [0.75, 1, 0.75] : 0.9,
                  scale: isHovered ? 1.35 : 1,
                }}
                transition={
                  isCore
                    ? { opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.3 } }
                    : { duration: 0.3 }
                }
              />
            </div>
            <span
              className={`whitespace-nowrap uppercase tracking-wide font-medium transition-colors ${
                isCore ? "text-[10px] font-bold" : "text-[8px]"
              } ${isDimmed ? "text-white/15" : "text-white"}`}
            >
              {node.label}
            </span>
          </motion.div>
        );
      })}

      <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[70%]">
        {Object.values(CATEGORY_META).map((meta) => (
          <span
            key={meta.label}
            className="inline-flex items-center gap-1.5 text-[6px] sm:text-[7px] uppercase tracking-widest text-zinc-400"
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </span>
        ))}
      </div>
    </div>
  );
};
