import { Edit3, Trash2, Wand2 } from 'lucide-react'

const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

const categoryColors = {
  Học: 'from-sky-500 to-cyan-400',
  Làm: 'from-violet-500 to-fuchsia-500',
  Dạy: 'from-amber-500 to-orange-400',
  'Cá nhân': 'from-emerald-500 to-lime-400',
}

function Input({ label, value, onChange }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm outline-none focus:border-cyan-300" /></label>
}

function Select({ label, value, options, onChange }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm outline-none focus:border-cyan-300">{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

export default function EditPanel({ selectedEvent, updateSelected, deleteSelected }) {
  if (!selectedEvent) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Chỉnh sửa chi tiết</h2>
          <Edit3 className="text-cyan-200" />
        </div>
        <p className="text-slate-400">Chưa có lịch để chỉnh sửa.</p>
      </section>
    )
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Chỉnh sửa chi tiết</h2>
        <Edit3 className="text-cyan-200" />
      </div>
      <div className="space-y-4">
        <Input label="Tiêu đề" value={selectedEvent.title} onChange={(value) => updateSelected('title', value)} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Ngày" value={selectedEvent.day} options={days} onChange={(value) => updateSelected('day', value)} />
          <Select label="Loại" value={selectedEvent.category} options={Object.keys(categoryColors)} onChange={(value) => updateSelected('category', value)} />
          <Input label="Bắt đầu" value={selectedEvent.start} onChange={(value) => updateSelected('start', value)} />
          <Input label="Kết thúc" value={selectedEvent.end} onChange={(value) => updateSelected('end', value)} />
          <Input label="Phòng/link" value={selectedEvent.room} onChange={(value) => updateSelected('room', value)} />
          <Select label="Ưu tiên" value={selectedEvent.priority} options={['Cao', 'Vừa', 'Thấp']} onChange={(value) => updateSelected('priority', value)} />
        </div>
        <Input label="Người/nhóm" value={selectedEvent.owner} onChange={(value) => updateSelected('owner', value)} />
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Tiến độ {selectedEvent.progress}%</span>
          <input type="range" min="0" max="100" value={selectedEvent.progress} onChange={(event) => updateSelected('progress', Number(event.target.value))} className="w-full accent-cyan-400" />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Ghi chú</span>
          <textarea value={selectedEvent.notes} onChange={(event) => updateSelected('notes', event.target.value)} rows="4" className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm outline-none focus:border-cyan-300" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-2xl bg-white px-4 py-3 font-black text-slate-950"><Wand2 className="mr-2 inline size-4" />AI tối ưu</button>
          <button onClick={deleteSelected} className="rounded-2xl bg-rose-500/90 px-4 py-3 font-black text-white"><Trash2 className="mr-2 inline size-4" />Xóa</button>
        </div>
      </div>
    </section>
  )
}
