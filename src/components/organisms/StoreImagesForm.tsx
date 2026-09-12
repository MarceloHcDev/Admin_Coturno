// src/components/organisms/StoreImagesForm.tsx
import React, { useState } from 'react';
import { ImageUploadInput } from '../atoms/ImageUploadInput';

export const StoreImagesForm: React.FC = () => {
  const [bannerFile, setBannerFile] = useState<File|null>(null);
  const [carouselFile, setCarouselFile] = useState<File|null>(null);
  const [categoryFile, setCategoryFile] = useState<File|null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validação local: verifica se ao menos uma imagem foi selecionada
    if (!bannerFile && !carouselFile && !categoryFile) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor, selecione ao menos uma imagem para enviar.',
      });
      return;
    }

    // Instancia o FormData para envio multipart/form-data
    const formData = new FormData();

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    if (carouselFile) {
      formData.append('carousel', carouselFile);
    }
    if (categoryFile) {
      formData.append('category', categoryFile);
    }

    setLoading(true);

    try {
      // Ajuste a URL para o endpoint correto do seu Laravel em ambiente de desenvolvimento
      const response = await fetch('http://localhost:8000/api/upload-store-images', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Imagens enviadas e atualizadas no Cloudinary com sucesso!',
        });
        console.log('URLs retornadas do Cloudinary:', data.urls);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Erro ao realizar o envio das imagens.',
        });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setStatusMessage({
        type: 'error',
        text: 'Falha na comunicação com o servidor. Verifique a conexão com o back-end.',
      });
    } finally {
      setLoading(false);
    }
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

      {/* Feedback de status */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Ações do Formulário */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-900 hover:bg-zinc-800 disabled:bg-blue-900/60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? 'Enviando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};