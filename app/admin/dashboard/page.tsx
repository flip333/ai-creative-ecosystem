import Link from 'next/link';
import { Users, Workflow, DollarSign, Activity, AlertCircle } from 'lucide-react';

import {
  getAllAutomations,
  getAllBillingRecords,
  getAllTickets,
  getClients,
  requireAdmin,
} from '@/lib/queries';
import { formatRelative } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [clients, automations, tickets, billing] = await Promise.all([
    getClients(),
    getAllAutomations(),
    getAllTickets(),
    getAllBillingRecords(),
  ]);

  const activeClients = clients.filter((c) => c.status === 'activo').length;
  const activeFlows = automations.filter((a) => a.status === 'activo').length;
  const erroredFlows = automations.filter((a) => a.status === 'error').length;

  // MRR = todo lo facturado como servicio Genflow; el resto es infraestructura.
  const mrr = billing
    .filter((b) => b.service_type === 'Servicio Genflow')
    .reduce((sum, b) => sum + Number(b.monthly_cost ?? 0), 0);

  const apiSpend = billing
    .filter((b) => b.service_type !== 'Servicio Genflow')
    .reduce((sum, b) => sum + Number(b.monthly_cost ?? 0), 0);

  const uptime =
    automations.length > 0
      ? Math.round(((automations.length - erroredFlows) / automations.length) * 100)
      : 100;

  const stats = [
    {
      title: 'Clientes Activos',
      value: String(activeClients),
      change: `${clients.length} en total`,
      icon: Users,
      color: 'text-purple-400',
    },
    {
      title: 'Automatizaciones Desplegadas',
      value: String(automations.length),
      change: `${uptime}% uptime`,
      icon: Workflow,
      color: 'text-[#ccff00]',
    },
    {
      title: 'MRR Servicio Genflow',
      value: `$${mrr.toFixed(2)}`,
      change: 'Base recurrente',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      title: 'Gasto API Consolidado',
      value: `$${apiSpend.toFixed(2)}`,
      change: 'Costos infraestructura',
      icon: Activity,
      color: 'text-blue-400',
    },
  ];

  // Feed derivado del estado real: flujos rotos primero, luego tickets abiertos,
  // luego altas recientes de clientes.
  const events = [
    ...automations
      .filter((a) => a.status === 'error')
      .map((a) => ({
        message: `Automatización "${a.name}" está en estado Error`,
        time: formatRelative(a.updated_at),
        href: '/admin/clients',
      })),
    ...tickets
      .filter((t) => t.status === 'abierto')
      .map((t) => ({
        message: `Ticket abierto por ${t.profiles?.company ?? t.profiles?.name ?? 'un cliente'}: ${t.subject}`,
        time: formatRelative(t.created_at),
        href: '/admin/tickets',
      })),
    ...clients.slice(0, 3).map((c) => ({
      message: `Cliente registrado: ${c.company ?? '—'} (${c.name ?? c.email})`,
      time: formatRelative(c.created_at),
      href: '/admin/clients',
    })),
  ].slice(0, 8);

  return (
    <div className="flex flex-col gap-7">
      {/* Top Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="font-display text-3xl font-medium text-white tracking-tight">
                  {stat.value}
                </div>
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
          {events.length > 0 ? (
            events.map((evt, idx) => (
              <Link
                key={idx}
                href={evt.href}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-colors"
              >
                <span className="text-sm text-zinc-200">{evt.message}</span>
                <span className="font-mono text-xs text-zinc-500 shrink-0">{evt.time}</span>
              </Link>
            ))
          ) : (
            <div className="py-6 text-zinc-500 text-xs">
              Sin actividad todavía. Invita a tu primer cliente desde{' '}
              <Link href="/admin/clients" className="text-purple-400 hover:underline">
                Clientes
              </Link>
              .
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
            Flujos activos
          </div>
          <div className="font-display text-3xl text-white">{activeFlows}</div>
        </div>
        <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
            Flujos en error
          </div>
          <div className="font-display text-3xl text-red-400">{erroredFlows}</div>
        </div>
        <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
          <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
            Tickets abiertos
          </div>
          <div className="font-display text-3xl text-yellow-400">
            {tickets.filter((t) => t.status === 'abierto').length}
          </div>
        </div>
      </section>
    </div>
  );
}
