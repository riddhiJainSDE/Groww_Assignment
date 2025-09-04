"use client";

export default function WidgetShell({ widget, children, hideTitle }) {
  return (
    <div className="h-full flex flex-col rounded-2xl shadow-2xl overflow-hidden">
      {/* gradient / glass background that covers the whole widget */}
      <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-indigo-950/85 border border-slate-700 flex-1 flex flex-col">
        {/* Optional default title (unused for FinanceCard which sets hideTitle) */}
        {!hideTitle && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200 truncate">
              {widget.title}
            </h3>
            <div className="flex items-center gap-2">
              <button className="no-drag text-slate-300 hover:text-white">✕</button>
            </div>
          </div>
        )}

        {/* content area (fills remaining space) */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
