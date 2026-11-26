
import React from "react";
import type { DashboardMetric } from "../../types/adminDashboard";

interface MetricsGridProps {
  metrics: DashboardMetric[];
}

const CORES: Record<DashboardMetric["id"], string> = {
  receita: "bg-army",
  pedidos: "bg-marrom",
  estoque: "bg-azul",
  clientes: "bg-preto",
};

export function MetricsGrid({
  metrics,
}: MetricsGridProps): React.JSX.Element {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {metrics.map((metric) => (
        <article
          key={metric.id}
          className={`${CORES[metric.id]} rounded-2xl p-5 text-white shadow-sm`}
        >
          <p className="text-sm opacity-80">{metric.label}</p>

          <p className="text-2xl font-bold mt-3">
            {metric.value}
          </p>

          <p className="text-xs mt-2 opacity-80">
            {metric.trend > 0
              ? `+${metric.trend}% em relação ao mês anterior`
              : metric.trend < 0
                ? `${metric.trend}% em relação ao mês anterior`
                : "Sem variação registrada"}
          </p>
        </article>
      ))}
    </section>
  );
}
