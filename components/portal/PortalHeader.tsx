'use client';

import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/portal/LogoutButton';

const pageTitles: Record<string, { kicker: string; title: string }> = {
  '/portal/flows': { kicker: 'Hub de Automatizaciones', title: 'Mis Automatizaciones' },
  '/portal/docs': { kicker: 'Documentación y Prompts', title: 'Centro de Documentación' },
  '/portal/billing': { kicker: 'Costos e Infraestructura', title: 'Facturación y Costos' },
  '/portal/support': { kicker: 'Soporte al Cliente', title: 'Soporte y Tickets' },
};

export function PortalHeader({
  name,
  initials,
  hasAlerts,
}: {
  name: string;
  initials: string;
  hasAlerts: boolean;
}) {
  const pathname = usePathname();

  // /portal/home saluda al usuario, así que su título se arma en runtime.
  const meta =
    pathname === '/portal/home'
      ? { kicker: 'Vista Ejecutiva', title: `Hola, ${name}` }
      : pageTitles[pathname] || { kicker: 'Portal Cliente', title: 'Ecosistema Genflow' };

  return (
    <header className="h-[80px] shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-[#02040a]/70 backdrop-blur-xl sticky top-0 z-20">
      <div>
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#ccff00] mb-1">
          {meta.kicker}
        </div>
        <h1 className="margin-0 font-display font-medium text-2xl tracking-tight text-white">
          {meta.title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <button 
          aria-label="Notificaciones"
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {hasAlerts && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
          )}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-[#ccff00]">
            {initials}
          </div>
          <span className="text-xs text-zinc-200 font-medium">{name}</span>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
