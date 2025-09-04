// src/utils/apiKeyManager.js

// Save or update API config
export const saveApiConfig = (config) => {
  if (typeof window === "undefined") return; // SSR guard

  const stored = JSON.parse(localStorage.getItem("apiConfigs") || "[]");
  const updated = stored.filter((c) => c.provider !== config.provider);
  updated.push(config);
  localStorage.setItem("apiConfigs", JSON.stringify(updated));
};

// Get all saved configs
export const getApiConfigs = () => {
  if (typeof window === "undefined") return []; // SSR guard
  return JSON.parse(localStorage.getItem("apiConfigs") || "[]");
};

// Find matching config for a given URL
export const getApiConfig = (url) => {
  if (typeof window === "undefined") return null; // SSR guard
  const stored = getApiConfigs();
  return stored.find((c) => url.includes(c.baseUrl)) || null;
};
