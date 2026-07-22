'use client';

import { Download } from 'lucide-react';

const billingItems = [
  { name: 'GoHighLevel API & Usage', type: 'API / Herramienta', cost: '$15.00 / mes' },
  { name: 'OpenAI Token Usage (GPT-4o)', type: 'Consumo Token', cost: '$42.30 / mes' },
  { name: 'HubSpot Integration Token', type: 'API / Herramienta', cost: '$8.00 / mes' },
  { name: 'Klaviyo Email API', type: 'API / Herramienta', cost: '$22.00 / mes' },
  { name: 'Slack Bot Webhooks', type: 'API / Herramienta', cost: '$5.50 / mes' },
  { name: 'Gestión y Soporte Genflow 1:1', type: 'Servicio Genflow', cost: '$120.00 / mes' },
];

export default function PortalBillingPage() {
  const totalCost = billingItems.reduce(
    (sum, b) => sum + parseFloat(b.cost.replace(/[^0-9.]/g, '')),
    0
  );

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

        <button 
          onClick={() => alert('Descargando factura en PDF...')}
          className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/10 text-zinc-200 hover:text-white hover:bg-white/5 rounded-2xl py-4 px-6 text-sm font-semibold cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar factura (PDF)
        </button>
      </section>

      {/* Itemized Table */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr] px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span>Servicio / Consumo</span>
          <span>Tipo</span>
          <span>Costo Mensual</span>
        </div>

        {billingItems.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[2fr_1fr_1fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0"
          >
            <span className="text-sm font-medium text-white">{item.name}</span>
            <span className="text-xs text-zinc-400">{item.type}</span>
            <span className="font-mono text-xs text-zinc-300">{item.cost}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
