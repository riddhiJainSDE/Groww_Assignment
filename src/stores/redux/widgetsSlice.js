import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// generic fetch via proxy (works for any URL)
export const fetchGenericData = createAsyncThunk(
  "widgets/fetchGenericData",
  async ({ id, url }, { getState }) => {
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "Proxy error");
    const payload = json.data ?? json;
    return { id, data: payload, url };
  }
);

const widgetsSlice = createSlice({
  name: "widgets",
  initialState: {
    widgets: [],
    cache: {},
  },
  reducers: {
    addWidget: (state, action) => {
      const count = state.widgets.length;
      state.widgets.push({
        id: Date.now().toString(),
        type: action.payload.type || "card",
        title: action.payload.title || `Widget ${count + 1}`,
        x: (count * 4) % 12,
        y: 0,
        w: 4,
        h: 6,
        props: action.payload.props || {},
        data: null,
        chartData: null,
        status: "idle",
        error: null,
        lastUpdated: null,
      });
    },
    removeWidget: (state, action) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
    },
    updateLayout: (state, action) => {
      action.payload.forEach((l) => {
        const widget = state.widgets.find((w) => w.id === l.i);
        if (widget) {
          widget.x = l.x;
          widget.y = l.y;
          widget.w = l.w;
          widget.h = l.h;
        }
      });
    },
    updateWidgetTitle: (state, action) => {
      const { id, title } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) widget.title = title;
    },

    // 🔹 NEW → allow full replacement when importing config
    loadWidgets: (state, action) => {
      state.widgets = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenericData.pending, (state, action) => {
        const widget = state.widgets.find((w) => w.id === action.meta.arg.id);
        if (widget) {
          widget.status = "loading";
          widget.error = null;
        }
      })
      .addCase(fetchGenericData.fulfilled, (state, action) => {
        const widget = state.widgets.find((w) => w.id === action.payload.id);
        if (widget) {
          widget.data = action.payload.data;
          widget.status = "succeeded";
          widget.lastUpdated = Date.now();
        }
        if (action.payload.url) {
          state.cache[action.payload.url] = {
            data: action.payload.data,
            ts: Date.now(),
          };
        }
      })
      .addCase(fetchGenericData.rejected, (state, action) => {
        const widget = state.widgets.find((w) => w.id === action.meta.arg.id);
        if (widget) {
          widget.status = "failed";
          widget.error = action.error.message || "Failed to fetch data";
        }
      });
  },
});

export const {
  addWidget,
  removeWidget,
  updateLayout,
  updateWidgetTitle,
  loadWidgets, // ✅ export this so Import works
} = widgetsSlice.actions;

export default widgetsSlice.reducer;
