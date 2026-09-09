import React from 'react';
import { MetricCard } from '../molecules/MetricCard';
import { CurrencyIcon, CartIcon, BoxIcon, PeopleIcon, IconProps } from '../atoms/Icons';

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  trend: number;
  icon: React.ComponentType<IconProps>;
  bgColor: string;
}

export const MetricsGrid: React.FC = () => {
  // Dados simulados com base exata na imagem de referência
  const metricsData: MetricItem[] = [
    {
      id: 'receita',
      label: 'Receita Total',
      value: 'R$ 147.890',
      trend: 12.5,
      icon: CurrencyIcon,
      bgColor: 'bg-army'
    },
    {
      id: 'pedidos',
      label: 'Pedidos Hoje',
      value: '234',
      trend: 8.2,
      icon: CartIcon,
      bgColor: 'bg-marrom'
    },
    {
      id: 'estoque',
      label: 'Produtos em Estoque',
      value: '1.456',
      trend: -3.1,
      icon: BoxIcon,
      bgColor: 'bg-azul'
    },
    {
      id: 'clientes',
      label: 'Clientes Ativos',
      value: '8.932',
      trend: 15.3,
      icon: PeopleIcon,
      bgColor: 'bg-preto'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-2">
      {metricsData.map((metric) => (
        <MetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          trend={metric.trend}
          icon={metric.icon}
          iconBgColor={metric.bgColor}
        />
      ))}
    </section>
  );
};

export default MetricsGrid;