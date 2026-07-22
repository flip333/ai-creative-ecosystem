'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  LifeBuoy, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Global' },
  { href: '/admin/clients', icon: Users, label: 'CRM de Clientes' },
  { href: '/admin/tickets', icon: LifeBuoy, label: 'Bandeja de Tickets' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-[260px] shrink-0 bg-[#0d1117] border-r border-[#ccff00]/20 flex flex-col p-7 sticky top-0 h-screen z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-7 border-b border-white/5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-500 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.4)] text-black font-extrabold text-lg font-display">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-display font-medium text-lg tracking-tight text-white">
            Gen<span className="text-[#ccff00] italic">flow</span>
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Admin CRM
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/admin/dashboard' && pathname === '/admin');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-semibold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-red-400 transition-colors pt-2 border-t border-white/5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión Admin
        </button>
      </div>
    </aside>
  );
}
