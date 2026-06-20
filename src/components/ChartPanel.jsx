export default function ChartPanel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-950/80 to-slate-900/60 p-6 backdrop-blur-2xl shadow-xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 shadow-lg">
          <Icon className="size-5 text-white" />
        </div>
        <h2 className="text-lg font-black text-slate-100">{title}</h2>
      </div>
      {children}
    </section>
  )
}
