// src/components/widgets/ChartWidget.jsx
"use client";

import { useState, useEffect } from "react";
import WidgetShell from "./WidgetShell";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import { getByPath } from "@/utils/jsonExplorer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { RefreshCcw, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchGenericData } from "@/stores/redux/widgetsSlice";

export default function ChartWidget({ widget, onRemove }) {
  const dispatch = useDispatch();
  useAutoRefresh(widget);

  const [interval, setInterval] = useState("Daily");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Build chart data
  const arr = Array.isArray(getByPath(widget.data, widget.props.arrayPath))
    ? getByPath(widget.data, widget.props.arrayPath)
    : [];

  const data = arr
    .map((row, i) => ({
      x: widget.props.xField ? getByPath(row, widget.props.xField) : i,
      y: parseFloat(getByPath(row, widget.props.yField)),
    }))
    .filter((d) => Number.isFinite(d.y));

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

        {/* Loading */}
        {widget.status === "loading" && (
          <div className="animate-pulse p-4 h-full flex flex-col justify-center">
            <div className="h-6 bg-slate-700 rounded mb-3 w-2/3"></div>
            <div className="h-48 bg-slate-700 rounded"></div>
          </div>
        )}

        {/* Error */}
        {widget.status === "failed" && (
          <div className="p-4 text-red-400 text-sm">⚠️ {widget.error}</div>
        )}

        {/* Chart */}
        {widget.status === "succeeded" && data.length > 0 && (
          <div className="flex flex-col flex-1 p-4">
            {/* Interval Selector */}
            <div className="flex justify-end mb-2 gap-2 text-xs">
              {["Daily", "Weekly", "Monthly"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setInterval(opt)}
                  className={`px-2 py-1 rounded ${
                    interval === opt
                      ? "bg-sky-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.slice(-100)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t border-slate-700 text-center">
              <span className="text-xs text-slate-400">
                Last updated:{" "}
                <span className="text-slate-300">{lastUpdated || "—"}</span>
              </span>
            </div>
          </div>
        )}

        {/* No data */}
        {widget.status === "succeeded" && data.length === 0 && (
          <div className="p-3 text-slate-400 text-sm">
            No numeric data at selected path.
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
