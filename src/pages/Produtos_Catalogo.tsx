import React from "react";
import Sidebar from "../components/organisms/Sidebar";
import PageHeader from "../components/molecules/PageHeader";
import SearchInput from "../components/atoms/SearchInput";
import ProductTable from "../components/organisms/ProductTable";
import { StockAlertLegend } from "../components/atoms/StockAlertLegend";
import ProductForm from "../components/organisms/ProductForm";
import Toast from "../components/molecules/Toast";
import ConfirmModal from "../components/molecules/ConfirmModal";
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
      {/* Notificação Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deletingProduct !== null}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir o produto "${deletingProduct?.name}"? Esta ação removerá o item do catálogo.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={isDeleting}
      />

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
              <div className="w-full bg-white rounded-xl mb-3 mt-7">
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos..."
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-4 shadow-xs">
                <StockAlertLegend scope="both" />
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
