"use client";

import { useEffect, useState, useMemo } from "react";
import WidgetShell from "./WidgetShell";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import { useDispatch } from "react-redux";
import { fetchGenericData } from "@/stores/redux/widgetsSlice";
import { normalizeData } from "@/utils/dataMapper";
import { RefreshCcw, Trash2 } from "lucide-react";

export default function TableWidget({ widget, onRemove }) {
  const dispatch = useDispatch();
  useAutoRefresh(widget);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  // 🔹 Normalize incoming data
  const normalized = normalizeData(widget.data);
  const rows = normalized.rows || [];

  // 🔹 Fields (from widget config or auto-detected)
  const cols =
    widget?.props?.fields?.length > 0
      ? widget.props.fields
      : Object.keys(rows[0] || {});

  // 🔹 Search filter
  const filteredRows = useMemo(() => {
    if (!search) return rows;
    return rows.filter((r) =>
      cols.some((c) => String(r[c] ?? "").toLowerCase().includes(search.toLowerCase()))
    );
  }, [rows, cols, search]);

  // 🔹 Pagination
  const paginatedRows = useMemo(
    () => filteredRows.slice((page - 1) * pageSize, page * pageSize),
    [filteredRows, page]
  );

  return (
    <WidgetShell widget={widget} hideTitle>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 cursor-move handle">
          <h3 className="text-lg font-semibold text-slate-200 truncate">
            {widget.title}
          </h3>
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

        {/* Search */}
        <div className="px-4 py-2 border-b border-slate-700">
          <input
            type="text"
            className="w-full rounded bg-slate-800 border border-slate-600 px-3 py-1 text-sm text-slate-200 outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Loading */}
        {widget.status === "loading" && (
          <div className="animate-pulse p-6 flex-1">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-3"></div>
            <div className="h-12 bg-slate-700 rounded w-1/2"></div>
          </div>
        )}

        {/* Error */}
        {widget.status === "failed" && (
          <div className="p-4 text-red-400 text-sm">⚠️ {widget.error}</div>
        )}

        {/* Table */}
        {widget.status === "succeeded" && (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-800 text-slate-300 sticky top-0">
                <tr>
                  {cols.map((c) => (
                    <th key={c} className="px-4 py-2 border-b border-slate-700">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, i) => (
                  <tr key={i} className="odd:bg-slate-900 even:bg-slate-800">
                    {cols.map((c) => (
                      <td
                        key={c}
                        className="px-4 py-2 border-b border-slate-700 text-slate-200"
                      >
                        {row[c] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-3 px-4 text-xs text-slate-400">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 bg-slate-700 rounded disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                Page {page} of {Math.ceil(filteredRows.length / pageSize) || 1}
              </span>
              <button
                onClick={() =>
                  setPage((p) => (p * pageSize < filteredRows.length ? p + 1 : p))
                }
                disabled={page * pageSize >= filteredRows.length}
                className="px-2 py-1 bg-slate-700 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-700 text-xs text-slate-400 text-center">
          Last updated:{" "}
          <span className="text-slate-300">{lastUpdated || "—"}</span>
        </div>
      </div>
    </WidgetShell>
  );
}
