import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Product } from "../components/organisms/ProductTable";
import { api } from "../services/api";
import { ToastType } from "../components/molecules/Toast";

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

export interface ToastState {
  message: string;
  type: ToastType;
}

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
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Estados de Toast e Confirmação de Exclusão
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // -------------------------------------------------------------
  // Carregar Produtos da API (GET /api/v1/produtos)
  // -------------------------------------------------------------
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/produtos");
      const listaApi = response.data?.data || [];

      const backendBase = (
        import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1"
      ).replace(/\/api\/v1\/?$/, "");

      const formatados: Product[] = listaApi.map((p: any) => {
        const rawImages: string[] =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : p.image
              ? [p.image]
              : [];

        const formattedImages = rawImages.map((img: string) => {
          if (img.startsWith("/") && !img.startsWith("http")) {
            return `${backendBase}${img}`;
          }
          return img;
        });

        return {
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
          image: formattedImages[0] || "",
          images: formattedImages,
        };
      });

      setProducts(formatados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      showToast("Não foi possível carregar a lista de produtos.", "error");
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
      setExistingImages(product.images || (product.image ? [product.image] : []));
      setEditingId(id);
      setFormMode("edit");
    }
  };

  const handleOpenCreate = (): void => {
    setFormData(initialFormData);
    setSelectedFiles([]);
    setExistingImages([]);
    setFormMode("create");
  };

  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
    setSelectedFiles([]);
    setExistingImages([]);
  };

  // -------------------------------------------------------------
  // Handlers de Upload e Remoção de Imagens
  // -------------------------------------------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const rawFiles = e.target.files ? Array.from(e.target.files) : [];
    if (rawFiles.length === 0) return;

    const baseCount = formMode === "edit" ? existingImages.length : 0;
    const currentSelectedCount = selectedFiles.length;
    const maxAvailable = 6 - (baseCount + currentSelectedCount);

    if (maxAvailable <= 0) {
      showToast("Você já atingiu o limite máximo de 6 fotos no total.", "warning");
      e.target.value = "";
      return;
    }

    let filesToAdd = rawFiles;
    if (rawFiles.length > maxAvailable) {
      showToast(
        `Você só pode adicionar mais ${maxAvailable} foto(s) para completar o limite de 6.`,
        "warning",
      );
      filesToAdd = rawFiles.slice(0, maxAvailable);
    }

    setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove: number): void => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveExistingImage = (indexToRemove: number): void => {
    setExistingImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      const totalFotosRestantes = updated.length + selectedFiles.length;
      if (totalFotosRestantes < 2) {
        showToast(
          "Atenção: o produto precisa ter no mínimo 2 fotos. Adicione novas imagens para completar.",
          "warning",
        );
      }
      return updated;
    });
  };

  // -------------------------------------------------------------
  // Salvar Produto (POST /api/v1/admin/produtos ou PUT)
  // -------------------------------------------------------------
  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const totalFotos =
      (formMode === "edit" ? existingImages.length : 0) + selectedFiles.length;

    if (totalFotos < 2) {
      showToast(
        "É obrigatório ter no mínimo 2 imagens para o produto (adicione fotos para completar).",
        "warning",
      );
      return;
    }

    if (totalFotos > 6) {
      showToast(
        "O produto pode ter no máximo 6 imagens no total.",
        "warning",
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

      // Se for edição, envia as imagens mantidas do banco
      if (formMode === "edit") {
        existingImages.forEach((imgUrl) => {
          data.append("existing_images[]", imgUrl);
        });
      }

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
        showToast("Produto atualizado com sucesso!", "success");
      } else {
        await api.post("/admin/produtos", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Produto cadastrado com sucesso!", "success");
      }

      handleCloseForm();
      await carregarProdutos();
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      const msg =
        error.response?.data?.message ||
        "Falha ao salvar produto. Verifique os dados informados.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Excluir Produto (Modal de Confirmação)
  // -------------------------------------------------------------
  const handleDelete = (id: string | number): void => {
    const product = products.find((p) => String(p.id) === String(id));
    if (product) {
      setDeletingProduct(product);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deletingProduct) return;

    try {
      setIsDeleting(true);
      await api.delete(`/admin/products/${deletingProduct.id}`);
      setProducts((prev) =>
        prev.filter((p) => String(p.id) !== String(deletingProduct.id)),
      );
      showToast("Produto excluído com sucesso!", "success");
      setDeletingProduct(null);
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error);
      showToast("Falha ao excluir produto. Tente novamente.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (): void => {
    setDeletingProduct(null);
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
    existingImages,
    filteredProducts,
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
  };
}
