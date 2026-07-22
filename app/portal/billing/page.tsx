import { getBillingRecords, requireProfile } from '@/lib/queries';
import { formatMonthlyCost } from '@/lib/format';
import { DownloadInvoiceButton } from '@/components/portal/DownloadInvoiceButton';

export const dynamic = 'force-dynamic';

export default async function PortalBillingPage() {
  const { userId, profile } = await requireProfile();
  const records = await getBillingRecords(userId);

  const totalCost = records.reduce((sum, r) => sum + Number(r.monthly_cost ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-7 flex flex-col justify-center gap-2">
          <span className="text-xs text-zinc-400">Total facturado este mes</span>
          <span className="font-display text-4xl font-medium text-white tracking-tight">
            ${totalCost.toFixed(2)} / mes
          </span>
        </div>

        <DownloadInvoiceButton
          records={records}
          total={totalCost}
          company={profile.company ?? profile.name ?? 'Cliente Genflow'}
        />
      </section>

      {/* Itemized Table */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr] px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span>Servicio / Consumo</span>
          <span>Tipo</span>
          <span>Costo Mensual</span>
        </div>

        {records.length > 0 ? (
          records.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1fr_1fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0"
            >
              <span className="text-sm font-medium text-white">{item.service_name}</span>
              <span className="text-xs text-zinc-400">{item.service_type}</span>
              <span className="font-mono text-xs text-zinc-300">
                {formatMonthlyCost(item.monthly_cost)}
              </span>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-zinc-500 text-sm">
            Todavía no hay consumos registrados para tu cuenta.
          </div>
        )}
      </section>
    </div>
  );
}
