'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';

import { createTicket } from '@/app/portal/support/actions';
import { formatDate } from '@/lib/format';
import type { SupportTicket, TicketStatus } from '@/lib/types';

const TICKET_META: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  abierto: { label: 'Abierto', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  progreso: { label: 'En Progreso', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  resuelto: { label: 'Resuelto', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

export function SupportView({
  tickets,
  prefillFlow,
}: {
  tickets: SupportTicket[];
  prefillFlow?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createTicket(formData);
      if (result?.error) setError(result.error);
      else setShowModal(false);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          ¿Necesitas un ajuste en tus automatizaciones o tienes un inconveniente? Crea un ticket
          1:1 con tu consultor.
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

        {tickets.length > 0 ? (
          tickets.map((t) => {
            const meta = TICKET_META[t.status];
            return (
              <div key={t.id} className="border-b border-white/5 last:border-b-0">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4">
                  <span className="text-sm font-medium text-white pr-4">{t.subject}</span>
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">{t.priority}</span>
                  <span className="text-xs text-zinc-400">{formatDate(t.created_at)}</span>
                </div>

                {t.admin_reply && (
                  <div className="mx-6 mb-4 bg-[#ccff00]/5 border-l-2 border-[#ccff00]/40 rounded-r-xl px-4 py-3">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-1.5">
                      Respuesta de Genflow · {formatDate(t.replied_at)}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {t.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-zinc-500 text-sm">
            No tienes tickets abiertos. Todo funcionando.
          </div>
        )}
      </section>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-7 w-full max-w-lg flex flex-col gap-5">
            <h3 className="text-xl font-display font-medium text-white">Crear Nuevo Ticket</h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2"
                >
                  Asunto / Solicitud
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  maxLength={200}
                  defaultValue={prefillFlow ? `Consulta sobre: ${prefillFlow}` : ''}
                  placeholder="Ej: Falla en envío de webhook..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2"
                >
                  Detalle
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Cuéntanos qué está pasando..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50 resize-none placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2"
                >
                  Prioridad
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue="Media"
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
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-black bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Enviando...' : 'Enviar Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
