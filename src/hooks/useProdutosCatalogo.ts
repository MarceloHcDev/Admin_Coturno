import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Product } from "../components/organisms/ProductTable";
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

export type FormMode = "create" | "edit" | null;

const initialFormData: ProductFormData = {
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
};

export function useProdutosCatalogo() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // -------------------------------------------------------------
  // Carregar Produtos da API (GET /api/v1/produtos)
  // -------------------------------------------------------------
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/produtos");
      const listaApi = response.data?.data || [];

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
  // Handlers de Abertura / Fechamento do Formulário
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
    setFormData(initialFormData);
    setSelectedFiles([]);
    setFormMode("create");
  };

  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
    setSelectedFiles([]);
  };

  // -------------------------------------------------------------
  // Handlers de Upload de Imagens
  // -------------------------------------------------------------
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

    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove: number): void => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // -------------------------------------------------------------
  // Salvar Produto (POST /api/v1/admin/produtos ou PUT)
  // -------------------------------------------------------------
  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

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
        data.append("image", selectedFiles[0]);
      }

      if (formMode === "edit" && editingId !== null) {
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
      await carregarProdutos();
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
  // Excluir Produto (DELETE /api/v1/admin/products/{id})
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

  // Filtro de busca
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.productType &&
        product.productType.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return {
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
  };
}
