"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useDispatch } from "react-redux";
import { addWidget } from "@/stores/redux/widgetsSlice";
import { normalizeData } from "@/utils/dataMapper";

export default function AddWidgetModal({ open, onClose }) {
  const dispatch = useDispatch();

  // Form state
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [tested, setTested] = useState(false);
  const [testError, setTestError] = useState("");
  const [payload, setPayload] = useState(null);
  const [normalized, setNormalized] = useState(null);
  const [autoMode, setAutoMode] = useState(false);

  const [mode, setMode] = useState("card"); // 'card' | 'table' | 'chart'
  const [refresh, setRefresh] = useState(30000);

  const [selectedFields, setSelectedFields] = useState([]);
  const [arrayPath, setArrayPath] = useState("rows");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");

  // 🔹 Test API connection + auto config
  const testConnection = async () => {
    setTestError("");
    setTested(false);
    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Proxy error");

      const data = json.data;
      setPayload(data);

      // Normalize
      const normalizedData = normalizeData(data);
      setNormalized(normalizedData);

      if (normalizedData?.rows?.length > 0) {
        const sample = normalizedData.rows[0];
        if ("date" in sample) setXField("date");
        if ("close" in sample) {
          setYField("close");
          setAutoMode(true);
        } else {
          const numKey = Object.keys(sample).find(
            (k) => typeof sample[k] === "number"
          );
          if (numKey) setYField(numKey);
          setAutoMode(true);
        }
      } else {
        setAutoMode(false);
      }

      setTested(true);
    } catch (e) {
      setTestError(e.message);
    }
  };

  const addField = (field) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields((prev) => [...prev, field]);
    }
  };

  const removeField = (field) => {
    setSelectedFields((prev) => prev.filter((p) => p !== field));
  };

  const canNextFromStep1 = tested && !testError && url;
  const canAdd = useMemo(() => {
    if (!name || !url) return false;
    if (mode === "card") return selectedFields.length > 0;
    if (mode === "table") return selectedFields.length > 0;
    if (mode === "chart") return arrayPath && xField && yField;
    return false;
  }, [mode, name, url, selectedFields, arrayPath, xField, yField]);

  const submit = () => {
    const base = {
      type: mode,
      title: name || "Widget",
      props: { url, refreshMs: Number(refresh) || 30000 },
    };

    if (mode === "card") {
      base.props.fields = selectedFields;
    } else if (mode === "table") {
      base.props.arrayPath = "rows";
      base.props.fields = selectedFields;
    } else if (mode === "chart") {
      base.props.arrayPath = "rows";
      base.props.xField = xField;
      base.props.yField = yField;
    }

    dispatch(addWidget(base));
    onClose();

    // Reset
    setStep(1);
    setName("");
    setUrl("");
    setTested(false);
    setTestError("");
    setPayload(null);
    setNormalized(null);
    setMode("card");
    setRefresh(30000);
    setSelectedFields([]);
    setArrayPath("rows");
    setXField("");
    setYField("");
  };

  // Extract available keys from normalized.rows[0]
  const availableKeys = useMemo(() => {
    if (!normalized?.rows?.length) return [];
    return Object.keys(normalized.rows[0]);
  }, [normalized]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={step === 1 ? "Add New Widget" : "Configure Widget"}
    >
      {/* STEP 1: API Test */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Widget Name</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
              placeholder="e.g., Bitcoin Price Tracker"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">API URL</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                placeholder="https://api.example.com/endpoint?symbol=BTC"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                onClick={testConnection}
                className="rounded bg-sky-600 hover:bg-sky-500 px-4 text-white"
              >
                Test
              </button>
            </div>
            {tested && !testError && (
              <p className="mt-2 text-emerald-400 text-sm">
                ✓ API connection successful. {availableKeys.length} fields detected.
              </p>
            )}
            {testError && (
              <p className="mt-2 text-red-400 text-sm">⚠ {testError}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">Refresh Interval (ms)</label>
            <input
              type="number"
              className="w-40 rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
              value={refresh}
              onChange={(e) => setRefresh(e.target.value)}
              min={3000}
              step={1000}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              className="px-4 py-2 rounded border border-slate-600 text-slate-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={!canNextFromStep1}
              onClick={() => setStep(2)}
              className={`px-4 py-2 rounded ${
                canNextFromStep1
                  ? "bg-sky-600 hover:bg-sky-500 text-white"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Config */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Mode Switch */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">Display Mode</span>
            <div className="flex gap-2">
              {["card", "table", "chart"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded border ${
                    mode === m
                      ? "bg-sky-600 border-sky-500 text-white"
                      : "border-slate-600 text-slate-200"
                  }`}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Config */}
          {mode === "chart" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-300">X Field</label>
                <select
                  className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={xField}
                  onChange={(e) => setXField(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {availableKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Y Field</label>
                <select
                  className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={yField}
                  onChange={(e) => setYField(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {availableKeys.map((key) =>
                    typeof normalized?.rows?.[0]?.[key] === "number" ? (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Table/Card Field Picker */}
          {mode !== "chart" && (
            <div>
              <label className="text-sm text-slate-300">Available Fields</label>
              <div className="grid grid-cols-2 gap-3 max-h-56 overflow-auto">
                <div className="border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400 mb-1">Fields</div>
                  <ul className="space-y-1">
                    {availableKeys.map((field) => (
                      <li
                        key={field}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-300">{field}</span>
                        <button
                          onClick={() => addField(field)}
                          className="ml-2 text-sky-400 hover:text-sky-300"
                        >
                          +
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-slate-700 rounded p-2">
                  <div className="text-xs text-slate-400 mb-1">
                    Selected Fields
                  </div>
                  <ul className="space-y-1">
                    {selectedFields.map((field) => (
                      <li
                        key={field}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-200">{field}</span>
                        <button
                          onClick={() => removeField(field)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded border border-slate-600 text-slate-200"
            >
              Back
            </button>
            <button
              disabled={!canAdd}
              onClick={submit}
              className={`px-4 py-2 rounded ${
                canAdd
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              Add Widget
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
