import React from "react";
import { StockScope } from "../../utils/stockAlerts";

interface StockAlertLegendProps {
  scope?: StockScope | "both";
}

const ITEMS_BY_SCOPE: Record<
  StockScope,
  { title: string; ranges: Array<{ label: string; dot: string; text: string }> }
> = {
  total: {
    title: "Estoque geral:",
    ranges: [
      { label: "Crítico (≤ 10)", dot: "bg-red-500", text: "text-red-700" },
      { label: "Atenção (11–24)", dot: "bg-amber-500", text: "text-amber-700" },
      { label: "Saudável (≥ 25)", dot: "bg-emerald-500", text: "text-emerald-700" },
    ],
  },
  size: {
    title: "Por tamanho:",
    ranges: [
      { label: "Crítico (≤ 3)", dot: "bg-red-500", text: "text-red-700" },
      { label: "Atenção (4–9)", dot: "bg-amber-500", text: "text-amber-700" },
      { label: "Saudável (≥ 10)", dot: "bg-emerald-500", text: "text-emerald-700" },
    ],
  },
};

export const StockAlertLegend: React.FC<StockAlertLegendProps> = ({
  scope = "both",
}) => {
  const scopes: StockScope[] =
    scope === "both" ? ["total", "size"] : [scope];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-slate-600">
      {scopes.map((key) => {
        const group = ITEMS_BY_SCOPE[key];
        return (
          <div key={key} className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">{group.title}</span>
            {group.ranges.map((item) => (
              <span
                key={item.label}
                className={`inline-flex items-center gap-1 font-medium ${item.text}`}
              >
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                {item.label}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
