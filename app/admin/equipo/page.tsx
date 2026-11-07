import { Bot, Terminal, BookOpen, GraduationCap, MessagesSquare } from 'lucide-react';

import { requireAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

type Role = { code: string; name: string; tag: string; desc: string };
type Group = { title: string; roles: Role[] };

const CREW: Group[] = [
  {
    title: 'Dirección',
    roles: [
      { code: 'genflow-product-owner', name: 'Product Owner', tag: 'Valor · Backlog', desc: 'Prioriza por valor y traduce los servicios en historias.' },
      { code: 'genflow-scrum-master', name: 'Scrum Master', tag: 'Proceso', desc: 'Facilita ceremonias, protege el foco y gestiona impedimentos.' },
    ],
  },
  {
    title: 'Arquitectura & Fiabilidad',
    roles: [
      { code: 'genflow-arquitecto', name: 'Arquitecto / Tech Lead', tag: 'Escalabilidad', desc: 'Módulos, datos y aislamiento multi-tenant antes del código.' },
      { code: 'genflow-seguridad', name: 'Seguridad / AppSec', tag: 'Gate', desc: 'RLS con prueba negativa, secretos, headers, OWASP.' },
      { code: 'genflow-devops', name: 'DevOps / Reliability', tag: 'Vercel · CI/CD', desc: 'Entornos, pipeline, observabilidad y continuidad de Supabase.' },
    ],
  },
  {
    title: 'Producto IA & Construcción',
    roles: [
      { code: 'genflow-ai-automation', name: 'AI & Automation', tag: 'El producto', desc: 'Diseña los flujos de IA del catálogo con su métrica.' },
      { code: 'genflow-backend-api', name: 'Backend, Datos & APIs', tag: 'Supabase', desc: 'Server Actions, migraciones, RLS y contratos de integración.' },
      { code: 'genflow-frontend', name: 'Frontend / Portal', tag: 'Next.js', desc: 'UI server-first, dashboard que comunica valor en 10 s.' },
    ],
  },
  {
    title: 'Experiencia, Calidad & Entrega',
    roles: [
      { code: 'genflow-ux-ui', name: 'UX/UI & Research', tag: 'Usuario', desc: 'Personas, JTBD y journeys antes de pixeles.' },
      { code: 'genflow-qa', name: 'QA / Calidad', tag: 'Regresión', desc: 'Casos de prueba, aislamiento multi-tenant, E2E.' },
      { code: 'genflow-delivery-crm', name: 'Delivery & CRM', tag: 'Implementación', desc: 'Onboarding, playbooks por servicio, salud del cliente.' },
    ],
  },
];

const CULTURA = [
  { icon: GraduationCap, title: 'Onboarding IA del equipo', desc: 'Ruta de formación por rol, con ejercicios sobre los flujos reales.' },
  { icon: MessagesSquare, title: 'Copiloto interno', desc: 'Asistente que responde dudas de procesos sin escalar a soporte.' },
  { icon: BookOpen, title: 'Biblioteca de prompts', desc: 'Prompts maestros documentados y versionados para todo el equipo.' },
];

export default async function AdminEquipoPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-7">
      {/* Intro */}
      <section className="bg-gradient-to-br from-[#0d1117] to-black border border-[#ccff00]/15 rounded-3xl p-8">
        <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-3 flex items-center gap-2">
          <Bot className="w-3.5 h-3.5" /> Crew IA · 11 roles
        </div>
        <h2 className="font-display text-2xl font-medium tracking-tight text-white max-w-2xl">
          El equipo de desarrollo de Genflow, en SCRUM
        </h2>
        <p className="text-sm text-zinc-400 mt-3 max-w-2xl">
          Cada rol es un subagente real de Claude Code en{' '}
          <code className="font-mono text-[#00ffcc] text-xs">.claude/agents/</code>. Invócalo por nombre
          desde el proyecto para que trabaje en su especialidad.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-zinc-300">
          <Terminal className="w-3.5 h-3.5 text-[#ccff00]" />
          usa genflow-seguridad para implementar la CSP del Sprint 0
        </div>
      </section>

      {/* Crew groups */}
      {CREW.map((group) => (
        <section key={group.title} className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400">
            {group.title}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.roles.map((r) => (
              <div key={r.code} className="bg-[#0d1117] border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-colors">
                <span className="font-mono text-[11px] text-[#00ffcc] block mb-2">{r.code}</span>
                <h3 className="font-display text-base font-medium text-white">{r.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{r.tag}</span>
                <p className="text-xs text-zinc-400 mt-2">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Cultura IA */}
      <section className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#ccff00]">
          Cultura IA · adopción
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CULTURA.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="bg-[#0d1117] border border-white/5 rounded-2xl p-5">
                <Icon className="w-5 h-5 text-[#ccff00] mb-3" />
                <h3 className="font-display text-base font-medium text-white">{c.title}</h3>
                <p className="text-xs text-zinc-400 mt-2">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
