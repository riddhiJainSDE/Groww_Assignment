"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { removeWidget, loadWidgets } from "@/stores/redux/widgetsSlice";
import AddWidgetModal from "@/components/widgets/AddWidgetModal";
import DashboardGrid from "@/components/layout/DashboardGrid";
import ApiKeyModal from "@/components/ui/ApiKeyModal";

export default function DashboardPage() {
  const widgets = useSelector((state) => state.widgets.widgets || []);
  const [open, setOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeWidget(id));
  };

  // 🔹 Export config as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(widgets, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-config.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  // 🔹 Import config from file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        dispatch(loadWidgets(config));
      } catch (err) {
        alert("⚠️ Invalid config file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4
        bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-900
        shadow-md border-b border-white/10"
      >
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>

        <div className="flex items-center gap-3">
          {/* 🔑 API Key Modal */}
          <button
            onClick={() => setApiModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white"
          >
            🔑 API Keys
          </button>

          {/* ⬇ Export Config */}
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            ⬇ Export
          </button>

          {/* ⬆ Import Config */}
          <label className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white cursor-pointer">
            ⬆ Import
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* + Add Widget */}
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition text-white"
          >
            + Add Widget
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {widgets.length === 0 ? <EmptyState /> : <DashboardGrid />}
      </main>

      {/* Modals */}
      <AddWidgetModal open={open} onClose={() => setOpen(false)} />
      <ApiKeyModal open={apiModalOpen} onClose={() => setApiModalOpen(false)} />
    </div>
  );
}
