"use client";

import { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useDispatch, useSelector } from "react-redux";
import { updateLayout, removeWidget } from "@/stores/redux/widgetsSlice";
import FinanceCard from "@/components/widgets/FinanceCard";
import TableWidget from "@/components/widgets/TableWidget";
import ChartWidget from "@/components/widgets/ChartWidget";

const ReactGridLayout = WidthProvider(RGL);

export default function DashboardGrid({ onAddWidget }) {
  const dispatch = useDispatch();
  const widgets = useSelector((s) => s.widgets.widgets || []);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const resize = () => setWidth(window.innerWidth - 40);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <ReactGridLayout
      cols={12}
      rowHeight={30}
      width={width}
      margin={[12, 12]}
      containerPadding={[12, 12]}
      onDragStop={(layout) => dispatch(updateLayout(layout))}
      onResizeStop={(layout) => dispatch(updateLayout(layout))}
      isResizable
      isDraggable
      compactType={null}
      preventCollision={false}
      draggableHandle=".handle"
      draggableCancel=".no-drag, input, button, textarea, a"
    >
      {/* Existing Widgets */}
      {widgets.map((w) => (
        <div
          key={w.id}
          data-grid={{ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }}
          className="h-full"
        >
          {w.type === "card" && (
            <FinanceCard
              widget={w}
              onRemove={() => dispatch(removeWidget(w.id))}
            />
          )}
          {w.type === "table" && (
            <TableWidget
              widget={w}
              onRemove={() => dispatch(removeWidget(w.id))}
            />
          )}
          {w.type === "chart" && (
            <ChartWidget
              widget={w}
              onRemove={() => dispatch(removeWidget(w.id))}
            />
          )}
        </div>
      ))}

      {/* Add Widget Tile */}
      <div
        key="add-widget"
        data-grid={{ i: "add-widget", x: 0, y: Infinity, w: 3, h: 6 }}
        className="h-full"
      >
        <button
          onClick={onAddWidget}
          className="flex flex-col items-center justify-center w-full h-full 
                     border-2 border-dashed border-slate-600 rounded-lg 
                     text-slate-400 hover:text-slate-200 hover:border-slate-400 
                     transition"
        >
          <div className="w-10 h-10 mb-2 rounded-full bg-emerald-600 
                          flex items-center justify-center text-white text-2xl">
            +
          </div>
          <span className="font-medium">Add Widget</span>
          <span className="text-xs text-slate-400 text-center px-2">
            Connect to a finance API and create a custom widget
          </span>
        </button>
      </div>
    </ReactGridLayout>
  );
}
