export type StockScope = "total" | "size";
export type StockLevel = "critical" | "warning" | "healthy";

export interface StockAlertStyle {
  level: StockLevel;
  label: string;
  badge: string;
  card: string;
  text: string;
  dot: string;
}

const STOCK_STYLE_MAP: Record<StockLevel, Omit<StockAlertStyle, "level">> = {
  critical: {
    label: "Crítico",
    badge: "bg-red-100 text-red-700 border-red-200",
    card: "bg-red-50/70 border-red-300 text-red-900",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  warning: {
    label: "Atenção",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    card: "bg-amber-50/70 border-amber-300 text-amber-900",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  healthy: {
    label: "Saudável",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    card: "bg-emerald-50/70 border-emerald-300 text-emerald-900",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

/**
 * Classifica o nível de estoque:
 * - Por tamanho ("size"): <= 3 crítico (vermelho), 4..9 atenção (amarelo), >= 10 saudável (verde)
 * - Geral do produto ("total"): <= 10 crítico (vermelho), 11..24 atenção (amarelo), >= 25 saudável (verde)
 */
export function getStockLevel(
  quantity: number,
  scope: StockScope = "total",
): StockLevel {
  const qty = Number.isFinite(quantity) ? quantity : 0;

  if (scope === "size") {
    if (qty <= 3) return "critical";
    if (qty <= 9) return "warning";
    return "healthy";
  }

  if (qty <= 10) return "critical";
  if (qty <= 24) return "warning";
  return "healthy";
}

export function getStockAlertStyle(
  quantity: number,
  scope: StockScope = "total",
): StockAlertStyle {
  const level = getStockLevel(quantity, scope);
  return {
    level,
    ...STOCK_STYLE_MAP[level],
  };
}
