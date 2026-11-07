'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

// Límite de error del portal: si una consulta a Supabase falla, el cliente ve
// un estado recuperable en vez de una pantalla rota.
export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Portal error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-[#0d1117] border border-red-500/20 rounded-3xl p-10 max-w-md text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="font-display text-xl font-medium text-white">No pudimos cargar tus datos</h2>
        <p className="text-sm text-zinc-400">
          Hubo un problema al conectar con tu ecosistema. Puedes reintentar; si persiste,
          escríbele a tu consultor desde Soporte.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-bold text-xs rounded-full px-5 py-2.5 hover:brightness-110 transition-all cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
      </div>
    </div>
  );
}
