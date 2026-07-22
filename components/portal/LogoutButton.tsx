'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/app/login/actions';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </form>
  );
}
