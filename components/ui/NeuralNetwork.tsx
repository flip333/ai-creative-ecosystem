"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "framer-motion";

function NeuralParticles() {
    const ref = useRef<THREE.Points>(null!);
    const { scrollYProgress } = useScroll();

    // Generate particles in a spherical/neural-like shape
    const particles = useMemo(() => {
        const count = 2000;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const radius = 2 + Math.random() * 2;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const scroll = scrollYProgress.get();

        // Rotation based on time + scroll
        ref.current.rotation.y = t * 0.05 + scroll * 2;
        ref.current.rotation.x = t * 0.02 + scroll * 1;

        // Pulsing effect influenced by scroll
        const scale = 1 + Math.sin(t * 1.5) * 0.05 + scroll * 0.2;
        ref.current.scale.set(scale, scale, scale);
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ccff00"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function Connections() {
    const linesRef = useRef<THREE.Group>(null!);

    const lines = useMemo(() => {
        const count = 40;
        const points = [];
        for (let i = 0; i < count; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            );
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            );
            points.push(start, end);
        }
        return points;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        linesRef.current.rotation.y = t * 0.03;
    });

    return (
        <group ref={linesRef}>
            {Array.from({ length: 40 }).map((_, i) => (
                <line key={i}>
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            attach="attributes-position"
                            count={2}
                            array={new Float32Array([
                                (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4,
                                (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4,
                            ])}
                            itemSize={3}
                            args={[new Float32Array(6), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial attach="material" color="#ccff00" transparent opacity={0.1} />
                </line>
            ))}
        </group>
    );
}

export const NeuralNetwork = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <color attach="background" args={["#02040a"]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ccff00" />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <NeuralParticles />
                </Float>
                <Connections />
            </Canvas>
        </div>
    );
};
