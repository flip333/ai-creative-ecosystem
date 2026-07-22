import { login } from './actions'
import { NeonEmphasis } from '@/components/ui/NeonEmphasis'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center shadow-[0_0_16px_rgba(204,255,0,0.4)] text-black font-extrabold text-xl font-display">
              G
            </div>
            <span className="font-display font-medium text-xl tracking-tight text-white">
              Gen<span className="text-lime-400 italic">flow</span>
            </span>
          </div>
          
          <h1 className="text-3xl font-display font-medium text-white tracking-tight mb-2">
            Portal de <NeonEmphasis>Clientes</NeonEmphasis>
          </h1>
          <p className="text-zinc-400 text-sm">
            Ingresa con tus credenciales para acceder a tu ecosistema de IA.
          </p>
        </div>

        <form className="space-y-5 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
          {searchParams?.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium p-4 rounded-xl text-center">
              {searchParams.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder:text-zinc-600"
              placeholder="tu@empresa.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder:text-zinc-600"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              formAction={login}
              className="w-full inline-flex items-center justify-center gap-2 bg-lime-400 text-black border-none py-3 px-6 rounded-full font-bold text-sm shadow-[0_0_18px_rgba(204,255,0,0.4)] cursor-pointer hover:bg-lime-300 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        <p className="text-center text-zinc-500 text-xs mt-8">
          El acceso al portal es por invitación. <br /> Si eres cliente y no tienes acceso, contacta a tu consultor Genflow.
        </p>
      </div>
    </div>
  )
}
