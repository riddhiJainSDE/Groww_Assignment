"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import WidgetShell from "./WidgetShell";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import { RefreshCcw, Trash2 } from "lucide-react";
import { fetchGenericData } from "@/stores/redux/widgetsSlice";
import { getByPath } from "@/utils/jsonExplorer";

export default function FinanceCard({ widget, onRemove }) {
  const dispatch = useDispatch();
  useAutoRefresh(widget);

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (widget.status === "succeeded") {
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [widget.status, widget.data]);

  const handleRefresh = (e) => {
    e.stopPropagation();
    if (widget?.props?.url) {
      dispatch(fetchGenericData({ id: widget.id, url: widget.props.url }));
    }
  };

  return (
    <WidgetShell widget={widget} hideTitle>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 cursor-move handle">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-200 truncate">
              {widget.title}
            </h3>
            {widget.props?.refreshMs && (
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                {Math.round(widget.props.refreshMs / 1000)}s
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="no-drag p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} />
            </button>
            <button
              className="no-drag p-2 rounded-md bg-slate-800 hover:bg-red-700 text-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(widget.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {widget.status === "loading" && (
          <div className="animate-pulse p-6 flex-1 flex flex-col items-center justify-center">
            <div className="h-8 bg-slate-700 rounded w-24 mb-3"></div>
            <div className="h-12 bg-slate-700 rounded w-32"></div>
          </div>
        )}

        {/* Error */}
        {widget.status === "failed" && (
          <div className="p-4 text-red-400 text-sm">⚠️ {widget.error}</div>
        )}

        {/* Data */}
        {widget.status === "succeeded" && (
          <div className="flex flex-col justify-center items-center flex-1 p-6 space-y-6">
            {/* Big Value */}
            {widget.props.fields?.[0] && (
              <div className="text-5xl font-extrabold text-slate-100">
                {String(getByPath(widget.data, widget.props.fields[0]) ?? "—")}
              </div>
            )}

            {/* Subfields */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md text-center">
              {widget.props.fields?.slice(1).map((field) => {
                const value = getByPath(widget.data, field);
                return (
                  <div
                    key={field}
                    className="bg-slate-800 rounded-lg px-3 py-2"
                  >
                    <div className="text-slate-400 text-xs truncate">
                      {field}
                    </div>
                    <div className="text-lg font-semibold text-slate-200">
                      {value ?? "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-700 text-xs text-slate-400 text-right">
          Last updated:{" "}
          <span className="text-slate-300">{lastUpdated || "—"}</span>
        </div>
      </div>
    </WidgetShell>
  );
}
