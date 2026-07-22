'use client';

import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';

const TICKET_META: Record<string, { label: string; color: string; bg: string }> = {
  abierto:  { label: 'Abierto',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  progreso: { label: 'En Progreso', color: '#eab308', bg: 'rgba(234,179,8,0.12)'  },
  resuelto: { label: 'Resuelto',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
};

const PRIORITY_COLOR: Record<string, string> = {
  Alta:  'text-red-400',
  Media: 'text-yellow-400',
  Baja:  'text-zinc-400',
};

const INITIAL_TICKETS = [
  {
    id: 1,
    client: 'Camila Arango',
    company: 'TechVentures SA',
    avatar: 'CA',
    subject: 'Ajustar horario de la Secuencia Onboarding',
    status: 'progreso',
    priority: 'Media',
    date: '17/Jul/2026',
    message: 'Necesito que el flujo de onboarding se ejecute a las 10am en lugar de las 8am por zona horaria del equipo.',
  },
  {
    id: 2,
    client: 'InnovaLab Colombia',
    company: 'InnovaLab Colombia',
    avatar: 'SL',
    subject: 'Error recurrente en Recuperación de Carritos',
    status: 'abierto',
    priority: 'Alta',
    date: '19/Jul/2026',
    message: 'El webhook de Klaviyo está fallando con código 401. Adjunto logs del sistema.',
  },
  {
    id: 3,
    client: 'María F. Ruiz',
    company: 'Ecosistema Digital MFR',
    avatar: 'MF',
    subject: 'Agregar nueva plantilla a Vivid Synthesis',
    status: 'abierto',
    priority: 'Baja',
    date: '15/Jul/2026',
    message: 'Me gustaría añadir una plantilla nueva para stories de Instagram con el formato vertical.',
  },
  {
    id: 4,
    client: 'Camila Arango',
    company: 'TechVentures SA',
    avatar: 'CA',
    subject: 'Duda sobre facturación de OpenAI',
    status: 'resuelto',
    priority: 'Media',
    date: '10/Jul/2026',
    message: 'Quiero entender cómo se calculan los costos de tokens en el reporte mensual.',
  },
];

type Ticket = typeof INITIAL_TICKETS[number];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filtered = tickets.filter(t => statusFilter === 'todos' || t.status === statusFilter);

  const handleResolve = (id: number) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resuelto' } : t));
    if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status: 'resuelto' } : null);
  };

  const handleProgress = (id: number) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'progreso' } : t));
    if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status: 'progreso' } : null);
  };

  const openCount = tickets.filter(t => t.status === 'abierto').length;
  const resolvedCount = tickets.filter(t => t.status === 'resuelto').length;
  const inProgressCount = tickets.filter(t => t.status === 'progreso').length;

  return (
    <div className="flex flex-col gap-7">
      {/* Stats */}
      <section className="grid grid-cols-3 gap-5">
        {[
          { icon: AlertCircle, label: 'Abiertos', value: openCount, color: 'text-red-400' },
          { icon: Clock,       label: 'En Progreso', value: inProgressCount, color: 'text-yellow-400' },
          { icon: CheckCircle2, label: 'Resueltos este mes', value: resolvedCount, color: 'text-green-400' },
        ].map((s, idx) => {
          const SIcon = s.icon;
          return (
            <div key={idx} className="bg-[#0d1117] border border-white/5 rounded-3xl p-5 flex items-center gap-4">
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

      {/* Filter */}
      <div className="flex items-center gap-3">
        {['todos', 'abierto', 'progreso', 'resuelto'].map(f => (
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
          <div className="p-12 text-center text-zinc-500 text-sm">No hay tickets con este filtro.</div>
        )}

        {filtered.map((t) => {
          const meta = TICKET_META[t.status];
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 pr-4">
                <MessageSquare className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-sm font-medium text-white truncate">{t.subject}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[9px] font-bold text-purple-300">
                  {t.avatar}
                </div>
                <span className="text-xs text-zinc-400 truncate">{t.client}</span>
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
                    onClick={() => handleResolve(t.id)}
                    title="Marcar como resuelto"
                    className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {t.status === 'abierto' && (
                  <button
                    onClick={() => handleProgress(t.id)}
                    title="Marcar en progreso"
                    className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 flex items-center justify-center cursor-pointer transition-colors"
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
      {selectedTicket && (
        <>
          <div
            onClick={() => setSelectedTicket(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 bottom-0 w-[440px] max-w-[90vw] bg-[#0d1117] border-l border-purple-500/20 shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-purple-400">
                    Detalle del Ticket #{selectedTicket.id}
                  </span>
                  <h3 className="text-base font-semibold text-white leading-tight">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] font-bold text-purple-300">
                      {selectedTicket.avatar}
                    </div>
                    <span className="text-xs text-zinc-400">{selectedTicket.client} — {selectedTicket.company}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {/* Client message */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Mensaje del cliente</span>
                  <span className="text-xs text-zinc-500 ml-auto">{selectedTicket.date}</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{selectedTicket.message}</p>
              </div>

              {/* Priority/Status tags */}
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: TICKET_META[selectedTicket.status].bg,
                    color: TICKET_META[selectedTicket.status].color,
                  }}
                >
                  {TICKET_META[selectedTicket.status].label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/5 ${PRIORITY_COLOR[selectedTicket.priority]}`}>
                  Prioridad {selectedTicket.priority}
                </span>
              </div>

              {/* Reply input */}
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-zinc-500 mb-2">
                  Responder al cliente
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all resize-none placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-6 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={() => {
                  if (!reply.trim()) return;
                  alert(`Respuesta enviada a ${selectedTicket.client}: "${reply}"`);
                  setReply('');
                }}
                disabled={!reply.trim()}
                className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Enviar respuesta por correo
              </button>
              <div className="flex gap-2">
                {selectedTicket.status !== 'resuelto' && (
                  <button
                    onClick={() => handleResolve(selectedTicket.id)}
                    className="flex-1 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Marcar resuelto
                  </button>
                )}
                {selectedTicket.status === 'abierto' && (
                  <button
                    onClick={() => handleProgress(selectedTicket.id)}
                    className="flex-1 py-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    En progreso
                  </button>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
