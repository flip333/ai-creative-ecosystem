'use client';

import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const docs = [
  {
    id: 1,
    name: 'Secuencia Onboarding Clientes',
    stack: 'N8N + GoHighLevel',
    area: 'ventas',
    doc: 'https://docs.genflow.ai/onboarding-clientes',
    prompt:
      'Eres un asistente experto en ventas. Ejecuta el flujo "Secuencia Onboarding Clientes" analizando el comportamiento del usuario y personalizando el mensaje de seguimiento.',
  },
  {
    id: 2,
    name: 'Generador de Contenido IA',
    stack: 'Vivid Synthesis + OpenAI',
    area: 'marketing',
    doc: 'https://docs.genflow.ai/vivid-synthesis',
    prompt:
      'Genera 5 variaciones de copy para redes sociales alineadas con el manual de marca de Genflow, enfatizando estética neón y automatización.',
  },
  {
    id: 3,
    name: 'Calificación de Leads (Scoring)',
    stack: 'N8N + HubSpot',
    area: 'ventas',
    doc: 'https://docs.genflow.ai/lead-scoring',
    prompt:
      'Evalúa los datos entrantes del formulario. Asigna un puntaje de 1 a 100 según el tamaño de la empresa y la urgencia expresada.',
  },
  {
    id: 4,
    name: 'Recuperación de Carritos',
    stack: 'Shopify + Klaviyo',
    area: 'marketing',
    doc: 'https://docs.genflow.ai/cart-recovery',
    prompt:
      'Redacta un correo persuasivo de recuperación de carrito abandonado con un incentivo dinámico según el valor total de los productos.',
  },
];

export default function PortalDocsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-zinc-400">
        Accede a las guías de uso de tus automatizaciones y a los prompts maestros optimizados para tu ecosistema.
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {docs.map((d) => (
          <div
            key={d.id}
            className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white margin-0">{d.name}</h3>
                <div className="text-xs text-zinc-500 mt-1">{d.stack}</div>
              </div>

              <a
                href={d.doc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-transparent border border-white/10 text-zinc-300 hover:text-white rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver manual
              </a>
            </div>

            <div className="bg-[#02040a] border border-white/5 rounded-2xl p-4 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9.5px] tracking-widest uppercase text-zinc-500">
                  Prompt Maestro
                </span>
                <button
                  onClick={() => copyPrompt(d.id, d.prompt)}
                  className="text-zinc-500 hover:text-[#ccff00] transition-colors p-1 cursor-pointer"
                  title="Copiar prompt"
                >
                  {copiedId === d.id ? (
                    <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <code className="font-mono text-xs text-[#ccff00] leading-relaxed block whitespace-pre-wrap">
                {d.prompt}
              </code>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
