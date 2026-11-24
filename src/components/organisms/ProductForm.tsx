import React, { ChangeEvent, FormEvent, useMemo, useEffect, useState, useRef } from "react";
import { ProductFormData, AVAILABLE_SIZES } from "../../hooks/useProdutosCatalogo";

export interface ProductFormProps {
  formMode: "create" | "edit";
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  selectedFiles: File[];
  existingImages?: string[];
  topMarcas?: string[];
  topTipos?: string[];
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onRemoveExistingImage?: (index: number) => void;
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
  topMarcas = [],
  topTipos = [],
  onFileChange,
  onRemoveFile,
  onRemoveExistingImage,
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

  const totalFotosAtivas =
    (formMode === "edit" ? existingImages.length : 0) + selectedFiles.length;
  const slotsRestantes = Math.max(0, 6 - totalFotosAtivas);

  const [bulkQuantity, setBulkQuantity] = useState<string>("5");
  const [activePopup, setActivePopup] = useState<"tipo" | "terreno" | "marca" | null>(null);

  const tipoRef = useRef<HTMLDivElement>(null);
  const terrenoRef = useRef<HTMLDivElement>(null);
  const marcaRef = useRef<HTMLDivElement>(null);

  // Fecha o popup somente quando o usuário clica fora do campo correspondente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        activePopup === "tipo" &&
        tipoRef.current &&
        !tipoRef.current.contains(target)
      ) {
        setActivePopup(null);
      } else if (
        activePopup === "terreno" &&
        terrenoRef.current &&
        !terrenoRef.current.contains(target)
      ) {
        setActivePopup(null);
      } else if (
        activePopup === "marca" &&
        marcaRef.current &&
        !marcaRef.current.contains(target)
      ) {
        setActivePopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopup]);

  // Calcula o total de estoque a partir da grade
  const totalGradeStock = useMemo(() => {
    if (!formData.grade) return 0;
    return Object.values(formData.grade).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
  }, [formData.grade]);

  const handleSizeStockChange = (size: number, qty: number) => {
    const updatedGrade = { ...(formData.grade || {}), [size]: qty };
    const total = Object.values(updatedGrade).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    const activeSizes = Object.entries(updatedGrade)
      .filter(([_, q]) => Number(q) > 0)
      .map(([s]) => s)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      grade: updatedGrade,
      stock: total,
      sizes: activeSizes,
    }));
  };

  const handleApplyToAll = (qty: number) => {
    const updatedGrade: Record<number, number> = {};
    AVAILABLE_SIZES.forEach((s) => (updatedGrade[s] = qty));
    const total = qty * AVAILABLE_SIZES.length;
    const activeSizes = qty > 0 ? AVAILABLE_SIZES.join(", ") : "";

    setFormData((prev) => ({
      ...prev,
      grade: updatedGrade,
      stock: total,
      sizes: activeSizes,
    }));
  };

  const handleApplyDefault37to44 = (qty: number = 5) => {
    const updatedGrade: Record<number, number> = {};
    AVAILABLE_SIZES.forEach((s) => {
      updatedGrade[s] = s >= 37 && s <= 44 ? qty : 0;
    });
    const total = qty * 8;
    const activeSizes = "37, 38, 39, 40, 41, 42, 43, 44";

    setFormData((prev) => ({
      ...prev,
      grade: updatedGrade,
      stock: total,
      sizes: activeSizes,
    }));
  };

  const handleClearAll = () => {
    handleApplyToAll(0);
  };

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
          <div ref={tipoRef} className="flex flex-col space-y-1 relative">
            <label className="text-sm font-medium text-slate-600">
              Tipo do produto
            </label>
            <input
              type="text"
              placeholder="Selecione ou digite o tipo..."
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
              value={formData.productType}
              onFocus={() => setActivePopup("tipo")}
              onClick={() => setActivePopup("tipo")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productType: e.target.value,
                })
              }
              required
            />
            {activePopup === "tipo" && topTipos && topTipos.length > 0 && (
              <div className="absolute top-full left-0 mt-1 z-30 w-full min-w-[240px] p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700">
                    Mais frequentes:
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    Clique para selecionar ou digite
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topTipos.map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, productType: tipo }));
                        setActivePopup(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        formData.productType?.toLowerCase() === tipo.toLowerCase()
                          ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                          : "bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border-slate-200"
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  💡 Clique em uma opção acima ou digite livremente no campo.
                </div>
              </div>
            )}
          </div>

          {/* Tipo de Terreno */}
          <div ref={terrenoRef} className="flex flex-col space-y-1 relative">
            <label className="text-sm font-medium text-slate-600">
              Tipo de Terreno
            </label>
            <input
              type="text"
              placeholder="Selecione ou digite o terreno..."
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
              value={formData.terrainType}
              onFocus={() => setActivePopup("terreno")}
              onClick={() => setActivePopup("terreno")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  terrainType: e.target.value,
                })
              }
            />
            {activePopup === "terreno" && (
              <div className="absolute top-full left-0 mt-1 z-30 w-full min-w-[240px] p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700">
                    Opções de Terreno:
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    Clique para selecionar ou digite
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Multiterreno", "Tático/Militar", "Urbano/Asfalto", "Trilha/Lama"].map(
                    (terreno) => (
                      <button
                        key={terreno}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, terrainType: terreno }));
                          setActivePopup(null);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                          formData.terrainType?.toLowerCase() === terreno.toLowerCase()
                            ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                            : "bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border-slate-200"
                        }`}
                      >
                        {terreno}
                      </button>
                    )
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  💡 Clique em uma opção acima ou digite livremente no campo.
                </div>
              </div>
            )}
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
          <div ref={marcaRef} className="flex flex-col space-y-1 relative">
            <label className="text-sm font-medium text-slate-600">Marca</label>
            <input
              type="text"
              placeholder="Selecione ou digite a marca..."
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
              value={formData.brand}
              onFocus={() => setActivePopup("marca")}
              onClick={() => setActivePopup("marca")}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
            {activePopup === "marca" && topMarcas && topMarcas.length > 0 && (
              <div className="absolute top-full left-0 mt-1 z-30 w-full min-w-[240px] p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700">
                    Mais frequentes:
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    Clique para selecionar ou digite
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topMarcas.map((marca) => (
                    <button
                      key={marca}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, brand: marca }));
                        setActivePopup(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        formData.brand?.toLowerCase() === marca.toLowerCase()
                          ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                          : "bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border-slate-200"
                      }`}
                    >
                      {marca}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  💡 Clique em uma opção acima ou digite livremente no campo.
                </div>
              </div>
            )}
          </div>

          {/* Preço de Venda */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Preço de Venda (R$)
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

          {/* Preço de Custo */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">
              Preço de Custo (R$)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
              value={formData.costPrice}
              onChange={(e) =>
                setFormData({ ...formData, costPrice: e.target.value })
              }
            />
          </div>

          {/* Cor */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-600">Cor Predominante</label>
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

        {/* Grade de Numeração e Estoque por Tamanho (35 ao 46) */}
        <div className="flex flex-col space-y-3 p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-slate-800">
                  Grade de Numeração e Estoque por Tamanho (35 ao 46)
                </label>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  Total: {totalGradeStock} pares
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Defina a quantidade exata para cada numeração. Os tamanhos com quantidade maior que zero serão exibidos na loja.
              </p>
            </div>

            {/* Ações rápidas */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleApplyDefault37to44(5)}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
                title="Aplica 5 unidades nos tamanhos de 37 a 44 e zera os outros"
              >
                Padrão (37 ao 44)
              </button>

              <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                <input
                  type="number"
                  min="0"
                  placeholder="Qtd"
                  className="w-12 px-1.5 py-1 text-center text-slate-800 outline-none text-xs"
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    const q = Math.max(0, parseInt(bulkQuantity || "0", 10));
                    handleApplyToAll(q);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border-l border-slate-200 transition-colors cursor-pointer"
                >
                  Aplicar a Todos
                </button>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Zerar
              </button>
            </div>
          </div>

          {/* Grid com os 12 tamanhos */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 pt-1">
            {AVAILABLE_SIZES.map((size) => {
              const qty = formData.grade?.[size] ?? 0;
              const hasStock = qty > 0;
              return (
                <div
                  key={size}
                  className={`flex flex-col items-center justify-between p-2 rounded-lg border transition-all ${
                    hasStock
                      ? "bg-white border-blue-400 shadow-xs ring-1 ring-blue-400/20"
                      : "bg-white/60 border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      hasStock ? "text-blue-700" : "text-slate-600"
                    }`}
                  >
                    Nº {size}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    className="w-full text-center mt-1 p-1 text-sm font-semibold border border-slate-200 rounded focus:border-blue-500 focus:outline-none text-slate-900 bg-white"
                    value={qty === 0 ? "" : qty}
                    placeholder="0"
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value || "0", 10));
                      handleSizeStockChange(size, isNaN(val) ? 0 : val);
                    }}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {hasStock ? `${qty} un.` : "0 un."}
                  </span>
                </div>
              );
            })}
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

        {/* Seção de Fotos do Produto com Validação Visual */}
        <div className="space-y-4 pt-2">
          {/* Status Geral de Fotos */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div>
              <span className="text-sm font-bold text-slate-800">
                Fotos do Produto
              </span>
              <span className="text-xs text-slate-400 ml-2">
                (Mínimo 2, Máximo 6 fotos)
              </span>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                totalFotosAtivas >= 2 && totalFotosAtivas <= 6
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {totalFotosAtivas} de 6 fotos{" "}
              {totalFotosAtivas < 2 && "(faltam fotos)"}
            </span>
          </div>

          {/* Fotos Atuais do Banco (se em edição) */}
          {formMode === "edit" && existingImages.length > 0 && (
            <div className="flex flex-col space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Fotos Atuais Cadastradas ({existingImages.length})
                </span>
                <span className="text-xs text-slate-500">
                  Clique no <span className="font-bold text-red-600">×</span>{" "}
                  para remover fotos do banco
                </span>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                {existingImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs w-24 h-24 flex flex-col items-center justify-center shrink-0 transition-transform hover:scale-102"
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto atual #${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[10px] text-white text-center py-0.5 font-semibold">
                      #{idx + 1} Atual
                    </span>
                    {onRemoveExistingImage && (
                      <button
                        type="button"
                        onClick={() => onRemoveExistingImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shadow-sm"
                        title="Remover esta foto do produto"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adição de Novas Fotos */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <label
                className={`border font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5 ${
                  slotsRestantes > 0
                    ? "cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    : "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                }`}
              >
                <span className="font-bold">+</span>
                <span>
                  {selectedFiles.length === 0
                    ? formMode === "edit"
                      ? `Adicionar Mais Fotos (${slotsRestantes} vaga${slotsRestantes === 1 ? "" : "s"})`
                      : "Adicionar Imagem"
                    : `Adicionar Mais (${slotsRestantes} vaga${slotsRestantes === 1 ? "" : "s"})`}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={slotsRestantes <= 0}
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>

              <span className="text-xs text-slate-500">
                {slotsRestantes > 0
                  ? `Você ainda pode selecionar mais ${slotsRestantes} foto(s) para completar.`
                  : "Limite máximo de 6 fotos atingido."}
              </span>
            </div>

            {/* Mini Thumbnails Visuais das Novas Fotos Selecionadas */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-xs font-semibold text-slate-600">
                  Novas fotos adicionadas para envio ({selectedFiles.length}):
                </span>
                <div className="flex flex-wrap gap-3 pt-1">
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
                          Nova #{idx + 1}
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
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex space-x-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving || totalFotosAtivas < 2 || totalFotosAtivas > 6}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
