// src/components/ClientProvider.jsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/stores/redux/store";

/**
 * A tiny client wrapper so we keep app/layout.jsx as a server component
 * while still providing Redux to the client parts of the app.
 */
export default function ClientProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
