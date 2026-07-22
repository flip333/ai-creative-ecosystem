'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Workflow,
  Clock,
  Database,
  Search,
  Plus,
  ExternalLink,
  X,
  Play,
  Pause,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';

import { flowIcon } from './flowIcons';
import { toggleAutomationStatus } from '@/app/portal/flows/actions';
import { FLAT_SPARKLINE, formatLogTime, formatMonthlyCost, formatRelative } from '@/lib/format';
import type { AutomationWithLogs, FlowStatus } from '@/lib/types';

const STATUS_META: Record<FlowStatus, { label: string; color: string; bg: string }> = {
  activo: { label: 'Activo', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  pausa: { label: 'En Pausa', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  error: { label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export function FlowsView({
  automations,
  hoursSaved,
}: {
  automations: AutomationWithLogs[];
  hoursSaved: number;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [areaFilter, setAreaFilter] = useState('todas');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeCount = automations.filter((a) => a.status === 'activo').length;
  const totalCost = automations.reduce((sum, a) => sum + Number(a.monthly_cost ?? 0), 0);

  const filteredRows = automations.filter((a) => {
    const term = searchTerm.trim().toLowerCase();
    if (
      term &&
      !(a.name.toLowerCase().includes(term) || (a.stack ?? '').toLowerCase().includes(term))
    ) {
      return false;
    }
    if (statusFilter !== 'todos' && a.status !== statusFilter) return false;
    if (areaFilter !== 'todas' && a.area !== areaFilter) return false;
    return true;
  });

  const selectedRow = automations.find((a) => a.id === selectedId);

  const handleToggle = (row: AutomationWithLogs) => {
    setNotice(null);
    startTransition(async () => {
      const result = await toggleAutomationStatus(row.id, row.status);
      if (result?.error) setNotice(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-7">
      {/* KPIs Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">
              de {automations.length}
            </span>
          </div>
          <div>
            <div className="font-display text-4xl font-medium text-white tracking-tight">
              {activeCount}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Automatizaciones Activas</div>
          </div>
        </div>

        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">/ mes</span>
          </div>
          <div>
            <div className="font-display text-4xl font-medium text-white tracking-tight">
              {hoursSaved}h
            </div>
            <div className="text-xs text-zinc-400 mt-1">Horas Ahorradas (Mes)</div>
          </div>
        </div>

        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">/ mes</span>
          </div>
          <div>
            <div className="font-display text-4xl font-medium text-white tracking-tight">
              ${totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Gasto en Infraestructura (APIs)</div>
          </div>
        </div>
      </section>

      {notice && (
        <div className="bg-[#ccff00]/10 border border-[#ccff00]/25 text-[#ccff00] text-xs font-medium px-5 py-3.5 rounded-2xl">
          {notice}
        </div>
      )}

      {/* Filter and Action Bar */}
      <section className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar flujo o integración..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-300 text-xs outline-none focus:border-[#ccff00]/50"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pausa">En Pausa</option>
          <option value="error">Error</option>
        </select>

        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-300 text-xs outline-none focus:border-[#ccff00]/50"
        >
          <option value="todas">Todas las áreas</option>
          <option value="marketing">Marketing</option>
          <option value="ventas">Ventas</option>
          <option value="operaciones">Operaciones</option>
          <option value="soporte">Soporte</option>
        </select>

        <div className="flex-1" />

        <Link
          href="/portal/support"
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black py-2.5 px-5 rounded-full font-bold text-xs shadow-[0_0_18px_rgba(204,255,0,0.4)] hover:bg-[#b8e600] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Solicitar nueva automatización
        </Link>
      </section>

      {/* Table */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[2.4fr_1fr_1fr_0.8fr_1fr_1.3fr] px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span>Función</span>
          <span>Status</span>
          <span>Actualizado</span>
          <span>Docs</span>
          <span>Costo</span>
          <span>Resultados</span>
        </div>

        {automations.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            Aún no tienes automatizaciones desplegadas.
            <br />
            <Link href="/portal/support" className="text-[#ccff00] hover:underline">
              Solicita la primera a tu consultor Genflow.
            </Link>
          </div>
        ) : filteredRows.length > 0 ? (
          filteredRows.map((row) => {
            const meta = STATUS_META[row.status];
            const isError = row.status === 'error';

            return (
              <div
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                className="grid grid-cols-[2.4fr_1fr_1fr_0.8fr_1fr_1.3fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col gap-0.5 pr-3">
                  <span className="text-sm font-semibold text-white">{row.name}</span>
                  <span className="text-xs text-zinc-500">{row.stack}</span>
                </div>

                <div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                  </span>
                </div>

                <span className="text-xs text-zinc-400">{formatRelative(row.updated_at)}</span>

                <div>
                  {row.documentation_url ? (
                    <a
                      href={row.documentation_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center text-zinc-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <span className="font-mono text-xs text-zinc-300">
                  {formatMonthlyCost(row.monthly_cost)}
                </span>

                <div className="flex items-center gap-3">
                  <svg width="60" height="24" viewBox="0 0 60 24" className="shrink-0">
                    <polyline
                      points={row.spark_points || FLAT_SPARKLINE}
                      fill="none"
                      stroke={isError ? '#ef4444' : '#ccff00'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`text-xs font-semibold ${isError ? 'text-red-500' : 'text-[#22c55e]'}`}
                  >
                    {row.kpi_result ?? '—'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-zinc-500 text-sm">
            No se encontraron automatizaciones con esos filtros.
          </div>
        )}
      </section>

      {/* Detail Drawer */}
      {selectedRow && (
        <>
          <div
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-fade-in"
          />

          <aside className="fixed top-0 right-0 bottom-0 w-[480px] max-w-[92vw] bg-[#0d1117] border-l border-[#ccff00]/20 shadow-2xl z-50 flex flex-col animate-slide-in">
            <div className="p-7 border-b border-white/5 flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
                  Detalle de Flujo
                </span>
                <h2 className="font-display font-medium text-xl text-white tracking-tight">
                  {selectedRow.name}
                </h2>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{
                    backgroundColor: STATUS_META[selectedRow.status].bg,
                    color: STATUS_META[selectedRow.status].color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: STATUS_META[selectedRow.status].color }}
                  />
                  {STATUS_META[selectedRow.status].label}
                </span>
              </div>

              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-7">
              {/* Nodes Pipeline */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Secuencia de Nodos
                </div>
                <div className="flex items-center gap-0 bg-[#02040a] border border-white/5 rounded-2xl p-5 overflow-x-auto">
                  {selectedRow.nodes.length > 0 ? (
                    selectedRow.nodes.map((node, idx) => {
                      const NodeIcon = flowIcon(node.icon);
                      const hasNext = idx < selectedRow.nodes.length - 1;

                      return (
                        <div key={idx} className="flex items-center shrink-0">
                          <div className="flex flex-col items-center gap-1.5 min-w-[76px]">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-[#ccff00]/20 flex items-center justify-center">
                              <NodeIcon className="w-5 h-5 text-[#ccff00]" />
                            </div>
                            <span className="text-[10px] text-zinc-400 text-center leading-tight">
                              {node.label}
                            </span>
                          </div>
                          {hasNext && <div className="w-6 h-[1px] bg-white/20 shrink-0" />}
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-zinc-500">
                      Pipeline no documentado todavía.
                    </span>
                  )}
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Últimas Ejecuciones
                </div>
                <div className="flex flex-col gap-1">
                  {selectedRow.automation_logs.length > 0 ? (
                    selectedRow.automation_logs.map((log) => {
                      const ok = log.status === 'success';
                      return (
                        <div
                          key={log.id}
                          className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-b-0"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: ok
                                ? 'rgba(34,197,94,0.12)'
                                : 'rgba(239,68,68,0.12)',
                            }}
                          >
                            {ok ? (
                              <CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-500" />
                            )}
                          </div>
                          <span className="flex-1 text-xs text-zinc-300">{log.message}</span>
                          <span className="font-mono text-[11px] text-zinc-500">
                            {formatLogTime(log.created_at)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-zinc-500 py-2">
                      Sin ejecuciones registradas.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex gap-3">
              <button
                onClick={() => handleToggle(selectedRow)}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-transparent border border-white/20 text-zinc-200 text-xs font-semibold cursor-pointer hover:bg-white/5 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {selectedRow.status === 'pausa' ? (
                  <>
                    <Play className="w-4 h-4 text-[#ccff00]" />
                    Reanudar Automatización
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pausar Automatización
                  </>
                )}
              </button>

              <Link
                href={`/portal/support?flow=${encodeURIComponent(selectedRow.name)}`}
                className="flex-1 py-3 rounded-full bg-[#ccff00] text-black font-bold text-xs cursor-pointer hover:bg-[#b8e600] transition-colors shadow-[0_0_18px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Contactar Soporte
              </Link>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
