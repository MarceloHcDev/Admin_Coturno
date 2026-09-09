// src/components/molecules/MetricCard.tsx
import React from 'react';
import { TrendBadge, IconProps } from '../atoms/Icons';

export interface MetricCardProps {
  /** O componente de átomo de ícone a ser renderizado */
  icon: React.ComponentType<IconProps>;
  /** Título da métrica (ex: "Receita Total") */
  label: string;
  /** Valor principal (ex: "R$ 147.890") */
  value: string;
  /** Valor da tendência em porcentagem (positivo ou negativo) */
  trend: number;
  /** Classe Tailwind para cor de fundo do ícone (ex: "bg-emerald-500") */
  iconBgColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  iconBgColor = "bg-blue-500" 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm flex flex-col gap-4 min-w-60 hover:shadow-md transition-shadow duration-200">
      
      {/* Topo do Card: Ícone e Tendência */}
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg text-white ${iconBgColor} shadow-lg shadow-current/10`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendBadge value={trend} />
      </div>

      {/* Conteúdo: Label e Valor */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>

    </div>
  );
};