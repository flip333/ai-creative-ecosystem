"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function APIStrand({ count = 100, radius = 2, color = "#ccff00" }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 4; // 2 turns
            const x = Math.cos(t) * radius;
            const y = (i / count) * 10 - 5;
            const z = Math.sin(t) * radius;
            p[i * 3] = x;
            p[i * 3 + 1] = y;
            p[i * 3 + 2] = z;
        }
        return p;
    }, [count, radius]);

    return (
        <Points positions={points} stride={3}>
            <PointMaterial
                transparent
                color={color}
                size={0.1}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function DNAStructure() {
    const ref = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ref.current.rotation.y = t * 0.2;
    });

    return (
        <group ref={ref} rotation={[0, 0, Math.PI / 6]}>
            {/* Strand A */}
            <APIStrand count={150} radius={1.5} color="#ccff00" />
            {/* Strand B (Offset by PI) */}
            <group rotation={[0, Math.PI, 0]}>
                <APIStrand count={150} radius={1.5} color="#ffffff" />
            </group>

            {/* Connecting Base Pairs (Simplified as particles) */}
            <Points positions={new Float32Array(300)} stride={3}>
                <PointMaterial transparent color="#ccff00" opacity={0.2} size={0.05} />
            </Points>
        </group>
    );
}

export const DNAHelix = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-40">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <DNAStructure />
                </Float>
            </Canvas>
        </div>
    );
};
