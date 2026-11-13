import React from "react";
import Sidebar from "../components/organisms/Sidebar";
import PageHeader from "../components/molecules/PageHeader";
import SearchInput from "../components/atoms/SearchInput";
import ProductTable from "../components/organisms/ProductTable";
import ProductForm from "../components/organisms/ProductForm";
import { useProdutosCatalogo } from "../hooks/useProdutosCatalogo";

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
    filteredProducts,
    handleOpenCreate,
    handleCloseForm,
    handleEdit,
    handleDelete,
    handleFileChange,
    handleRemoveFile,
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
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm flex items-center shadow-sm cursor-pointer"
          />

          {formMode !== null ? (
            <ProductForm
              formMode={formMode}
              formData={formData}
              setFormData={setFormData}
              selectedFiles={selectedFiles}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
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

              {loading ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                  Carregando produtos do banco de dados...
                </div>
              ) : (
                <ProductTable
                  products={filteredProducts}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
