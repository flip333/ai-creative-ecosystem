'use client';

import { useState, useTransition } from 'react';
import {
  UserPlus,
  Mail,
  Workflow,
  TrendingUp,
  ExternalLink,
  X,
  AlertCircle,
  Activity,
  Plus,
} from 'lucide-react';

import { assignAutomation, inviteClient, updateClient } from '@/app/admin/actions';
import { formatDate, formatMoney, initialsOf } from '@/lib/format';
import type { Automation, BillingRecord, ClientStatus, Profile } from '@/lib/types';

const STATUS_META: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  activo: { label: 'Activo', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  onboarding: { label: 'Onboarding', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  pausado: { label: 'Pausado', color: '#71717a', bg: 'rgba(113,113,122,0.12)' },
};

const inputClass =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all';
const labelClass =
  'block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2';

export function ClientsView({
  clients,
  automations,
  billing,
}: {
  clients: Profile[];
  automations: Automation[];
  billing: BillingRecord[];
}) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = clients.find((c) => c.id === selectedId) ?? null;

  // MRR y nº de flujos por cliente, calculados una vez por render.
  const flowCount = (id: string) => automations.filter((a) => a.client_id === id).length;
  const mrrOf = (id: string) =>
    billing
      .filter((b) => b.client_id === id)
      .reduce((sum, b) => sum + Number(b.monthly_cost ?? 0), 0);

  const runAction = (
    action: (fd: FormData) => Promise<{ ok?: true; error?: string; message?: string }>,
    formData: FormData,
    onSuccess?: () => void,
  ) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setFeedback({ ok: false, text: result.error });
      } else {
        setFeedback({ ok: true, text: result?.message ?? 'Listo.' });
        onSuccess?.();
      }
    });
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {clients.length} {clients.length === 1 ? 'cliente registrado' : 'clientes registrados'} en
          la plataforma
        </p>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-2.5 px-5 rounded-full font-bold text-xs shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invitar nuevo cliente
        </button>
      </div>

      {feedback && (
        <div
          className={`text-xs font-medium px-5 py-3.5 rounded-2xl border ${
            feedback.ok
              ? 'bg-[#ccff00]/10 border-[#ccff00]/25 text-[#ccff00]'
              : 'bg-red-500/10 border-red-500/25 text-red-400'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Client Cards Grid */}
      {clients.length === 0 ? (
        <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-12 text-center">
          <p className="text-zinc-500 text-sm">
            Todavía no hay clientes. Invita al primero para empezar.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clients.map((client) => {
            const meta = STATUS_META[client.status] ?? STATUS_META.onboarding;
            const name = client.name ?? client.email ?? 'Sin nombre';

            return (
              <div
                key={client.id}
                className="bg-[#0d1117] border border-white/5 hover:border-purple-500/30 rounded-3xl p-6 flex flex-col gap-5 transition-colors group cursor-pointer"
                onClick={() => setSelectedId(client.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300 shrink-0">
                      {client.avatar_initials ?? initialsOf(name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{name}</div>
                      <div className="text-xs text-zinc-500">{client.company ?? '—'}</div>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/40 rounded-2xl p-3 text-center">
                    <Workflow className="w-3.5 h-3.5 text-[#ccff00] mx-auto mb-1" />
                    <div className="font-mono text-sm font-bold text-white">
                      {flowCount(client.id)}
                    </div>
                    <div className="text-[10px] text-zinc-500">Flujos</div>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-3 text-center">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400 mx-auto mb-1" />
                    <div className="font-mono text-sm font-bold text-white">
                      {client.kpi_roi ?? '—'}
                    </div>
                    <div className="text-[10px] text-zinc-500">ROI Est.</div>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-3 text-center">
                    <Activity className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                    <div className="font-mono text-sm font-bold text-white">
                      {formatMoney(mrrOf(client.id))}
                    </div>
                    <div className="text-[10px] text-zinc-500">MRR</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    {client.email ?? '—'}
                  </div>
                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#ccff00] transition-colors opacity-0 group-hover:opacity-100"
                      title="Enviar email"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Client Detail Side Panel */}
      {selected && (
        <>
          <div
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 bottom-0 w-[440px] max-w-[90vw] bg-[#0d1117] border-l border-purple-500/20 shadow-2xl z-50 flex flex-col">
            <div className="p-7 border-b border-white/5 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-purple-400">
                  Perfil de Cliente
                </span>
                <h2 className="font-display text-xl font-medium text-white tracking-tight">
                  {selected.name ?? selected.email}
                </h2>
                <span className="text-xs text-zinc-400">{selected.company ?? '—'}</span>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-6">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-300 font-mono uppercase tracking-wider mb-1">
                    Plan Actual
                  </div>
                  <div className="text-white font-semibold text-sm">{selected.plan}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 mb-1">Desde</div>
                  <div className="text-xs text-zinc-300">{formatDate(selected.created_at)}</div>
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Métricas del Cliente
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Automatizaciones', value: flowCount(selected.id), icon: Workflow },
                    { label: 'ROI Estimado', value: selected.kpi_roi ?? '—', icon: TrendingUp },
                    { label: 'MRR', value: formatMoney(mrrOf(selected.id)), icon: Activity },
                    {
                      label: 'Estado',
                      value: (STATUS_META[selected.status] ?? STATUS_META.onboarding).label,
                      icon: AlertCircle,
                    },
                  ].map((m, idx) => {
                    const MIcon = m.icon;
                    return (
                      <div key={idx} className="bg-black/40 rounded-2xl p-3.5 flex flex-col gap-2">
                        <MIcon className="w-3.5 h-3.5 text-purple-400" />
                        <div className="font-mono text-sm font-bold text-white">{m.value}</div>
                        <div className="text-[10px] text-zinc-500">{m.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editable metrics */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Actualizar métricas
                </div>
                <form
                  action={(fd) => runAction(updateClient, fd)}
                  className="flex flex-col gap-3"
                >
                  <input type="hidden" name="id" value={selected.id} />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor="status">
                        Estado
                      </label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={selected.status}
                        className={inputClass}
                      >
                        <option value="activo">Activo</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="pausado">Pausado</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="plan">
                        Plan
                      </label>
                      <input
                        id="plan"
                        name="plan"
                        type="text"
                        defaultValue={selected.plan}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass} htmlFor="kpi_roi">
                        ROI
                      </label>
                      <input
                        id="kpi_roi"
                        name="kpi_roi"
                        type="text"
                        defaultValue={selected.kpi_roi ?? ''}
                        placeholder="+320%"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="kpi_leads">
                        Leads
                      </label>
                      <input
                        id="kpi_leads"
                        name="kpi_leads"
                        type="number"
                        min={0}
                        defaultValue={selected.kpi_leads ?? 0}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="kpi_hours">
                        Horas
                      </label>
                      <input
                        id="kpi_hours"
                        name="kpi_hours"
                        type="number"
                        min={0}
                        defaultValue={selected.kpi_hours ?? 0}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-1 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    {isPending ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </form>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Contacto
                </div>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-[#ccff00] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {selected.email ?? '—'}
                </a>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex gap-3">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 py-2.5 rounded-full bg-transparent border border-white/20 text-zinc-200 text-xs font-semibold cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Enviar Email
              </a>
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex-1 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Asignar flujo
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Assign Automation Modal */}
      {showAssignModal && selected && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-purple-500/20 rounded-3xl p-8 w-full max-w-lg flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-display font-medium text-white">
                  Asignar automatización
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Para {selected.name ?? selected.email}
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              action={(fd) => runAction(assignAutomation, fd, () => setShowAssignModal(false))}
              className="flex flex-col gap-4"
            >
              <input type="hidden" name="client_id" value={selected.id} />

              <div>
                <label className={labelClass} htmlFor="a-name">
                  Nombre del flujo
                </label>
                <input
                  id="a-name"
                  name="name"
                  required
                  placeholder="Ej: Secuencia Onboarding Clientes"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="a-stack">
                    Stack
                  </label>
                  <input
                    id="a-stack"
                    name="stack"
                    placeholder="N8N + GoHighLevel"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="a-area">
                    Área
                  </label>
                  <select id="a-area" name="area" defaultValue="ventas" className={inputClass}>
                    <option value="marketing">Marketing</option>
                    <option value="ventas">Ventas</option>
                    <option value="operaciones">Operaciones</option>
                    <option value="soporte">Soporte</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="a-cost">
                    Costo mensual (USD)
                  </label>
                  <input
                    id="a-cost"
                    name="monthly_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="a-kpi">
                    Resultado / KPI
                  </label>
                  <input
                    id="a-kpi"
                    name="kpi_result"
                    placeholder="+45 Leads"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="a-doc">
                  URL de documentación
                </label>
                <input
                  id="a-doc"
                  name="documentation_url"
                  type="url"
                  placeholder="https://docs.genflow.ai/..."
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs text-zinc-400 hover:text-white bg-transparent border border-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Asignando...' : 'Asignar flujo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-purple-500/20 rounded-3xl p-8 w-full max-w-lg flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-display font-medium text-white">
                  Invitar nuevo cliente
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Supabase enviará un enlace de acceso al correo registrado.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              action={(fd) => runAction(inviteClient, fd, () => setShowInviteModal(false))}
              className="flex flex-col gap-4"
            >
              <div>
                <label className={labelClass} htmlFor="i-name">
                  Nombre completo
                </label>
                <input
                  id="i-name"
                  name="name"
                  required
                  placeholder="Ej: Camila Arango"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="i-company">
                  Empresa
                </label>
                <input
                  id="i-company"
                  name="company"
                  placeholder="Ej: TechVentures SA"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="i-email">
                  Correo de acceso
                </label>
                <input
                  id="i-email"
                  name="email"
                  type="email"
                  required
                  placeholder="cliente@empresa.co"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="i-plan">
                  Plan
                </label>
                <select
                  id="i-plan"
                  name="plan"
                  defaultValue="Genflow Core"
                  className={inputClass}
                >
                  <option value="Genflow Core">Genflow Core</option>
                  <option value="Genflow Pro">Genflow Pro</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs text-zinc-400 hover:text-white bg-transparent border border-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isPending ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      Enviar invitación
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
