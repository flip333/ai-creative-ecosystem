'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Grid, Billboard, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

import { useSupabaseAgents } from '@/hooks/useSupabaseAgents';
import type { OfficeAgent, OfficeAgentStatus } from '@/lib/types';

// Colores institucionales Genflow por estado del agente.
const STATUS_COLOR: Record<OfficeAgentStatus, string> = {
  active: '#ccff00', // lima — trabajando
  idle: '#00ffcc',   // teal — en espera
  error: '#ff5964',  // rojo — con error
};
const STATUS_LABEL: Record<OfficeAgentStatus, string> = {
  active: 'Activo', idle: 'En espera', error: 'Error',
};

function AgentDesk({
  agent, selected, onSelect,
}: {
  agent: OfficeAgent;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const color = STATUS_COLOR[agent.status] ?? STATUS_COLOR.idle;
  const base: [number, number, number] = [agent.position_x, agent.position_y, agent.position_z];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      // los activos flotan suavemente; el resto quieto
      group.current.position.y = base[1] + (agent.status === 'active' ? Math.sin(t * 2 + base[0]) * 0.08 : 0);
    }
    if (bodyMat.current) {
      const pulse = agent.status === 'error' ? 0.5 + Math.abs(Math.sin(t * 4)) * 0.8 : agent.status === 'active' ? 0.9 : 0.4;
      bodyMat.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group
      ref={group}
      position={base}
      onClick={(e) => { e.stopPropagation(); onSelect(agent.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/* aro de estado en el piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.95, 1.15, 40]} />
        <meshBasicMaterial color={color} transparent opacity={hovered || selected ? 0.9 : 0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* escritorio */}
      <mesh position={[0.6, 0.35, 0]} castShadow>
        <boxGeometry args={[1.3, 0.1, 0.8]} />
        <meshStandardMaterial color="#141a24" />
      </mesh>
      <mesh position={[1.15, 0.17, 0.3]}><boxGeometry args={[0.08, 0.34, 0.08]} /><meshStandardMaterial color="#0b0e14" /></mesh>
      <mesh position={[1.15, 0.17, -0.3]}><boxGeometry args={[0.08, 0.34, 0.08]} /><meshStandardMaterial color="#0b0e14" /></mesh>
      {/* monitor */}
      <mesh position={[0.95, 0.62, 0]}>
        <boxGeometry args={[0.08, 0.34, 0.5]} />
        <meshStandardMaterial color="#05070c" />
      </mesh>
      <mesh position={[0.9, 0.62, 0]}>
        <boxGeometry args={[0.02, 0.26, 0.42]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={agent.status === 'active' ? 1.2 : 0.5} toneMapped={false} />
      </mesh>

      {/* agente: cuerpo + cabeza */}
      <mesh position={[-0.2, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 6, 14]} />
        <meshStandardMaterial ref={bodyMat} color={color} emissive={color} emissiveIntensity={0.6} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[-0.2, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color="#f1c9a5" />
      </mesh>

      {/* nombre + estado, siempre de frente a la cámara */}
      <Billboard position={[0, 1.5, 0]}>
        <Text fontSize={0.26} color="#ffffff" anchorX="center" anchorY="bottom" outlineWidth={0.012} outlineColor="#02040a" maxWidth={4}>
          {agent.name}
        </Text>
        <Text position={[0, -0.04, 0]} fontSize={0.17} color={color} anchorX="center" anchorY="top">
          {STATUS_LABEL[agent.status] ?? agent.status}
        </Text>
      </Billboard>
    </group>
  );
}

function Scene({ agents, onSelect }: { agents: OfficeAgent[]; onSelect: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const pick = (id: string) => { setSel(id); onSelect(id); };
  return (
    <>
      <OrthographicCamera makeDefault position={[12, 12, 12]} zoom={48} near={-100} far={200} />
      <OrbitControls
        makeDefault enablePan={false} minZoom={28} maxZoom={90}
        minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.6}
        target={[0, 0.5, 0]}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 14, 6]} intensity={1.1} castShadow />
      <directionalLight position={[-6, 6, -6]} intensity={0.3} color="#00ffcc" />

      {/* piso con grid neón */}
      <Grid
        args={[40, 40]} cellSize={1} cellThickness={0.6} cellColor="#143018"
        sectionSize={5} sectionThickness={1} sectionColor="#2f5f12"
        fadeDistance={40} fadeStrength={1.5} infiniteGrid position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#06080f" />
      </mesh>

      {agents.map((a) => (
        <AgentDesk key={a.id} agent={a} selected={sel === a.id} onSelect={pick} />
      ))}
    </>
  );
}

export function IsometricOffice() {
  const { agents, connection } = useSupabaseAgents();
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const selected = agents.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera + estado de conexión en vivo */}
      <section className="bg-gradient-to-br from-[#0d1117] to-black border border-[#ccff00]/15 rounded-3xl p-6 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-2">
            Oficina isométrica · tiempo real
          </div>
          <p className="text-sm text-zinc-400 max-w-xl">
            Tu equipo de agentes en 3D. Las posiciones y estados se sincronizan en vivo desde
            Supabase; arrastra para orbitar la oficina.
          </p>
        </div>
        <ConnBadge connection={connection} count={agents.length} />
      </section>

      <div className="relative w-full rounded-3xl border border-[#ccff00]/15 bg-[#06080f] overflow-hidden" style={{ height: 520 }}>
        {mounted && (
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, failIfMajorPerformanceCaveat: false }}
            onCreated={({ gl, invalidate }) => {
              // Permite que el contexto WebGL se restaure si el navegador lo pierde
              // (al poner la pestaña en segundo plano). Sin preventDefault no se recupera.
              const el = gl.domElement;
              el.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
              el.addEventListener('webglcontextrestored', () => invalidate(), false);
            }}
          >
            <color attach="background" args={['#06080f']} />
            <Scene agents={agents} onSelect={setSelectedId} />
          </Canvas>
        )}

        {/* Estados vacío / cargando sobre el lienzo */}
        {connection === 'connected' && agents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-400 text-sm max-w-xs text-center px-6">
              Tu oficina está lista pero aún no tiene agentes. Cuando se creen en{' '}
              <span className="font-mono text-[#00ffcc]">office_agents</span>, aparecerán aquí en vivo.
            </p>
          </div>
        )}
        {connection === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-6 h-6 text-[#ccff00] animate-spin" />
          </div>
        )}

        {/* Panel de detalle del agente seleccionado */}
        {selected && (
          <div className="absolute top-4 right-4 w-64 bg-[#0d1117]/95 border border-[#ccff00]/20 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#ccff00]">Agente</div>
                <div className="text-sm font-semibold text-white truncate">{selected.name}</div>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-zinc-500 hover:text-white text-xs cursor-pointer">✕</button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[selected.status] }} />
              <span className="text-xs text-zinc-300">{STATUS_LABEL[selected.status] ?? selected.status}</span>
            </div>
            <div className="mt-2 font-mono text-[10px] text-zinc-500">
              pos [{selected.position_x}, {selected.position_y}, {selected.position_z}]
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConnBadge({ connection, count }: { connection: 'loading' | 'connected' | 'error'; count: number }) {
  if (connection === 'connected')
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-semibold">
        <Wifi className="w-3.5 h-3.5" /> En vivo · {count} agentes
      </div>
    );
  if (connection === 'error')
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
        <WifiOff className="w-3.5 h-3.5" /> Sin conexión en vivo
      </div>
    );
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-semibold">
      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando…
    </div>
  );
}
