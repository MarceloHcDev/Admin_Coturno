import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../components/organisms/Sidebar";
import PageHeader from "../components/molecules/PageHeader";
import SearchInput from "../components/atoms/SearchInput";
import ProductTable, { Product } from "../components/organisms/ProductTable";
import { api } from "../services/api";

export interface ProductFormData {
  name: string;
  productType: string;
  model: string;
  brand: string;
  description: string;
  active: "Ativo" | "Inativo" | string;
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
}

type FormMode = "create" | "edit" | null;

export default function Produtos_Catalogo(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    productType: "",
    model: "",
    brand: "",
    description: "",
    active: "Ativo",
    price: "",
    stock: "",
    sizes: "",
    color: "",
  });

  // -------------------------------------------------------------
  // ETAPA 4: Carregar Produtos da API (GET /api/v1/produtos)
  // -------------------------------------------------------------
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/produtos");
      const listaApi = response.data?.data || [];

      // Mapeia os dados da API para a interface Product da tabela
      const formatados: Product[] = listaApi.map((p: any) => ({
        id: p.id,
        name: p.name || p.model || "Sem Nome",
        productType: p.productType || p.product_type || "Geral",
        model: p.model || "",
        brand: p.brand || "",
        description: p.description || "",
        active:
          p.active === "Ativo" || p.status === "ativo" ? "Ativo" : "Inativo",
        price: Number(p.price || 0),
        stock: Number(p.stock || 0),
        sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes || "38-44",
        color: p.color || "",
      }));

      setProducts(formatados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // -------------------------------------------------------------
  // Formulário: Abrir para Edição ou Criação
  // -------------------------------------------------------------
  const handleEdit = (id: string | number): void => {
    const product = products.find((p) => String(p.id) === String(id));
    if (product) {
      setFormData({
        name: product.name,
        productType: product.productType,
        model: product.model,
        brand: product.brand,
        description: product.description || "",
        active: product.active,
        price: product.price,
        stock: product.stock,
        sizes: product.sizes,
        color: product.color,
      });
      setSelectedFiles([]);
      setEditingId(id);
      setFormMode("edit");
    }
  };

  const handleOpenCreate = (): void => {
    setFormData({
      name: "",
      productType: "",
      model: "",
      brand: "",
      description: "",
      active: "Ativo",
      price: "",
      stock: "",
      sizes: "",
      color: "",
    });
    setSelectedFiles([]);
    setFormMode("create");
  };

  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
    setSelectedFiles([]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > 6) {
        alert("Você pode adicionar no máximo 6 imagens ao todo.");
        return combined.slice(0, 6);
      }
      return combined;
    });

    // Limpa o valor do input para permitir selecionar a próxima imagem (1 por 1)
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove: number): void => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // -------------------------------------------------------------
  // ETAPA 3: Criar / Editar Produto na API (POST /api/v1/admin/produtos)
  // -------------------------------------------------------------
  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // Validação obrigatória de imagens ao criar
    if (
      formMode === "create" &&
      (selectedFiles.length < 2 || selectedFiles.length > 6)
    ) {
      alert(
        "É obrigatório anexar no mínimo 2 e no máximo 6 imagens do produto.",
      );
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("model", formData.model || formData.name);
      data.append("product_type", formData.productType);
      data.append("brand", formData.brand);
      data.append("description", formData.description || "Sem descrição");
      data.append("color", formData.color);
      data.append("price", String(formData.price || 0));
      data.append("stock", String(formData.stock || 0));
      data.append("sizes", formData.sizes);
      data.append("active", formData.active === "Ativo" ? "1" : "0");

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          data.append("images[]", file);
        });
        // retrocompatibilidade caso o backend leia campo único
        data.append("image", selectedFiles[0]);
      }

      if (formMode === "edit" && editingId !== null) {
        // Para update via multipart/form-data no Laravel, enviamos POST com _method=PUT
        data.append("_method", "PUT");
        await api.post(`/admin/products/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Produto atualizado com sucesso!");
      } else {
        await api.post("/admin/produtos", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Produto cadastrado com sucesso!");
      }

      handleCloseForm();
      await carregarProdutos(); // Atualiza a tabela na hora
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      const msg =
        error.response?.data?.message ||
        "Falha ao salvar produto. Verifique os dados.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Exclusão de Produto (DELETE /api/v1/admin/products/{id})
  // -------------------------------------------------------------
  const handleDelete = async (id: string | number): Promise<void> => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      alert("Produto excluído com sucesso!");
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error);
      alert("Falha ao excluir produto.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.productType &&
        product.productType.toLowerCase().includes(searchTerm.toLowerCase())),
  );

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
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {formMode === "edit"
                  ? "Editar Produto"
                  : "Cadastrar Novo Produto"}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      Modelo
                    </label>
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

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      Marca
                    </label>
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

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      Cor
                    </label>
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

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">
                    Status do Produto
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, active: "Ativo" })
                      }
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
                      onClick={() =>
                        setFormData({ ...formData, active: "Inativo" })
                      }
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

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">
                    Imagens do Produto{" "}
                    <span className="text-red-500 font-bold">
                      * (Mínimo 2, Máximo 6)
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
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="text-sm font-medium text-slate-600">
                        {selectedFiles.length === 0
                          ? "Nenhuma imagem selecionada"
                          : `${selectedFiles.length} de 6 ${selectedFiles.length === 1 ? "imagem selecionada" : "imagens selecionadas"}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Dica: você pode clicar no botão várias vezes para ir
                      adicionando fotos uma por uma.
                    </p>

                    {/* Previews / Nomes das imagens selecionadas com botão de remoção */}
                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedFiles.map((file, idx) => (
                          <div
                            key={`${file.name}-${idx}`}
                            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 pl-2.5 pr-1.5 py-1 rounded text-xs border border-slate-200 transition-colors"
                          >
                            <span className="font-semibold text-blue-600">
                              #{idx + 1}
                            </span>
                            <span
                              className="truncate max-w-40"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer ml-0.5"
                              title="Remover esta imagem"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

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
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
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
