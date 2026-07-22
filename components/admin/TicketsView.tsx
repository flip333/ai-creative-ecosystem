'use client';

import { useState, useTransition } from 'react';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';

import { replyToTicket, setTicketStatus } from '@/app/admin/actions';
import { formatDate, initialsOf } from '@/lib/format';
import type { TicketStatus, TicketWithClient } from '@/lib/types';

const TICKET_META: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  abierto: { label: 'Abierto', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  progreso: { label: 'En Progreso', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  resuelto: { label: 'Resuelto', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

const PRIORITY_COLOR: Record<string, string> = {
  Alta: 'text-red-400',
  Media: 'text-yellow-400',
  Baja: 'text-zinc-400',
};

export function TicketsView({ tickets }: { tickets: TicketWithClient[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = tickets.filter((t) => statusFilter === 'todos' || t.status === statusFilter);
  const selected = tickets.find((t) => t.id === selectedId) ?? null;

  const openCount = tickets.filter((t) => t.status === 'abierto').length;
  const inProgressCount = tickets.filter((t) => t.status === 'progreso').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resuelto').length;

  const changeStatus = (id: string, status: TicketStatus) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await setTicketStatus(id, status);
      if (result?.error) setFeedback({ ok: false, text: result.error });
    });
  };

  const sendReply = (formData: FormData) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await replyToTicket(formData);
      if (result?.error) setFeedback({ ok: false, text: result.error });
      else {
        setFeedback({ ok: true, text: result?.message ?? 'Respuesta enviada.' });
        setSelectedId(null);
      }
    });
  };

  const clientName = (t: TicketWithClient) =>
    t.profiles?.name ?? t.profiles?.email ?? 'Cliente';

  return (
    <div className="flex flex-col gap-7">
      {/* Stats */}
      <section className="grid grid-cols-3 gap-5">
        {[
          { icon: AlertCircle, label: 'Abiertos', value: openCount, color: 'text-red-400' },
          { icon: Clock, label: 'En Progreso', value: inProgressCount, color: 'text-yellow-400' },
          {
            icon: CheckCircle2,
            label: 'Resueltos',
            value: resolvedCount,
            color: 'text-green-400',
          },
        ].map((s, idx) => {
          const SIcon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d1117] border border-white/5 rounded-3xl p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center">
                <SIcon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className="font-display text-2xl font-medium text-white">{s.value}</div>
                <div className="text-xs text-zinc-500">{s.label}</div>
              </div>
            </div>
          );
        })}
      </section>

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

      {/* Filter */}
      <div className="flex items-center gap-3">
        {(['todos', 'abierto', 'progreso', 'resuelto'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === f
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            {f === 'todos' ? 'Todos' : TICKET_META[f].label}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span>Ticket</span>
          <span>Cliente</span>
          <span>Estado</span>
          <span>Prioridad</span>
          <span>Acción</span>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-zinc-500 text-sm">
            {tickets.length === 0
              ? 'No hay tickets en el sistema.'
              : 'No hay tickets con este filtro.'}
          </div>
        )}

        {filtered.map((t) => {
          const meta = TICKET_META[t.status];
          const name = clientName(t);

          return (
            <div
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 pr-4">
                <MessageSquare className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-sm font-medium text-white truncate">{t.subject}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[9px] font-bold text-purple-300 shrink-0">
                  {t.profiles?.avatar_initials ?? initialsOf(name)}
                </div>
                <span className="text-xs text-zinc-400 truncate">{name}</span>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
              <span className={`text-xs font-semibold ${PRIORITY_COLOR[t.priority]}`}>
                {t.priority}
              </span>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {t.status !== 'resuelto' && (
                  <button
                    onClick={() => changeStatus(t.id, 'resuelto')}
                    disabled={isPending}
                    title="Marcar como resuelto"
                    className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 disabled:opacity-40 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {t.status === 'abierto' && (
                  <button
                    onClick={() => changeStatus(t.id, 'progreso')}
                    disabled={isPending}
                    title="Marcar en progreso"
                    className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-40 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Ticket Reply Panel */}
      {selected && (
        <>
          <div
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 bottom-0 w-[440px] max-w-[90vw] bg-[#0d1117] border-l border-purple-500/20 shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-purple-400">
                    Detalle del Ticket
                  </span>
                  <h3 className="text-base font-semibold text-white leading-tight">
                    {selected.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] font-bold text-purple-300">
                      {selected.profiles?.avatar_initials ?? initialsOf(clientName(selected))}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {clientName(selected)}
                      {selected.profiles?.company ? ` — ${selected.profiles.company}` : ''}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            <form
              action={sendReply}
              className="flex-1 flex flex-col min-h-0"
            >
              <input type="hidden" name="id" value={selected.id} />

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                      Mensaje del cliente
                    </span>
                    <span className="text-xs text-zinc-500 ml-auto">
                      {formatDate(selected.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {selected.message || 'El cliente no añadió detalle.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: TICKET_META[selected.status].bg,
                      color: TICKET_META[selected.status].color,
                    }}
                  >
                    {TICKET_META[selected.status].label}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/5 ${
                      PRIORITY_COLOR[selected.priority]
                    }`}
                  >
                    Prioridad {selected.priority}
                  </span>
                </div>

                {selected.admin_reply && (
                  <div className="bg-[#ccff00]/5 border-l-2 border-[#ccff00]/40 rounded-r-xl px-4 py-3">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-1.5">
                      Respuesta actual · {formatDate(selected.replied_at)}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selected.admin_reply}
                    </p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reply"
                    className="block text-xs font-mono tracking-widest uppercase text-zinc-500 mb-2"
                  >
                    Responder al cliente
                  </label>
                  <textarea
                    id="reply"
                    name="reply"
                    required
                    rows={5}
                    defaultValue={selected.admin_reply ?? ''}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all resize-none placeholder:text-zinc-600"
                  />
                  <p className="text-[10px] text-zinc-600 mt-2">
                    La respuesta se publica en el portal del cliente. El envío por correo
                    requiere configurar un proveedor de email.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isPending ? 'Publicando...' : 'Publicar respuesta'}
                </button>

                <div className="flex gap-2">
                  {selected.status !== 'resuelto' && (
                    <button
                      type="button"
                      onClick={() => changeStatus(selected.id, 'resuelto')}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 disabled:opacity-40 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Marcar resuelto
                    </button>
                  )}
                  {selected.status === 'abierto' && (
                    <button
                      type="button"
                      onClick={() => changeStatus(selected.id, 'progreso')}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-40 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      En progreso
                    </button>
                  )}
                </div>
              </div>
            </form>
          </aside>
        </>
      )}
    </div>
  );
}
