import React, { ChangeEvent, FormEvent, useMemo, useEffect } from "react";
import { ProductFormData } from "../../hooks/useProdutosCatalogo";

export interface ProductFormProps {
  formMode: "create" | "edit";
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  selectedFiles: File[];
  existingImages?: string[];
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  saving: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formMode,
  formData,
  setFormData,
  selectedFiles,
  existingImages = [],
  onFileChange,
  onRemoveFile,
  onSubmit,
  onCancel,
  saving,
}) => {
  // Gera URLs de preview em memória para cada arquivo selecionado
  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  // Libera a memória quando os arquivos mudam ou o componente desmonta
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-slate-900">
        {formMode === "edit" ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Nome do Produto */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Nome do Produto
            </label>
            <input
              type="text"
              placeholder="Ex: Coturno Tático Militar"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Tipo do Produto */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Tipo do produto
            </label>
            <select
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
              value={formData.productType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productType: e.target.value,
                })
              }
              required
            >
              <option value="">Selecione um tipo</option>
              <option value="Coturno">Coturno</option>
              <option value="Borzeguim">Borzeguim</option>
              <option value="Tênis Esportivo">Tênis Esportivo</option>
              <option value="Sapatos Sociais">Sapatos Sociais</option>
              <option value="Sandálias">Sandálias</option>
            </select>
          </div>

          {/* Modelo */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">Modelo</label>
            <input
              type="text"
              placeholder="Ex: Combat X"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
          </div>

          {/* Marca */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">Marca</label>
            <select
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            >
              <option value="">Selecione uma marca</option>
              <option value="Atalaia">Atalaia</option>
              <option value="Acero">Acero</option>
              <option value="Bull Terrier">Bull Terrier</option>
              <option value="Oakley">Oakley</option>
              <option value="Macboot">Macboot</option>
            </select>
          </div>

          {/* Preço */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          {/* Quantidade em Estoque */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Quantidade em Estoque
            </label>
            <input
              type="number"
              placeholder="0"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
            />
          </div>

          {/* Tamanhos Disponíveis */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Tamanhos Disponíveis
            </label>
            <input
              type="text"
              placeholder="Ex: 38, 39, 40, 41, 42"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.sizes}
              onChange={(e) =>
                setFormData({ ...formData, sizes: e.target.value })
              }
              required
            />
          </div>

          {/* Cor */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">Cor</label>
            <input
              type="text"
              placeholder="Ex: Preto"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-600">
            Descrição
          </label>
          <textarea
            rows={3}
            placeholder="Digite os detalhes e especificações do produto..."
            className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Status do Produto */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-600">
            Status do Produto
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: "Ativo" })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                formData.active === "Ativo"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Ativo
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: "Inativo" })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                formData.active === "Inativo"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Inativo
            </button>
          </div>
        </div>

        {/* Visualização de Fotos Existentes no Modo Edição */}
        {formMode === "edit" && existingImages.length > 0 && (
          <div className="flex flex-col space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Fotos Atuais Cadastradas no Banco ({existingImages.length})
              </span>
              <span className="text-xs text-slate-500">
                Galeria atual do produto
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              {existingImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs w-20 h-20 flex flex-col items-center justify-center shrink-0"
                >
                  <img
                    src={imgUrl}
                    alt={`Foto atual #${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[10px] text-white text-center py-0.5 font-semibold">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic pt-1">
              * Para manter as fotos atuais, basta não anexar novas fotos. Se selecionar novos arquivos abaixo, eles atualizarão a galeria deste produto.
            </p>
          </div>
        )}

        {/* Upload de Imagens com Mini Thumbnails Visuais */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-600">
            {formMode === "edit" ? "Substituir / Adicionar Novas Imagens" : "Imagens do Produto"}{" "}
            <span className="text-red-500 font-bold">
              {formMode === "create" ? "* (Mínimo 2, Máximo 6)" : "(Opcional na edição - Mín 2, Máx 6 se anexar)"}
            </span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5">
                <span className="font-bold">+</span>
                <span>
                  {selectedFiles.length === 0
                    ? "Adicionar Imagem"
                    : "Adicionar Mais Imagens"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
              <span className="text-sm font-medium text-slate-600">
                {selectedFiles.length === 0
                  ? "Nenhuma nova imagem selecionada"
                  : `${selectedFiles.length} de 6 ${selectedFiles.length === 1 ? "foto selecionada" : "fotos selecionadas"}`}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Dica: você pode clicar no botão várias vezes para ir adicionando fotos uma por uma.
            </p>

            {/* Mini Thumbnails Visuais das Imagens Selecionadas */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="relative group flex flex-col items-center bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-1.5 shadow-xs transition-all w-28 shrink-0"
                  >
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 relative">
                      <img
                        src={previewUrls[idx]}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/70 hover:bg-red-600 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Remover esta foto"
                      >
                        ×
                      </button>
                    </div>
                    <span
                      className="text-[11px] text-slate-600 truncate w-full text-center mt-1.5 px-0.5"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60"
          >
            {saving
              ? "Salvando..."
              : formMode === "edit"
                ? "Atualizar produto"
                : "Cadastrar Produto"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
