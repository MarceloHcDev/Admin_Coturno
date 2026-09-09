// src/components/molecules/UserRow.tsx
import React from 'react';

export interface UserIconProps {
  /** Classes CSS do Tailwind para estilização e dimensionamento do ícone */
  className?: string;
}

export const UserIcon: React.FC<UserIconProps> = ({ 
  className = "w-5 h-5 text-slate-500" 
}) => {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
      />
    </svg>
  );
};

export default UserIcon;