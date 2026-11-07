import { Workflow, CheckCircle2, PauseCircle, AlertTriangle } from 'lucide-react';

import { getAllAutomationsWithClient, requireAdmin } from '@/lib/queries';
import { formatRelative } from '@/lib/format';
import type { FlowStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const STATUS_META: Record<FlowStatus, { label: string; badge: string; icon: typeof CheckCircle2 }> = {
  activo: { label: 'Activo', badge: 'bg-green-500/10 text-green-300 border-green-500/30', icon: CheckCircle2 },
  pausa: { label: 'Pausa', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', icon: PauseCircle },
  error: { label: 'Error', badge: 'bg-red-500/10 text-red-300 border-red-500/30', icon: AlertTriangle },
};

const AREA_LABEL: Record<string, string> = {
  marketing: 'Marketing',
  ventas: 'Ventas',
  operaciones: 'Operaciones',
  soporte: 'Soporte',
};

export default async function AdminFlowsPage() {
  await requireAdmin();
  const flows = await getAllAutomationsWithClient();

  const activos = flows.filter((f) => f.status === 'activo').length;
  const enError = flows.filter((f) => f.status === 'error').length;
  const costoMensual = flows.reduce((s, f) => s + Number(f.monthly_cost ?? 0), 0);

  const summary = [
    { label: 'Flujos totales', value: String(flows.length), color: 'text-white' },
    { label: 'Activos', value: String(activos), color: 'text-green-400' },
    { label: 'En error', value: String(enError), color: 'text-red-400' },
    { label: 'Costo mensual', value: `$${costoMensual.toFixed(2)}`, color: 'text-[#ccff00]' },
  ];

  // Flujos en error primero: lo que necesita atención arriba.
  const ordered = [...flows].sort((a, b) => {
    const rank = (s: FlowStatus) => (s === 'error' ? 0 : s === 'pausa' ? 1 : 2);
    return rank(a.status) - rank(b.status);
  });

  return (
    <div className="flex flex-col gap-7">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {summary.map((s) => (
          <div key={s.label} className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{s.label}</span>
            <span className={`font-display text-3xl font-medium tracking-tight ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </section>

      <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-purple-400 mb-4 flex items-center gap-2">
          <Workflow className="w-3.5 h-3.5" /> Todos los flujos desplegados
        </div>

        {ordered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {ordered.map((flow) => {
              const meta = STATUS_META[flow.status];
              const Icon = meta.icon;
              return (
                <div
                  key={flow.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{flow.name}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.badge}`}>
                        <Icon className="w-3 h-3" /> {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 flex-wrap">
                      <span className="text-purple-300">
                        {flow.profiles?.company ?? flow.profiles?.name ?? 'Sin cliente'}
                      </span>
                      {flow.area && (
                        <span className="text-zinc-500">{AREA_LABEL[flow.area] ?? flow.area}</span>
                      )}
                      {flow.stack && <span className="font-mono text-zinc-600">{flow.stack}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    {flow.kpi_result && (
                      <span className="text-xs text-[#ccff00] font-medium">{flow.kpi_result}</span>
                    )}
                    <span className="font-mono text-xs text-zinc-500">
                      {formatRelative(flow.updated_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-zinc-500 text-sm">
            Aún no hay flujos desplegados. Asígnalos a cada cliente desde el CRM.
          </div>
        )}
      </section>
    </div>
  );
}
