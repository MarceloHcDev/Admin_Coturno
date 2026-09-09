// src/components/organisms/StoreImagesForm.tsx
import React, { useState } from 'react';
import { ImageUploadInput } from '../atoms/ImageUploadInput';

export const StoreImagesForm: React.FC = () => {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [carouselFile, setCarouselFile] = useState<File | null>(null);
  const [categoryFile, setCategoryFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Arquivos salvos:', { bannerFile, carouselFile, categoryFile });
    alert('Imagens da loja virtual atualizadas com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Seção 1: Banner Principal */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          1. Banner Principal (Home)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Imagem de destaque principal exibida no topo do site da loja virtual.
        </p>
        <ImageUploadInput
          id="banner-principal"
          label="Anexo da Imagem do Banner"
          recommendedSize="1920x600px"
          onImageChange={(file) => setBannerFile(file)}
        />
      </section>

      {/* Seção 2: Carrossel Promocional */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          2. Carrossel Promocional
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Banner secundário rotativo para campanhas de desconto ou lançamentos.
        </p>
        <ImageUploadInput
          id="carrossel-promocional"
          label="Anexo da Imagem do Carrossel"
          recommendedSize="1200x400px"
          onImageChange={(file) => setCarouselFile(file)}
        />
      </section>

      {/* Seção 3: Card de Destaque de Categoria */}
      <section className="pb-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          3. Card Destaque de Categorias
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Imagem ilustrativa das coleções em destaque na página inicial.
        </p>
        <ImageUploadInput
          id="destaque-categoria"
          label="Anexo da Imagem de Destaque"
          recommendedSize="800x800px"
          onImageChange={(file) => setCategoryFile(file)}
        />
      </section>

      {/* Ações do Formulário */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};