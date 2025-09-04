"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { saveApiConfig, getApiConfigs } from "@/utils/apiKeyManager";

export default function ApiKeyModal({ open, onClose }) {
  const [provider, setProvider] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [paramName, setParamName] = useState("token");
  const [authType, setAuthType] = useState("query");
  const [apiKey, setApiKey] = useState("");
  const [configs, setConfigs] = useState([]);

  // ✅ Load configs only on client
  useEffect(() => {
    setConfigs(getApiConfigs());
  }, []);

  const handleSave = () => {
    saveApiConfig({ provider, baseUrl, paramName, apiKey, authType });
    setConfigs(getApiConfigs());
    setProvider("");
    setBaseUrl("");
    setParamName("token");
    setApiKey("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Manage API Keys">
      <div className="space-y-4">
        <input
          placeholder="Provider (e.g., finnhub)"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
        />
        <input
          placeholder="Base URL (e.g., finnhub.io)"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
        />
        <select
          value={authType}
          onChange={(e) => setAuthType(e.target.value)}
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
        >
          <option value="query">Query Param</option>
          <option value="header">Header</option>
        </select>
        <input
          placeholder="Param Name (e.g., token, apikey, X-API-KEY)"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
        />
        <input
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
        />
        <button
          onClick={handleSave}
          className="w-full rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-white"
        >
          Save
        </button>
      </div>

      <div className="mt-6">
        <h4 className="text-slate-300 mb-2">Saved Keys</h4>
        <ul className="space-y-2">
          {configs.map((c, i) => (
            <li key={i} className="text-sm text-slate-400">
              {c.provider} ({c.baseUrl}) — {c.paramName} ({c.authType})
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
