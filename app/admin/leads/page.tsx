import { Sparkles, Mail, Building2 } from 'lucide-react';

import { getDiagnostics, requireAdmin } from '@/lib/queries';
import { formatRelative } from '@/lib/format';
import type { DiagnosticStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const PIPELINE: { key: DiagnosticStatus; label: string; color: string }[] = [
  { key: 'nuevo', label: 'Nuevos', color: 'text-[#ccff00]' },
  { key: 'contactado', label: 'Contactados', color: 'text-blue-400' },
  { key: 'agendado', label: 'Agendados', color: 'text-purple-400' },
  { key: 'descartado', label: 'Descartados', color: 'text-zinc-500' },
];

const STATUS_BADGE: Record<DiagnosticStatus, string> = {
  nuevo: 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30',
  contactado: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  agendado: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  descartado: 'bg-white/5 text-zinc-500 border-white/10',
};

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await getDiagnostics();

  const counts = PIPELINE.map((p) => ({
    ...p,
    count: leads.filter((l) => l.status === p.key).length,
  }));

  return (
    <div className="flex flex-col gap-7">
      {/* Pipeline summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {counts.map((c) => (
          <div key={c.key} className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {c.label}
            </span>
            <span className={`font-display text-4xl font-medium tracking-tight ${c.color}`}>
              {c.count}
            </span>
          </div>
        ))}
      </section>

      {/* Leads list */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-purple-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Entradas del formulario /diagnostico
        </div>

        {leads.length > 0 ? (
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{lead.name}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${STATUS_BADGE[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400 flex-wrap">
                    <span className="flex items-center gap-1 min-w-0">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </span>
                    {lead.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {lead.company}
                      </span>
                    )}
                    {lead.role && <span className="text-zinc-500">{lead.role}</span>}
                  </div>
                  {lead.challenge && (
                    <p className="text-xs text-zinc-400 mt-2 max-w-2xl">“{lead.challenge}”</p>
                  )}
                </div>
                <span className="font-mono text-xs text-zinc-500 shrink-0">
                  {formatRelative(lead.created_at)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-zinc-500 text-sm">
            Aún no hay leads. Cuando alguien complete el formulario de{' '}
            <span className="text-[#ccff00]">/diagnostico</span>, aparecerá aquí para que lo
            conviertas en cliente.
          </div>
        )}
      </section>
    </div>
  );
}
