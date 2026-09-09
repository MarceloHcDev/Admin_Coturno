import React from 'react';
import { PageTitle, PageSubtitle } from '../atoms/Icons';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="font-barlow mb-10">
      <PageTitle>Dashboard</PageTitle>
      <PageSubtitle>
        Bem-vindo ao painel administrativo da sua loja de calçados
      </PageSubtitle>
    </header>
  );
};