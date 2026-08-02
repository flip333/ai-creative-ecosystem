"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { brainNodes, brainLinks, CATEGORY_META, type BrainNode } from "./brainData";

interface DigitalBrainGraphProps {
  className?: string;
}

const findNode = (id: string): BrainNode | undefined =>
  brainNodes.find((n) => n.id === id);

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
    <div className={`relative w-full h-full bg-[#050505] rounded-xl border border-white/10 overflow-hidden font-mono ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <svg viewBox="0 0 100 100" className="relative w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Links */}
        {brainLinks.map((link, i) => {
          const source = findNode(link.source);
          const target = findNode(link.target);
          if (!source || !target) return null;

          const isDimmed = hovered && hovered !== source.id && hovered !== target.id;

          return (
            <motion.line
              key={`${link.source}-${link.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={CATEGORY_META[target.category].color}
              strokeWidth={0.3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isDimmed ? 0.08 : 0.25 }}
              transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
            />
          );
        })}

        {/* Nodes */}
        {brainNodes.map((node) => {
          const meta = CATEGORY_META[node.category];
          const isCore = node.id === "core";
          const isHovered = hovered === node.id;
          const isDimmed = hovered && !isHovered;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {isCore && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size / 2 + 3}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={0.3}
                  animate={{ r: [node.size / 2 + 2, node.size / 2 + 5, node.size / 2 + 2], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size / 2.5}
                fill={meta.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isDimmed ? 0.25 : 0.9, scale: isHovered ? 1.3 : 1 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
              <text
                x={node.x}
                y={node.y - node.size / 2 - 2}
                textAnchor="middle"
                fontSize={isCore ? 3.4 : 2.4}
                fill={isDimmed ? "rgba(255,255,255,0.15)" : "#fff"}
                fontWeight={isCore ? 700 : 500}
                className="pointer-events-none select-none uppercase tracking-wide"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        {Object.values(CATEGORY_META).map((meta) => (
          <span
            key={meta.label}
            className="inline-flex items-center gap-1.5 text-[6px] uppercase tracking-widest text-zinc-400"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </span>
        ))}
      </div>
    </div>
  );
};
