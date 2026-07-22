'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

const INITIAL_TICKETS = [
  { id: 1, subject: 'Ajustar horario de la Secuencia Onboarding', status: 'progreso', priority: 'Media', date: '17/Jul/2026' },
  { id: 2, subject: 'Error recurrente en Recuperación de Carritos', status: 'abierto', priority: 'Alta', date: '19/Jul/2026' },
  { id: 3, subject: 'Agregar nueva plantilla a Vivid Synthesis', status: 'abierto', priority: 'Baja', date: '15/Jul/2026' },
  { id: 4, subject: 'Duda sobre facturación de OpenAI', status: 'resuelto', priority: 'Media', date: '10/Jul/2026' },
];

const TICKET_META: Record<string, { label: string; color: string; bg: string }> = {
  abierto: { label: 'Abierto', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  progreso: { label: 'En Progreso', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  resuelto: { label: 'Resuelto', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

export default function PortalSupportPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('Media');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const newT = {
      id: Date.now(),
      subject: newSubject,
      status: 'abierto',
      priority: newPriority,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setTickets([newT, ...tickets]);
    setNewSubject('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          ¿Necesitas un ajuste en tus automatizaciones o tienes un inconveniente? Crea un ticket 1:1 con tu consultor.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black py-2.5 px-5 rounded-full font-bold text-xs shadow-[0_0_18px_rgba(204,255,0,0.4)] hover:bg-[#b8e600] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nuevo Ticket
        </button>
      </div>

      {/* Tickets Table */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span>Asunto</span>
          <span>Estado</span>
          <span>Prioridad</span>
          <span>Fecha</span>
        </div>

        {tickets.map((t) => {
          const meta = TICKET_META[t.status];
          return (
            <div
              key={t.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0"
            >
              <span className="text-sm font-medium text-white">{t.subject}</span>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
              <span className="text-xs text-zinc-400">{t.priority}</span>
              <span className="text-xs text-zinc-400">{t.date}</span>
            </div>
          );
        })}
      </section>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border border-white/10 rounded-3xl p-7 w-full max-w-lg flex flex-col gap-5">
            <h3 className="text-xl font-display font-medium text-white margin-0">Crear Nuevo Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
                  Asunto / Solicitud
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Ej: Falla en envio de webhook..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
                  Prioridad
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs text-zinc-400 hover:text-white bg-transparent border border-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-black bg-[#ccff00] hover:bg-[#b8e600] cursor-pointer"
                >
                  Enviar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
