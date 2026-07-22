'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle, 
  Workflow, 
  BookOpen, 
  CreditCard, 
  LifeBuoy 
} from 'lucide-react';

const kpis = [
  { icon: TrendingUp, value: '+320%', label: 'ROI Estimado', delta: 'vs. inversión', deltaColor: 'text-[#22c55e]' },
  { icon: Users, value: '214', label: 'Leads Generados (Mes)', delta: '+18%', deltaColor: 'text-[#22c55e]' },
  { icon: Clock, value: '86h', label: 'Horas Ahorradas (Mes)', delta: '+14%', deltaColor: 'text-[#22c55e]' },
];

const alerts = [
  {
    title: 'Recuperación de Carritos está en Error',
    detail: 'Última falla: Hace 30 min (Error de autenticación con Klaviyo)',
    href: '/portal/flows',
  },
];

const quickLinks = [
  { icon: Workflow, label: 'Mis Automatizaciones', href: '/portal/flows' },
  { icon: BookOpen, label: 'Documentación', href: '/portal/docs' },
  { icon: CreditCard, label: 'Facturación', href: '/portal/billing' },
  { icon: LifeBuoy, label: 'Soporte', href: '/portal/support' },
];

export default function PortalHomePage() {
  return (
    <div className="flex flex-col gap-7">
      {/* KPI Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#ccff00]" />
                </div>
                <span className={`font-mono text-xs font-bold ${kpi.deltaColor}`}>{kpi.delta}</span>
              </div>
              <div>
                <div className="font-display text-4xl font-medium text-white tracking-tight">{kpi.value}</div>
                <div className="text-xs text-zinc-400 mt-1">{kpi.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* System Alerts */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-4">
          Alertas del Sistema
        </div>
        <div className="flex flex-col gap-2">
          {alerts.length > 0 ? (
            alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 py-3 border-b border-white/5 last:border-b-0"
              >
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white">{alert.title}</span>
                  <span className="text-xs text-zinc-400">{alert.detail}</span>
                </div>
                <Link
                  href={alert.href}
                  className="bg-transparent border border-white/10 text-zinc-200 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                >
                  Ver detalle
                </Link>
              </div>
            ))
          ) : (
            <div className="py-6 text-zinc-500 text-xs">Todo en orden — no hay alertas activas.</div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((q, idx) => {
          const Icon = q.icon;
          return (
            <Link
              key={idx}
              href={q.href}
              className="bg-[#0d1117] border border-white/5 hover:border-[#ccff00]/30 rounded-2xl p-5 flex flex-col gap-3 transition-colors group"
            >
              <Icon className="w-5 h-5 text-[#ccff00] transition-transform group-hover:scale-110" />
              <span className="text-sm font-semibold text-white">{q.label}</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
