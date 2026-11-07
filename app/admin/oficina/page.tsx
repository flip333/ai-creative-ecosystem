import Link from 'next/link';
import {
  Bot, Users, Workflow, LifeBuoy, Sparkles, Terminal,
  CheckCircle2, Circle, Rocket, ArrowUpRight,
} from 'lucide-react';

import {
  getClients, getAllAutomations, getAllTickets, getDiagnostics, requireAdmin,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

type Agent = { code: string; name: string; focus: string };
type Desk = { area: string; agents: Agent[] };

const OFFICE: Desk[] = [
  {
    area: 'Dirección',
    agents: [
      { code: 'genflow-product-owner', name: 'Product Owner', focus: 'Backlog y valor' },
      { code: 'genflow-scrum-master', name: 'Scrum Master', focus: 'Proceso y flujo' },
    ],
  },
  {
    area: 'Arquitectura & Fiabilidad',
    agents: [
      { code: 'genflow-arquitecto', name: 'Arquitecto', focus: 'Escalabilidad' },
      { code: 'genflow-seguridad', name: 'Seguridad', focus: 'RLS y hardening' },
      { code: 'genflow-devops', name: 'DevOps', focus: 'Vercel y CI/CD' },
    ],
  },
  {
    area: 'Producto IA & Construcción',
    agents: [
      { code: 'genflow-ai-automation', name: 'AI & Automation', focus: 'Flujos de IA' },
      { code: 'genflow-backend-api', name: 'Backend & APIs', focus: 'Supabase y contratos' },
      { code: 'genflow-frontend', name: 'Frontend', focus: 'Portal y dashboard' },
    ],
  },
  {
    area: 'Experiencia, Calidad & Entrega',
    agents: [
      { code: 'genflow-ux-ui', name: 'UX/UI', focus: 'Research y diseño' },
      { code: 'genflow-qa', name: 'QA', focus: 'Pruebas y regresión' },
      { code: 'genflow-delivery-crm', name: 'Delivery & CRM', focus: 'Implementación' },
    ],
  },
];

export default async function AdminOficinaPage() {
  await requireAdmin();

  const [clients, automations, tickets, leads] = await Promise.all([
    getClients(), getAllAutomations(), getAllTickets(), getDiagnostics(),
  ]);

  const activeFlows = automations.filter((a) => a.status === 'activo').length;
  const erroredFlows = automations.filter((a) => a.status === 'error').length;
  const openTickets = tickets.filter((t) => t.status === 'abierto').length;
  const newLeads = leads.filter((l) => l.status === 'nuevo').length;

  const live = [
    { label: 'Clientes', value: clients.length, href: '/admin/clients', icon: Users },
    { label: 'Flujos activos', value: activeFlows, href: '/admin/flows', icon: Workflow },
    { label: 'Flujos en error', value: erroredFlows, href: '/admin/flows', icon: Workflow, alert: erroredFlows > 0 },
    { label: 'Tickets abiertos', value: openTickets, href: '/admin/tickets', icon: LifeBuoy, alert: openTickets > 0 },
    { label: 'Leads nuevos', value: newLeads, href: '/admin/leads', icon: Sparkles },
  ];

  // Readiness de lanzamiento: lo derivable del estado real + hitos conocidos.
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const readiness = [
    { label: 'Backend Supabase conectado', done: true },
    { label: 'Schema y RLS aplicados', done: true },
    { label: 'Usuario admin configurado', done: true },
    { label: 'Headers de seguridad (Fase 0)', done: true },
    { label: 'Service role key (invitar clientes)', done: hasServiceRole },
    { label: 'Primer cliente dado de alta', done: clients.length > 0 },
    { label: 'Primer flujo desplegado', done: automations.length > 0 },
    { label: 'Contrato de ejecuciones (webhook→logs)', done: false },
    { label: 'Pagos integrados', done: false },
    { label: 'Dominio en producción', done: false },
  ];
  const doneCount = readiness.filter((r) => r.done).length;
  const pct = Math.round((doneCount / readiness.length) * 100);

  return (
    <div className="flex flex-col gap-7">
      {/* Oficina animada del Crew (kit isométrico, Canvas 2D, estética verde neón) */}
      <section className="rounded-3xl border border-[#ccff00]/20 overflow-hidden bg-[#06080f] shadow-[0_0_40px_rgba(204,255,0,0.08)]">
        <iframe
          src="/oficina-crew/index.html"
          title="Oficina del Crew IA de Genflow"
          className="w-full block"
          style={{ height: 620, border: 0 }}
        />
      </section>

      {/* Hero / estado de la oficina */}
      <section className="bg-gradient-to-br from-[#0d1117] to-black border border-[#ccff00]/15 rounded-3xl p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-3 flex items-center gap-2">
              <Bot className="w-3.5 h-3.5" /> Oficina del Crew · 11 agentes en turno
            </div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-white max-w-xl">
              El equipo está en la oficina. Aquí se corre todo el sistema.
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Estado real del ecosistema, el equipo disponible y el camino a lanzamiento, en un solo lugar.
            </p>
          </div>
          {/* Launch readiness ring */}
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ccff00" strokeWidth="3"
                  strokeDasharray={`${(pct / 100) * 97.4} 97.4`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-semibold text-[#ccff00]">
                {pct}%
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Listo para lanzar</div>
              <div className="text-sm text-white mt-1">{doneCount} de {readiness.length} hitos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Estado en vivo */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {live.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}
              className={`bg-[#0d1117] border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${s.alert ? 'border-red-500/30 hover:border-red-500/50' : 'border-white/5 hover:border-purple-500/30'}`}>
              <Icon className={`w-5 h-5 ${s.alert ? 'text-red-400' : 'text-purple-400'}`} />
              <div>
                <div className={`font-display text-2xl font-medium tracking-tight ${s.alert ? 'text-red-400' : 'text-white'}`}>{s.value}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{s.label}</div>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* El equipo en la oficina */}
        <section className="lg:col-span-2 bg-[#0d1117] border border-white/5 rounded-3xl p-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-purple-400 mb-5 flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" /> Equipo en turno
          </div>
          <div className="flex flex-col gap-5">
            {OFFICE.map((desk) => (
              <div key={desk.area}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-2">{desk.area}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {desk.agents.map((a) => (
                    <div key={a.code} className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl p-3">
                      <div className="relative w-9 h-9 shrink-0 rounded-lg bg-purple-500/15 border border-purple-500/30 grid place-items-center">
                        <Bot className="w-4 h-4 text-purple-300" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ccff00] border-2 border-[#0d1117]" title="Disponible" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{a.name}</div>
                        <div className="font-mono text-[10px] text-[#00ffcc] truncate">{a.code}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{a.focus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-zinc-300">
            <Terminal className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
            usa genflow-&lt;rol&gt; para ponerlo a trabajar en su historia
          </div>
        </section>

        {/* Readiness + accesos */}
        <section className="flex flex-col gap-5">
          <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
            <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-4 flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5" /> Camino a lanzamiento
            </div>
            <div className="flex flex-col gap-2.5">
              {readiness.map((r) => {
                const Icon = r.done ? CheckCircle2 : Circle;
                return (
                  <div key={r.label} className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${r.done ? 'text-[#ccff00]' : 'text-zinc-600'}`} />
                    <span className={`text-xs ${r.done ? 'text-zinc-300' : 'text-zinc-500'}`}>{r.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
            <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-4">Correr el sistema</div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Centro de Mando', href: '/admin/dashboard' },
                { label: 'CRM de Clientes', href: '/admin/clients' },
                { label: 'Flujos del Ecosistema', href: '/admin/flows' },
                { label: 'Pipeline de Leads', href: '/admin/leads' },
                { label: 'Facturación', href: '/admin/billing' },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-300 hover:border-purple-500/30 hover:text-white transition-colors">
                  {l.label}
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
