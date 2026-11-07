import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Workflow,
  BookOpen,
  CreditCard,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react';

import { getAutomations, getExecutionTrend, requireProfile } from '@/lib/queries';
import { formatRelative } from '@/lib/format';
import ExecutionTrendChart from '@/components/portal/ExecutionTrendChart';

export const dynamic = 'force-dynamic';

const quickLinks = [
  { icon: Workflow, label: 'Mis Automatizaciones', href: '/portal/flows' },
  { icon: BookOpen, label: 'Documentación', href: '/portal/docs' },
  { icon: CreditCard, label: 'Facturación', href: '/portal/billing' },
  { icon: LifeBuoy, label: 'Soporte', href: '/portal/support' },
];

const TREND_DAYS = 14;

export default async function PortalHomePage() {
  const { userId, profile } = await requireProfile();
  const [automations, trend] = await Promise.all([
    getAutomations(userId),
    getExecutionTrend(userId, TREND_DAYS),
  ]);

  const total = automations.length;
  const failing = automations.filter((a) => a.status === 'error');
  const paused = automations.filter((a) => a.status === 'pausa').length;
  const running = automations.filter((a) => a.status === 'activo').length;

  const totalOk = trend.reduce((a, p) => a + p.success, 0);
  const totalErr = trend.reduce((a, p) => a + p.error, 0);
  const totalRuns = totalOk + totalErr;
  const successRate = totalRuns > 0 ? Math.round((totalOk / totalRuns) * 100) : null;

  const alerts = failing.map((a) => {
    const lastFailure = a.automation_logs.find((log) => log.status === 'error');
    return {
      id: a.id,
      title: `${a.name} está en Error`,
      detail: lastFailure
        ? `Última falla: ${formatRelative(lastFailure.created_at)}${lastFailure.message ? ` · ${lastFailure.message}` : ''}`
        : `Última actualización: ${formatRelative(a.updated_at)}`,
    };
  });

  const name = profile.name?.split(' ')[0];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Estado: ¿esto funciona? */}
      <section
        aria-labelledby="estado-titulo"
        className={`rounded-3xl border p-5 sm:p-6 backdrop-blur ${
          failing.length > 0
            ? 'bg-red-500/[0.07] border-red-400/30'
            : 'bg-[#0d1117]/70 border-[#ccff00]/15'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              failing.length > 0 ? 'bg-red-500/15' : 'bg-[#ccff00]/10'
            }`}
          >
            {failing.length > 0 ? (
              <AlertTriangle className="w-5 h-5 text-red-400" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#ccff00]" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1
              id="estado-titulo"
              className="font-display text-xl sm:text-2xl font-medium text-white tracking-tight"
            >
              {total === 0
                ? `${name ? `Hola, ${name}. ` : ''}Tu primera automatización está en camino`
                : failing.length > 0
                  ? `${failing.length} ${failing.length === 1 ? 'flujo necesita' : 'flujos necesitan'} tu atención`
                  : 'Todo funciona con normalidad'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {total === 0
                ? 'Cuando tu consultor active un flujo, verás aquí su rendimiento en tiempo real.'
                : `${running} de ${total} ${total === 1 ? 'flujo activo' : 'flujos activos'}${paused ? ` · ${paused} en pausa` : ''}${
                    successRate !== null ? ` · ${successRate}% de éxito en ${TREND_DAYS} días` : ''
                  }`}
            </p>
          </div>
        </div>

        {alerts.length > 0 && (
          <ul className="mt-4 flex flex-col divide-y divide-white/5 border-t border-white/5">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{alert.title}</div>
                  <div className="text-xs text-zinc-400 truncate">{alert.detail}</div>
                </div>
                <Link
                  href="/portal/flows"
                  className="shrink-0 border border-white/15 text-zinc-100 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#ccff00] rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                >
                  Ver detalle
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 2. KPIs: ¿cuánto me rinde? ROI protagonista */}
      <section aria-label="Resultados" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="sm:col-span-2 lg:col-span-1 bg-[#0d1117]/70 backdrop-blur border border-[#ccff00]/25 rounded-3xl p-6 flex flex-col gap-4 shadow-[0_0_40px_-18px_#ccff00]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            <TrendingUp className="w-4 h-4 text-[#ccff00]" aria-hidden="true" /> ROI estimado
          </div>
          <div className="font-display text-5xl sm:text-6xl font-semibold text-[#ccff00] tracking-tight leading-none">
            {profile.kpi_roi ?? '—'}
          </div>
          <div className="text-xs text-zinc-400">
            {profile.kpi_roi ? 'Retorno vs. tu inversión mensual' : 'Calculando — aparecerá tras tus primeras semanas'}
          </div>
        </div>

        {[
          { icon: Users, value: String(profile.kpi_leads ?? 0), label: 'Leads generados', sub: 'este mes' },
          { icon: Clock, value: `${profile.kpi_hours ?? 0}h`, label: 'Horas ahorradas', sub: 'este mes' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="bg-[#0d1117]/70 backdrop-blur border border-white/10 rounded-3xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                <Icon className="w-4 h-4 text-[#ccff00]" aria-hidden="true" /> {k.label}
              </div>
              <div className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-none">
                {k.value}
              </div>
              <div className="text-xs text-zinc-400">{k.sub}</div>
            </div>
          );
        })}
      </section>

      {/* 3. Tendencia real */}
      <section
        aria-labelledby="tendencia-titulo"
        className="bg-[#0d1117]/70 backdrop-blur border border-white/10 rounded-3xl p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
          <div>
            <h2 id="tendencia-titulo" className="font-display text-lg font-medium text-white">
              Actividad de tus automatizaciones
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Ejecuciones por día · últimos {TREND_DAYS} días</p>
          </div>
          {totalRuns > 0 && (
            <div className="text-right">
              <div className="font-display text-2xl font-semibold text-white leading-none">{totalRuns}</div>
              <div className="text-xs text-zinc-400">ejecuciones</div>
            </div>
          )}
        </div>

        {totalRuns > 0 ? (
          <ExecutionTrendChart data={trend} />
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-8 border border-dashed border-white/10 rounded-2xl">
            <svg viewBox="0 0 200 40" className="w-48 h-10" aria-hidden="true">
              <line x1="0" y1="30" x2="200" y2="30" stroke="#ccff00" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-zinc-300 max-w-sm">
              {total === 0
                ? 'Aún no tienes flujos activos. Cuando se active el primero, aquí verás cuántas veces trabaja por ti cada día.'
                : 'Tus flujos aún no registran ejecuciones en este período. Apenas corran, verás la tendencia aquí.'}
            </p>
            <Link
              href={total === 0 ? '/portal/support' : '/portal/flows'}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ccff00] hover:underline focus-visible:outline-2 focus-visible:outline-[#ccff00] rounded"
            >
              {total === 0 ? 'Hablar con mi consultor' : 'Ver mis automatizaciones'}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      {/* Accesos rápidos */}
      <nav aria-label="Accesos rápidos" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.href}
              href={q.href}
              className="bg-[#0d1117] border border-white/5 hover:border-[#ccff00]/30 focus-visible:outline-2 focus-visible:outline-[#ccff00] rounded-2xl p-5 flex flex-col gap-3 transition-colors group"
            >
              <Icon className="w-5 h-5 text-[#ccff00] transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="text-sm font-semibold text-white">{q.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
