import React, { useState, ChangeEvent, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import ProductTable, { Product } from '../components/organisms/ProductTable';
import { api } from '../services/api';

// Base da URL (VITE_API_URL, já com /api), token e erros ficam centralizados em services/api

export interface ProductFormData {
  name: string;
  productType: string;
  model: string;
  brand: string;
  description: string;
  active: 'Ativo' | 'Inativo' | string;
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
  image: string;
}

type FormMode = 'create' | 'edit' | null;

// Tipo de cada imagem: principal (vitrine), hover (ao passar o mouse) ou galeria
type ImageType = 'main' | 'hover' | 'gallery';

interface ImageSlot {
  file: File | null;
}

const IMAGE_SLOTS = 6;
// Imagem 1 (principal) e 2 (hover) são obrigatórias no cadastro; as demais são opcionais
const REQUIRED_SLOTS = 2;

// Tipo fixo por posição: Imagem 1 = principal, Imagem 2 = hover, demais = galeria
const getImageType = (slotIndex: number): ImageType => {
  if (slotIndex === 0) return 'main';
  if (slotIndex === 1) return 'hover';
  return 'gallery';
};

const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  main: 'Principal',
  hover: 'Hover',
  gallery: 'Galeria',
};

const createEmptySlots = (): ImageSlot[] =>
  Array.from({ length: IMAGE_SLOTS }, () => ({ file: null }));

export default function Produtos_Catalogo(): React.JSX.Element {
  const {
    searchTerm,
    setSearchTerm,
    formMode,
    formData,
    setFormData,
    loading,
    saving,
    selectedFiles,
    existingImages,
    filteredProducts,
    topMarcas,
    topTipos,
    toast,
    closeToast,
    deletingProduct,
    isDeleting,
    handleOpenCreate,
    handleCloseForm,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
    handleFormSubmit,
  } = useProdutosCatalogo();

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar activePage="produtos" />
      <main className="flex-1 min-w-0 pl-72 pt-8 pb-10 pr-4 lg:pr-8 xl:pr-12 2xl:pr-16">
        <div className="max-w-[1600px] mx-auto space-y-6 min-w-0">
          <PageHeader
            title="Gerenciamento de Produtos"
            subtitle="Gerencie o catálogo de calçados da sua loja"
            onActionClick={handleOpenCreate}
            hideButton={formMode !== null}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm flex items-center shadow-sm"
          />

          {feedback && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm font-medium border ${feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
                }`}
            >
              {feedback.text}
            </div>
          )}

          {formMode !== null ? (
            <ProductForm
              formMode={formMode}
              formData={formData}
              setFormData={setFormData}
              selectedFiles={selectedFiles}
              existingImages={existingImages}
              topMarcas={topMarcas}
              topTipos={topTipos}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onRemoveExistingImage={handleRemoveExistingImage}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              saving={saving}
            />
          ) : (
            <>
              <div className="w-full bg-white rounded-xl mb-5 mt-7">
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos..."
                />
              </div>

              <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}