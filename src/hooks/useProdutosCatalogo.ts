import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Product } from "../components/organisms/ProductTable";
import { api } from "../services/api";
import { ToastType } from "../components/molecules/Toast";

export const AVAILABLE_SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

export const createInitialGrade = (): Record<number, number> => {
  const g: Record<number, number> = {};
  AVAILABLE_SIZES.forEach((s) => {
    g[s] = s >= 37 && s <= 44 ? 5 : 0;
  });
  return g;
};

export interface ProductFormData {
  name: string;
  productType: string;
  terrainType: string;
  model: string;
  brand: string;
  description: string;
  active: "Ativo" | "Inativo" | string;
  price: number | string;
  costPrice: number | string;
  stock: number | string;
  sizes: string;
  grade: Record<number, number>;
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
  terrainType: "",
  model: "",
  brand: "",
  description: "",
  active: "Ativo",
  price: "",
  costPrice: "",
  stock: 40,
  sizes: "37, 38, 39, 40, 41, 42, 43, 44",
  grade: createInitialGrade(),
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
          terrainType: p.terrainType || p.terrain_type || "",
          model: p.model || "",
          brand: p.brand || "",
          description: p.description || "",
          active:
            p.active === "Ativo" || p.status === "ativo" ? "Ativo" : "Inativo",
          price: Number(p.price || 0),
          costPrice:
            p.costPrice !== undefined
              ? p.costPrice
              : p.cost_price !== undefined
                ? p.cost_price
                : "",
          stock: Number(p.stock || 0),
          sizes: Array.isArray(p.sizes)
            ? p.sizes.join(", ")
            : p.sizes || "38-44",
          grade: Array.isArray(p.grade) ? p.grade : [],
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
      const initialG: Record<number, number> = {};
      AVAILABLE_SIZES.forEach((s) => (initialG[s] = 0));

      if (Array.isArray(product.grade) && product.grade.length > 0) {
        product.grade.forEach((item: any) => {
          const s = Number(item.size || item.tamanho);
          if (AVAILABLE_SIZES.includes(s)) {
            initialG[s] = Number(item.stock || item.quantidade || 0);
          }
        });
      } else if (product.sizes) {
        const parsedSizes = product.sizes
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n) && AVAILABLE_SIZES.includes(n));
        const total = Number(product.stock) || 0;
        const each =
          parsedSizes.length > 0
            ? Math.max(1, Math.round(total / parsedSizes.length))
            : 0;
        parsedSizes.forEach((s) => (initialG[s] = each));
      }

      setFormData({
        name: product.name,
        productType: product.productType,
        terrainType: product.terrainType || "",
        model: product.model,
        brand: product.brand,
        description: product.description || "",
        active: product.active,
        price: product.price,
        costPrice: product.costPrice !== undefined ? product.costPrice : "",
        stock: product.stock,
        sizes: product.sizes,
        grade: initialG,
        color: product.color,
      });
      setSelectedFiles([]);
      setExistingImages(
        product.images || (product.image ? [product.image] : []),
      );
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
      showToast(
        "Você já atingiu o limite máximo de 6 fotos no total.",
        "warning",
      );
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
      showToast("O produto pode ter no máximo 6 imagens no total.", "warning");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("model", formData.model || formData.name);
      data.append("product_type", formData.productType);
      if (formData.terrainType) {
        data.append("terrain_type", formData.terrainType);
      }
      data.append("brand", formData.brand);
      data.append("description", formData.description || "Sem descrição");
      data.append("color", formData.color);
      data.append("price", String(formData.price || 0));
      if (formData.costPrice !== "" && formData.costPrice !== undefined) {
        data.append("cost_price", String(formData.costPrice));
      }

      // Processa a grade de tamanhos e quantidades
      const activeItems = Object.entries(formData.grade || {})
        .map(([s, q]) => ({ size: Number(s), stock: Number(q) || 0 }))
        .filter((item) => item.stock > 0);

      const totalStock = activeItems.reduce((acc, item) => acc + item.stock, 0);
      const sizesString = activeItems.map((item) => item.size).join(", ");

      data.append("stock", String(totalStock));
      data.append("sizes", sizesString || "38-44");

      activeItems.forEach((item, idx) => {
        data.append(`grade[${idx}][size]`, String(item.size));
        data.append(`grade[${idx}][stock]`, String(item.stock));
      });

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

  // Marcas mais frequentes nos produtos cadastrados (Top 8)
  const topMarcas = products.reduce((acc: Record<string, number>, p) => {
    const brand = p.brand?.trim();
    if (brand) {
      acc[brand] = (acc[brand] || 0) + 1;
    }
    return acc;
  }, {});

  const topMarcasLista = Object.entries(topMarcas)
    .sort((a, b) => b[1] - a[1])
    .map(([brand]) => brand)
    .slice(0, 8);

  // Tipos de produto mais frequentes nos produtos cadastrados (Top 8)
  const topTipos = products.reduce((acc: Record<string, number>, p) => {
    const type = p.productType?.trim();
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});

  const topTiposLista = Object.entries(topTipos)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => type)
    .slice(0, 8);

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
    topMarcas: topMarcasLista,
    topTipos: topTiposLista,
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
