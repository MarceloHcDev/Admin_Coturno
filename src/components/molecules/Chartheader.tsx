// src/components/molecules/ChartHeader.tsx
import React from 'react';

interface ChartHeaderProps {
  title: string;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h4 className="text-lg font-bold text-slate-800 tracking-tight">
        {title}
      </h4>
      {/* Espaço reservado para futuros filtros ou botões de período */}
      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
    </div>
  );
};