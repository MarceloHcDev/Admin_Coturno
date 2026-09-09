// src/components/molecules/PageHeader.tsx
import React from 'react';

export interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  /** Subtítulo descritivo opcional */
  subtitle?: string;
  /** Função callback executada ao clicar no botão de ação principal */
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Controla a exibição do botão de ação (padrão: false) */
  hideButton?: boolean;
  /** Classes CSS do Tailwind para estilização customizada do botão */
  buttonClassName?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  onActionClick, 
  hideButton = false,
  buttonClassName = "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm"
}) => {
  return (
    <div className="flex items-center justify-between w-full pb-4">
      {/* Bloco de Títulos Semânticos */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {/* Inserção Segura e Condicional do Botão */}
      {!hideButton && (
        <button 
          onClick={onActionClick} 
          className={buttonClassName}
          type="button"
        >
          {/* Ícone de "+" */}
          <span className="mr-1 font-semibold">+</span> Novo Produto
        </button>
      )}
    </div>
  );
};

export default PageHeader;