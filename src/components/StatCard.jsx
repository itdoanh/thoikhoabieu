export default function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-950/80 to-slate-900/60 p-5 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-xl bg-gradient-to-br ${tone.replace('text-', 'from-')} to-slate-800 p-3 shadow-lg`}>
          <Icon className="size-5 text-white" />
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20">Live</span>
      </div>
      <div className="text-4xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{value}</div>
      <p className="mt-2 text-sm font-bold text-slate-400">{label}</p>
    </div>
  )
}
