'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Workflow, 
  BookOpen, 
  CreditCard, 
  LifeBuoy, 
  LogOut 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/portal/home', icon: Home, label: 'Inicio / Resumen' },
  { href: '/portal/flows', icon: Workflow, label: 'Mis Automatizaciones' },
  { href: '/portal/docs', icon: BookOpen, label: 'Centro de Documentación' },
  { href: '/portal/billing', icon: CreditCard, label: 'Facturación y Costos' },
  { href: '/portal/support', icon: LifeBuoy, label: 'Soporte / Tickets' },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-[260px] shrink-0 bg-[#0d1117] border-r border-white/5 flex flex-col p-7 sticky top-0 h-screen z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-7 border-b border-white/5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#ccff00] flex items-center justify-center shadow-[0_0_16px_rgba(204,255,0,0.4)] text-black font-extrabold text-lg font-display">
          G
        </div>
        <span className="font-display font-medium text-lg tracking-tight text-white">
          Gen<span className="text-[#ccff00] italic">flow</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/portal/home' && pathname === '/portal');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#ccff00] text-black font-semibold shadow-[0_0_12px_rgba(204,255,0,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Plan / Footer info */}
      <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 block mb-1">
            Plan Actual
          </span>
          <span className="text-xs text-zinc-300 font-medium">Genflow Core</span>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-red-400 transition-colors pt-2 border-t border-white/5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
