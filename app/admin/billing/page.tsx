import { Receipt, TrendingUp, Server } from 'lucide-react';

import { getAllBillingRecords, getClients, requireAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminBillingPage() {
  await requireAdmin();

  const [billing, clients] = await Promise.all([getAllBillingRecords(), getClients()]);

  const mrr = billing
    .filter((b) => b.service_type === 'Servicio Genflow')
    .reduce((s, b) => s + Number(b.monthly_cost ?? 0), 0);

  const apiSpend = billing
    .filter((b) => b.service_type !== 'Servicio Genflow')
    .reduce((s, b) => s + Number(b.monthly_cost ?? 0), 0);

  const margin = mrr - apiSpend;

  const nameById = new Map(
    clients.map((c) => [c.id, c.company ?? c.name ?? c.email ?? '—']),
  );

  // Agregado por cliente: cuánto factura Genflow vs. cuánto cuesta la infraestructura.
  const byClient = new Map<string, { name: string; servicio: number; api: number }>();
  for (const b of billing) {
    const row = byClient.get(b.client_id) ?? {
      name: nameById.get(b.client_id) ?? 'Cliente',
      servicio: 0,
      api: 0,
    };
    if (b.service_type === 'Servicio Genflow') row.servicio += Number(b.monthly_cost ?? 0);
    else row.api += Number(b.monthly_cost ?? 0);
    byClient.set(b.client_id, row);
  }
  const clientRows = [...byClient.values()].sort((a, b) => b.servicio - a.servicio);

  const summary = [
    { label: 'MRR Servicio Genflow', value: `$${mrr.toFixed(2)}`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Gasto API / Infra', value: `$${apiSpend.toFixed(2)}`, icon: Server, color: 'text-blue-400' },
    { label: 'Margen bruto', value: `$${margin.toFixed(2)}`, icon: Receipt, color: margin >= 0 ? 'text-[#ccff00]' : 'text-red-400' },
  ];

  return (
    <div className="flex flex-col gap-7">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
              <Icon className={`w-6 h-6 ${s.color}`} />
              <div>
                <div className={`font-display text-3xl font-medium tracking-tight ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-purple-400 mb-4 flex items-center gap-2">
          <Receipt className="w-3.5 h-3.5" /> Desglose por cliente
        </div>

        {clientRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-zinc-500 border-b border-white/5">
                  <th className="py-3 font-medium">Cliente</th>
                  <th className="py-3 font-medium text-right">Servicio Genflow</th>
                  <th className="py-3 font-medium text-right">Costo API</th>
                  <th className="py-3 font-medium text-right">Margen</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {clientRows.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-zinc-200">{r.name}</td>
                    <td className="py-3 text-right text-green-300">${r.servicio.toFixed(2)}</td>
                    <td className="py-3 text-right text-blue-300">${r.api.toFixed(2)}</td>
                    <td className={`py-3 text-right font-medium ${r.servicio - r.api >= 0 ? 'text-[#ccff00]' : 'text-red-400'}`}>
                      ${(r.servicio - r.api).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-zinc-500 text-sm">
            Sin registros de facturación todavía.
          </div>
        )}
      </section>
    </div>
  );
}
