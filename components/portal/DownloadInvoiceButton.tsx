'use client';

import { Download } from 'lucide-react';
import type { BillingRecord } from '@/lib/types';

/**
 * Genera el detalle de facturación como CSV en el navegador.
 * Se eligió CSV sobre PDF a propósito: no requiere dependencias de
 * renderizado y el cliente puede abrirlo directo en Excel/Sheets.
 */
export function DownloadInvoiceButton({
  records,
  total,
  company,
}: {
  records: BillingRecord[];
  total: number;
  company: string;
}) {
  const handleDownload = () => {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const rows = [
      ['Servicio', 'Tipo', 'Costo mensual (USD)'],
      ...records.map((r) => [
        r.service_name,
        r.service_type ?? '',
        Number(r.monthly_cost ?? 0).toFixed(2),
      ]),
      ['TOTAL', '', total.toFixed(2)],
    ];

    const csv = rows.map((row) => row.map((cell) => escape(String(cell))).join(',')).join('\r\n');

    // BOM para que Excel detecte UTF-8 y no rompa los acentos.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const month = new Date().toISOString().slice(0, 7);
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const link = document.createElement('a');
    link.href = url;
    link.download = `genflow-${slug || 'cliente'}-${month}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={records.length === 0}
      className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/10 text-zinc-200 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl py-4 px-6 text-sm font-semibold cursor-pointer transition-colors"
    >
      <Download className="w-4 h-4" />
      Descargar detalle (CSV)
    </button>
  );
}
