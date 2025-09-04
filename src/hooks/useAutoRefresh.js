// src/hooks/useAutoRefresh.js
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGenericData } from "@/stores/redux/widgetsSlice";

export default function useAutoRefresh(widget) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!widget?.props?.url) return;

    // initial fetch
    dispatch(fetchGenericData({ id: widget.id, url: widget.props.url }));

    // setup interval
    const interval = setInterval(() => {
      dispatch(fetchGenericData({ id: widget.id, url: widget.props.url }));
    }, widget?.props?.refreshMs || 30000);

    return () => clearInterval(interval);
  }, [dispatch, widget?.id, widget?.props?.url, widget?.props?.refreshMs]);
}
