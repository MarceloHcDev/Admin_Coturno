// src/components/molecules/PageHeader_usuario.tsx
import React from 'react';

export interface PageHeaderUsuarioProps {
  /** Título principal da página */
  title: string;
  /** Subtítulo descritivo opcional */
  subtitle?: string;
  /** Texto do botão de ação */
  buttonText?: string;
  /** Função callback executada ao clicar no botão de ação principal */
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Alias para onActionClick enviado por páginas de gestão */
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Controla a ocultação do botão de ação */
  hideButton?: boolean;
  /** Controla a exibição do botão de ação */
  showButton?: boolean;
  /** Classes CSS do Tailwind para estilização customizada do botão */
  buttonClassName?: string;
}

export const PageHeader_usuario: React.FC<PageHeaderUsuarioProps> = ({ 
  title, 
  subtitle, 
  buttonText = "Novo Usuário",
  onActionClick, 
  onButtonClick,
  hideButton = false,
  showButton,
  buttonClassName = "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm"
}) => {
  // Trata retrocompatibilidade entre onButtonClick e onActionClick
  const handleClick = onButtonClick || onActionClick;
  // Trata retrocompatibilidade entre showButton e hideButton
  const isVisible = showButton !== undefined ? showButton : !hideButton;

  return (
    <div className="flex items-center justify-between w-full pb-4 border-b border-slate-100">
      {/* Bloco de Títulos Semânticos */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {/* Inserção Segura e Condicional do Botão */}
      {isVisible && (
        <button 
          onClick={handleClick} 
          className={buttonClassName}
          type="button"
        >
          {/* Ícone de "+" */}
          <span className="mr-1 font-semibold">+</span> {buttonText}
        </button>
      )}
    </div>
  );
};

export default PageHeader_usuario;