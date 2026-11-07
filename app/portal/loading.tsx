// Skeleton del portal mientras los Server Components cargan datos de Supabase.
export default function PortalLoading() {
  return (
    <div className="flex flex-col gap-7 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-[#0d1117]/70 border border-white/5 rounded-3xl p-6 h-32">
            <div className="w-10 h-10 rounded-xl bg-white/5" />
            <div className="mt-6 h-7 w-24 rounded bg-white/10" />
            <div className="mt-2 h-3 w-32 rounded bg-white/5" />
          </div>
        ))}
      </div>
      <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6">
        <div className="h-3 w-40 rounded bg-white/10 mb-5" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
