'use client';

import { useState, useTransition } from 'react';
import {
  Workflow, CheckCircle2, PauseCircle, AlertTriangle,
  Pencil, Trash2, X,
} from 'lucide-react';

import { setAutomationStatus, deleteAutomation, updateAutomation } from '@/app/admin/actions';
import { formatRelative } from '@/lib/format';
import type { AutomationWithClient, FlowStatus } from '@/lib/types';

const STATUS_META: Record<FlowStatus, { label: string; badge: string; icon: typeof CheckCircle2 }> = {
  activo: { label: 'Activo', badge: 'bg-green-500/10 text-green-300 border-green-500/30', icon: CheckCircle2 },
  pausa: { label: 'Pausa', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', icon: PauseCircle },
  error: { label: 'Error', badge: 'bg-red-500/10 text-red-300 border-red-500/30', icon: AlertTriangle },
};

const AREA_LABEL: Record<string, string> = {
  marketing: 'Marketing', ventas: 'Ventas', operaciones: 'Operaciones', soporte: 'Soporte',
};

const inputClass =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all';
const labelClass = 'block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2';

type Feedback = { ok: boolean; text: string } | null;

export function FlowsManager({ flows }: { flows: AutomationWithClient[] }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [editing, setEditing] = useState<AutomationWithClient | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activos = flows.filter((f) => f.status === 'activo').length;
  const enError = flows.filter((f) => f.status === 'error').length;
  const costoMensual = flows.reduce((s, f) => s + Number(f.monthly_cost ?? 0), 0);

  const summary = [
    { label: 'Flujos totales', value: String(flows.length), color: 'text-white' },
    { label: 'Activos', value: String(activos), color: 'text-green-400' },
    { label: 'En error', value: String(enError), color: 'text-red-400' },
    { label: 'Costo mensual', value: `$${costoMensual.toFixed(2)}`, color: 'text-[#ccff00]' },
  ];

  const ordered = [...flows].sort((a, b) => {
    const rank = (s: FlowStatus) => (s === 'error' ? 0 : s === 'pausa' ? 1 : 2);
    return rank(a.status) - rank(b.status);
  });

  const changeStatus = (id: string, status: FlowStatus) => {
    setFeedback(null);
    startTransition(async () => {
      const r = await setAutomationStatus(id, status);
      setFeedback(r?.error ? { ok: false, text: r.error } : { ok: true, text: r?.message ?? 'Listo.' });
    });
  };

  const remove = (id: string) => {
    setFeedback(null);
    startTransition(async () => {
      const r = await deleteAutomation(id);
      setConfirmId(null);
      setFeedback(r?.error ? { ok: false, text: r.error } : { ok: true, text: r?.message ?? 'Eliminado.' });
    });
  };

  const saveEdit = (fd: FormData) => {
    setFeedback(null);
    startTransition(async () => {
      const r = await updateAutomation(fd);
      if (r?.error) {
        setFeedback({ ok: false, text: r.error });
      } else {
        setEditing(null);
        setFeedback({ ok: true, text: r?.message ?? 'Flujo actualizado.' });
      }
    });
  };

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

      {feedback && (
        <div className={`text-xs font-medium px-5 py-3.5 rounded-2xl border ${
          feedback.ok ? 'bg-[#ccff00]/10 border-[#ccff00]/25 text-[#ccff00]' : 'bg-red-500/10 border-red-500/25 text-red-400'
        }`}>
          {feedback.text}
        </div>
      )}

      <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-purple-400 mb-4 flex items-center gap-2">
          <Workflow className="w-3.5 h-3.5" /> Gestión de flujos del ecosistema
        </div>

        {ordered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {ordered.map((flow) => {
              const meta = STATUS_META[flow.status];
              const Icon = meta.icon;
              return (
                <div key={flow.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{flow.name}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.badge}`}>
                        <Icon className="w-3 h-3" /> {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 flex-wrap">
                      <span className="text-purple-300">{flow.profiles?.company ?? flow.profiles?.name ?? 'Sin cliente'}</span>
                      {flow.area && <span className="text-zinc-500">{AREA_LABEL[flow.area] ?? flow.area}</span>}
                      {flow.stack && <span className="font-mono text-zinc-600">{flow.stack}</span>}
                      <span className="font-mono text-zinc-600">{formatRelative(flow.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      aria-label="Estado del flujo"
                      value={flow.status}
                      disabled={isPending}
                      onChange={(e) => changeStatus(flow.id, e.target.value as FlowStatus)}
                      className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500/60 cursor-pointer disabled:opacity-50"
                    >
                      <option value="activo">Activo</option>
                      <option value="pausa">Pausa</option>
                      <option value="error">Error</option>
                    </select>

                    <button
                      onClick={() => setEditing(flow)}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors cursor-pointer"
                      title="Editar flujo"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {confirmId === flow.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => remove(flow.id)}
                          disabled={isPending}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-2.5 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white text-xs cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(flow.id)}
                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
                        title="Eliminar flujo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-zinc-500 text-sm">
            Aún no hay flujos. Asígnalos a cada cliente desde el CRM de Clientes.
          </div>
        )}
      </section>

      {/* Modal de edición */}
      {editing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-purple-500/20 rounded-3xl p-8 w-full max-w-lg flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-display font-medium text-white">Editar flujo</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {editing.profiles?.company ?? editing.profiles?.name ?? 'Sin cliente'}
                </p>
              </div>
              <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form action={saveEdit} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={editing.id} />
              <div>
                <label className={labelClass} htmlFor="e-name">Nombre del flujo</label>
                <input id="e-name" name="name" required defaultValue={editing.name} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="e-stack">Stack</label>
                  <input id="e-stack" name="stack" defaultValue={editing.stack ?? ''} placeholder="N8N + GHL" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="e-area">Área</label>
                  <select id="e-area" name="area" defaultValue={editing.area ?? 'operaciones'} className={inputClass}>
                    <option value="marketing">Marketing</option>
                    <option value="ventas">Ventas</option>
                    <option value="operaciones">Operaciones</option>
                    <option value="soporte">Soporte</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="e-cost">Costo mensual (USD)</label>
                  <input id="e-cost" name="monthly_cost" type="number" step="0.01" min="0"
                    defaultValue={Number(editing.monthly_cost ?? 0)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="e-kpi">Resultado / KPI</label>
                  <input id="e-kpi" name="kpi_result" defaultValue={editing.kpi_result ?? ''} placeholder="+45 Leads" className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)}
                  className="px-5 py-2.5 rounded-full text-xs text-zinc-400 hover:text-white bg-transparent border border-white/10 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 cursor-pointer">
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
