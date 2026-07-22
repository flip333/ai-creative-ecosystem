'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  Workflow, 
  TrendingUp,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Pause,
  Activity
} from 'lucide-react';

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  activo:   { label: 'Activo',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  onboarding: { label: 'Onboarding', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  pausado:  { label: 'Pausado',    color: '#71717a', bg: 'rgba(113,113,122,0.12)' },
};

const CLIENTS_INITIAL = [
  {
    id: 1, name: 'Camila Arango', company: 'TechVentures SA', email: 'camila@techventures.co',
    status: 'activo', plan: 'Genflow Core', flows: 5, mrr: '$242.80', roi: '+320%',
    joined: '01/Mar/2026', avatar: 'CA',
  },
  {
    id: 2, name: 'Sebastián López', company: 'InnovaLab Colombia', email: 'slopez@innovalab.co',
    status: 'activo', plan: 'Genflow Pro', flows: 8, mrr: '$390.00', roi: '+180%',
    joined: '15/Jan/2026', avatar: 'SL',
  },
  {
    id: 3, name: 'María Fernanda Ruiz', company: 'Ecosistema Digital MFR', email: 'mf@ecosistema.co',
    status: 'onboarding', plan: 'Genflow Core', flows: 2, mrr: '$120.00', roi: 'En proceso',
    joined: '10/Jul/2026', avatar: 'MF',
  },
  {
    id: 4, name: 'Andres Moreno', company: 'Logística Andina SAS', email: 'amoreno@logandina.co',
    status: 'pausado', plan: 'Genflow Core', flows: 3, mrr: '$0.00', roi: '+89%',
    joined: '05/May/2026', avatar: 'AM',
  },
];

type Client = typeof CLIENTS_INITIAL[number];

export default function AdminClientsPage() {
  const [clients, setClients] = useState(CLIENTS_INITIAL);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending invite - in production this calls Supabase Admin API
    const newClient: Client = {
      id: Date.now(),
      name: inviteName,
      company: inviteCompany,
      email: inviteEmail,
      status: 'onboarding',
      plan: 'Genflow Core',
      flows: 0,
      mrr: '$120.00',
      roi: 'Nuevo',
      joined: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatar: inviteName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    setClients([newClient, ...clients]);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      setInviteCompany('');
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            {clients.length} clientes registrados en la plataforma
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-2.5 px-5 rounded-full font-bold text-xs shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invitar nuevo cliente
        </button>
      </div>

      {/* Client Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clients.map((client) => {
          const meta = STATUS_META[client.status];
          return (
            <div
              key={client.id}
              className="bg-[#0d1117] border border-white/5 hover:border-purple-500/30 rounded-3xl p-6 flex flex-col gap-5 transition-colors group cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300 shrink-0">
                    {client.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{client.name}</div>
                    <div className="text-xs text-zinc-500">{client.company}</div>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/40 rounded-2xl p-3 text-center">
                  <Workflow className="w-3.5 h-3.5 text-[#ccff00] mx-auto mb-1" />
                  <div className="font-mono text-sm font-bold text-white">{client.flows}</div>
                  <div className="text-[10px] text-zinc-500">Flujos</div>
                </div>
                <div className="bg-black/40 rounded-2xl p-3 text-center">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400 mx-auto mb-1" />
                  <div className="font-mono text-sm font-bold text-white">{client.roi}</div>
                  <div className="text-[10px] text-zinc-500">ROI Est.</div>
                </div>
                <div className="bg-black/40 rounded-2xl p-3 text-center">
                  <Activity className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                  <div className="font-mono text-sm font-bold text-white">{client.mrr}</div>
                  <div className="text-[10px] text-zinc-500">MRR</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Mail className="w-3.5 h-3.5" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`mailto:${client.email}`); }}
                    className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#ccff00] transition-colors cursor-pointer"
                    title="Enviar email"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Más opciones"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Client Detail Side Panel */}
      {selectedClient && (
        <>
          <div
            onClick={() => setSelectedClient(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <aside className="fixed top-0 right-0 bottom-0 w-[400px] max-w-[90vw] bg-[#0d1117] border-l border-purple-500/20 shadow-2xl z-50 flex flex-col">
            <div className="p-7 border-b border-white/5 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-purple-400">
                  Perfil de Cliente
                </span>
                <h2 className="font-display text-xl font-medium text-white tracking-tight">
                  {selectedClient.name}
                </h2>
                <span className="text-xs text-zinc-400">{selectedClient.company}</span>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-6">
              {/* Plan Info */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-300 font-mono uppercase tracking-wider mb-1">Plan Actual</div>
                  <div className="text-white font-semibold text-sm">{selectedClient.plan}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 mb-1">Desde</div>
                  <div className="text-xs text-zinc-300">{selectedClient.joined}</div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Métricas del Cliente
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Automatizaciones', value: selectedClient.flows, icon: Workflow },
                    { label: 'ROI Estimado', value: selectedClient.roi, icon: TrendingUp },
                    { label: 'MRR', value: selectedClient.mrr, icon: Activity },
                    { label: 'Estado', value: STATUS_META[selectedClient.status].label, icon: AlertCircle },
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

              {/* Contact */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Contacto
                </div>
                <a
                  href={`mailto:${selectedClient.email}`}
                  className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-[#ccff00] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {selectedClient.email}
                </a>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 flex gap-3">
              <a
                href={`mailto:${selectedClient.email}`}
                className="flex-1 py-2.5 rounded-full bg-transparent border border-white/20 text-zinc-200 text-xs font-semibold cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Enviar Email
              </a>
              <button
                onClick={() => setSelectedClient(null)}
                className="flex-1 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Gestionar Plan
              </button>
            </div>
          </aside>
        </>
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
                  Se enviará un Magic Link de acceso al correo registrado.
                </p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteSent ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-14 h-14 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center">
                  <Check className="w-7 h-7 text-[#ccff00]" />
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">¡Invitación enviada!</div>
                  <div className="text-zinc-400 text-xs mt-1">El cliente recibirá el link de acceso en su correo.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Ej: Camila Arango"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteCompany}
                    onChange={(e) => setInviteCompany(e.target.value)}
                    placeholder="Ej: TechVentures SA"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
                    Correo de acceso
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="cliente@empresa.co"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/60 transition-all"
                  />
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
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Enviar invitación
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
