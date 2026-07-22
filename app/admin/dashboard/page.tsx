'use client';

import { Users, Workflow, DollarSign, Activity, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Clientes Activos', value: '14', change: '+2 este mes', icon: Users, color: 'text-purple-400' },
    { title: 'Automatizaciones Desplegadas', value: '48', change: '98% uptime', icon: Workflow, color: 'text-[#ccff00]' },
    { title: 'MRR Servicio Genflow', value: '$1,680', change: 'Base recurring', icon: DollarSign, color: 'text-green-400' },
    { title: 'Gasto API Consolidado', value: '$342.80', change: 'Costos infraestructura', icon: Activity, color: 'text-blue-400' },
  ];

  const recentEvents = [
    { type: 'client', message: 'Nuevo cliente registrado: TechVentures SA (Camila Arango)', time: 'Hace 1 hora' },
    { type: 'flow', message: 'Automatización "Recuperación de Carritos" entró en estado Error para Cliente #4', time: 'Hace 30 min' },
    { type: 'ticket', message: 'Nuevo ticket de soporte abierto por InnovaLab Colombia', time: 'Hace 2 horas' },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* Top Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{stat.change}</span>
              </div>
              <div>
                <div className="font-display text-3xl font-medium text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-zinc-400 mt-1">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* System Health / Activity Feed */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-purple-400 mb-4 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" /> Actividad Reciente del Ecosistema
        </div>

        <div className="flex flex-col gap-3">
          {recentEvents.map((evt, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-sm text-zinc-200">{evt.message}</span>
              <span className="font-mono text-xs text-zinc-500">{evt.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
