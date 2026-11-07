'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, BookOpen } from 'lucide-react';
import type { Automation } from '@/lib/types';

const AREA_LABEL: Record<string, string> = {
  marketing: 'Marketing', ventas: 'Ventas', operaciones: 'Operaciones', soporte: 'Soporte',
};

export function DocsView({ automations }: { automations: Automation[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* algunos navegadores bloquean el portapapeles; se ignora en silencio */
    }
  };

  if (automations.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-sm text-zinc-400">
          Aquí vivirán las guías y los prompts maestros de tus automatizaciones.
        </div>
        <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
          <BookOpen className="w-7 h-7 text-zinc-600" />
          <p className="text-zinc-500 text-sm max-w-sm">
            Todavía no tienes flujos documentados. En cuanto tu consultor active tu primera
            automatización, verás aquí su manual y su prompt maestro.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-zinc-400">
        Guías de uso de tus automatizaciones y los prompts maestros optimizados para tu ecosistema.
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {automations.map((d) => (
          <div key={d.id} className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white">{d.name}</h3>
                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2 flex-wrap">
                  {d.stack && <span>{d.stack}</span>}
                  {d.area && <span className="text-zinc-600">· {AREA_LABEL[d.area] ?? d.area}</span>}
                </div>
              </div>

              {d.documentation_url && (
                <a
                  href={d.documentation_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-transparent border border-white/10 text-zinc-300 hover:text-white rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver manual
                </a>
              )}
            </div>

            {d.master_prompt ? (
              <div className="bg-[#02040a] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9.5px] tracking-widest uppercase text-zinc-500">
                    Prompt Maestro
                  </span>
                  <button
                    onClick={() => copyPrompt(d.id, d.master_prompt ?? '')}
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
                  {d.master_prompt}
                </code>
              </div>
            ) : (
              <div className="bg-[#02040a] border border-white/5 rounded-2xl p-4 text-xs text-zinc-600">
                Prompt maestro en preparación por tu consultor.
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
