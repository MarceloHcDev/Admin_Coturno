// src/components/molecules/SidebarNavItem.tsx
import React from 'react';
import { IconProps } from '../atoms/Icons';

export interface SidebarNavItemProps {
  /** O componente de ícone a ser renderizado */
  icon: React.ComponentType<IconProps>;
  /** Rótulo/Texto do item de navegação */
  label: string;
  /** Indica se a rota atual do item está ativa */
  isActive: boolean;
  /** Função callback acionada ao clicar no item de navegação */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-200 text-left group ${
        isActive 
          ? 'bg-[#0e4f2f] text-green-400 border-r-4 border-sky-400 font-medium' 
          : 'text-gray-400 hover:bg-zinc-900 hover:text-gray-200'
      }`}
    >
      <span className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
        <Icon className="w-5 h-5" />
      </span>
      <span className="text-[15px] tracking-wide">{label}</span>
    </button>
  );
};

export default SidebarNavItem;