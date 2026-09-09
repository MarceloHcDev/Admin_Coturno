// src/pages/Edicao_Imagens.tsx
import React from 'react';
import { PageHeader } from '../components/molecules/PageHeader';
import { StoreImagesForm } from '../components/organisms/StoreImagesForm';
import Sidebar from "../components/organisms/Sidebar";

export const EdicaoImagens: React.FC = () => {
  return (
    <div className="w-full pe-10 pt-10 bg-slate-50 text-slate-900 antialiased ">
      <Sidebar />
      <main className="pl-72 flex-1 overflow-y-auto">
        <PageHeader
        title="Edição de Imagens da Loja"
        subtitle="Gerencie os banners, imagens promocionais e destaques visuais da sua loja virtual."
        hideButton={true}
        />
        <StoreImagesForm />
      </main>
    </div>
  );
};