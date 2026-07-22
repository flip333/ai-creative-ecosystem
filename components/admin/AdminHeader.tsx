'use client';

import { Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/portal/LogoutButton';

const pageTitles: Record<string, { kicker: string; title: string }> = {
  '/admin/dashboard': { kicker: 'Panel General', title: 'Métricas de la Plataforma' },
  '/admin/clients': { kicker: 'Gestión CRM', title: 'Directorio de Clientes' },
  '/admin/tickets': { kicker: 'Atención al Cliente', title: 'Bandeja de Tickets' },
};

export function AdminHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const meta = pageTitles[pathname] || { kicker: 'Administración', title: 'Genflow Console' };

  return (
    <header className="h-[80px] shrink-0 flex items-center justify-between px-8 border-b border-purple-500/20 bg-[#02040a]/70 backdrop-blur-xl sticky top-0 z-20">
      <div>
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-purple-400 mb-1">
          {meta.kicker}
        </div>
        <h1 className="margin-0 font-display font-medium text-2xl tracking-tight text-white">
          {meta.title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          {name}
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
