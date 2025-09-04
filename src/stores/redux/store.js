import { configureStore } from "@reduxjs/toolkit";
import widgetsReducer from "./widgetsSlice";

const STORAGE_KEY = "finboard_state";
const SAVE_DEBOUNCE_MS = 250;

// Clean/normalize a single widget's props.fields & arrayPath
function cleanWidgetForPersistence(w) {
  if (!w || !w.props) return w;
  const props = { ...w.props };

  // Clean fields array (strip leading [0]. and infer arrayPath if needed)
  if (Array.isArray(props.fields)) {
    const newFields = [];
    let inferredArrayPath = typeof props.arrayPath === "string" ? props.arrayPath : undefined;

    for (let raw of props.fields) {
      if (typeof raw !== "string") continue;

      // root-array prefix: "[0].headline"
      if (/^\[\d+\]\.?/.test(raw)) {
        const cleaned = raw.replace(/^\[\d+\]\.?/, "");
        newFields.push(cleaned);
        if (inferredArrayPath === undefined) inferredArrayPath = "";
        continue;
      }

      // nested like "data.items[0].id"
      const m = raw.match(/^(.+?)\[\d+\]\.(.+)$/);
      if (m) {
        const prefix = m[1];      // "data.items"
        const remainder = m[2];   // "id" or "meta.author"
        newFields.push(remainder);
        if (inferredArrayPath === undefined) inferredArrayPath = prefix;
        continue;
      }

      // else keep as-is
      newFields.push(raw);
    }

    props.fields = Array.from(new Set(newFields));
    if (inferredArrayPath !== undefined && (props.arrayPath === undefined || props.arrayPath === null)) {
      props.arrayPath = inferredArrayPath;
    }
  }

  // Clean xField/yField if necessary
  if (props.xField && typeof props.xField === "string") props.xField = props.xField.replace(/^\[\d+\]\.?/, "");
  if (props.yField && typeof props.yField === "string") props.yField = props.yField.replace(/^\[\d+\]\.?/, "");

  return { ...w, props };
}

function migrateStored(raw) {
  // raw may be an array or object; normalize to array of widgets
  try {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((w) => ({ ...cleanWidgetForPersistence(w) }));
    }
    // if it's an object with .widgets
    if (raw && Array.isArray(raw.widgets)) {
      return raw.widgets.map((w) => ({ ...cleanWidgetForPersistence(w) }));
    }
    // other common shapes: raw.data or raw.items
    if (raw && Array.isArray(raw.data)) return raw.data.map((w) => ({ ...cleanWidgetForPersistence(w) }));
    if (raw && Array.isArray(raw.items)) return raw.items.map((w) => ({ ...cleanWidgetForPersistence(w) }));
    return [];
  } catch (e) {
    console.warn("Migration failed:", e);
    return [];
  }
}

function loadState() {
  if (typeof window === "undefined") return undefined;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return undefined;
    const parsed = JSON.parse(data);

    const widgets = migrateStored(parsed);
    // Ensure minimal widget shape
    const normalized = widgets.map((w, i) => ({
      id: w?.id ? String(w.id) : Date.now().toString() + "_" + i,
      type: w?.type || "card",
      title: w?.title || `Widget ${i + 1}`,
      x: w?.x ?? (i * 4) % 12,
      y: w?.y ?? 0,
      w: w?.w ?? 4,
      h: w?.h ?? 6,
      props: w?.props ?? {},
      data: w?.data ?? null,
      chartData: w?.chartData ?? null,
      status: w?.status ?? "idle",
      error: w?.error ?? null,
    }));

    return normalized;
  } catch (err) {
    console.warn("Failed to load persisted state:", err);
    return undefined;
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    // persist only the array of widgets
    const payload = (state.widgets && Array.isArray(state.widgets.widgets)) ? state.widgets.widgets : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to save state:", e);
  }
}

export const store = configureStore({
  reducer: {
    widgets: widgetsReducer,
  },
  preloadedState: {
    widgets: { widgets: loadState() || [], cache: {} },
  },
});

// Debounced save to reduce localStorage thrash
let timer = null;
store.subscribe(() => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    saveState(store.getState());
  }, SAVE_DEBOUNCE_MS);
});

export default store;
