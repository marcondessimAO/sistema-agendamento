import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "teal" | "orange" | "green" | "red";
}

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue: {
    bg: "rgba(34,114,204,0.08)",
    icon: "#2272CC",
    badge: "rgba(34,114,204,0.12)",
  },
  teal: {
    bg: "rgba(0,180,216,0.08)",
    icon: "#00B4D8",
    badge: "rgba(0,180,216,0.12)",
  },
  orange: {
    bg: "rgba(255,132,16,0.08)",
    icon: "#FF8410",
    badge: "rgba(255,132,16,0.12)",
  },
  green: {
    bg: "rgba(0,200,150,0.08)",
    icon: "#00C896",
    badge: "rgba(0,200,150,0.12)",
  },
  red: {
    bg: "rgba(229,62,62,0.08)",
    icon: "#E53E3E",
    badge: "rgba(229,62,62,0.12)",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  color = "blue",
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-default"
      style={{ border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: c.bg, color: c.icon }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: trendUp ? "rgba(0,200,150,0.12)" : "rgba(229,62,62,0.12)",
              color: trendUp ? "#00A87A" : "#C53030",
            }}
          >
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--ic-text-muted)" }}>
          {title}
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--ic-text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
