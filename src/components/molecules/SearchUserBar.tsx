// src/components/molecules/SearchUserBar.tsx
import React from 'react';

export interface SearchUserBarProps {
  /** Valor atual do campo de busca */
  value: string;
  /** Função callback acionada na alteração do valor do input */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Texto exibido como placeholder no campo de busca */
  placeholder?: string;
}

export const SearchUserBar: React.FC<SearchUserBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Buscar usuários..." 
}) => {
  return (
    <div className="relative w-full mb-6">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-300 shadow-sm transition-all text-sm"
      />
    </div>
  );
};

export default SearchUserBar;