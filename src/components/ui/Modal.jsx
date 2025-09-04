"use client";

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[680px] -translate-x-1/2 -translate-y-1/2
                      rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
