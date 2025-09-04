import { BarChart3 } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
      <BarChart3 className="w-16 h-16 text-indigo-500" />
      <h2 className="text-2xl font-bold">Build Your Own Dashboard</h2>
      <p className="text-gray-400 max-w-md">
        Connect to finance APIs, track stock prices, crypto rates, or economic
        indicators — all in real time. Add custom widgets like charts, tables,
        or cards to create your personalized finance dashboard.
      </p>
    </div>
  );
}
