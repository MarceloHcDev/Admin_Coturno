import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../components/organisms/Sidebar";
import PageHeader from "../components/molecules/PageHeader";
import SearchInput from "../components/atoms/SearchInput";
import ProductTable, { Product } from "../components/organisms/ProductTable";
import ProductForm from "../components/organisms/ProductForm";
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
