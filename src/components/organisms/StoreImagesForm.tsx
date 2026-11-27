// src/components/organisms/StoreImagesForm.tsx
import React, { useState, useEffect } from "react";
import { ImageUploadInput, ImageVariant } from "../atoms/ImageUploadInput";
import { api } from "../../services/api";

export type StoreImageSlotKey =
  | "hero_1_desktop"
  | "hero_1_mobile"
  | "hero_2_desktop"
  | "hero_2_mobile"
  | "hero_3_desktop"
  | "hero_3_mobile"
  | "promo_1_desktop"
  | "promo_1_mobile"
  | "promo_2_desktop"
  | "promo_2_mobile"
  | "promo_3_desktop"
  | "promo_3_mobile"
  | "colecao_1"
  | "colecao_2";

export interface StoreImageSlotConfig {
  key: StoreImageSlotKey;
  label: string;
  variant: ImageVariant;
  recommendedSize: string;
  cloudinaryFolder: string;
  cloudinaryPublicId: string;
}

interface CarouselSlideGroup {
  slideNumber: number;
  title: string;
  desktop: StoreImageSlotConfig;
  mobile: StoreImageSlotConfig;
}

export const HERO_SLIDES: CarouselSlideGroup[] = [
  {
    slideNumber: 1,
    title: "Imagem 1 do Hero",
    desktop: {
      key: "hero_1_desktop",
      label: "Anexo Desktop",
      variant: "desktop",
      recommendedSize: "1920x823px",
      cloudinaryFolder: "store/hero/desktop",
      cloudinaryPublicId: "hero_1_desktop",
    },
    mobile: {
      key: "hero_1_mobile",
      label: "Anexo Mobile",
      variant: "mobile",
      recommendedSize: "1080x1350px",
      cloudinaryFolder: "store/hero/mobile",
      cloudinaryPublicId: "hero_1_mobile",
    },
  },
  {
    slideNumber: 2,
    title: "Imagem 2 do Hero",
    desktop: {
      key: "hero_2_desktop",
      label: "Anexo Desktop",
      variant: "desktop",
      recommendedSize: "1920x823px",
      cloudinaryFolder: "store/hero/desktop",
      cloudinaryPublicId: "hero_2_desktop",
    },
    mobile: {
      key: "hero_2_mobile",
      label: "Anexo Mobile",
      variant: "mobile",
      recommendedSize: "1080x1350px",
      cloudinaryFolder: "store/hero/mobile",
      cloudinaryPublicId: "hero_2_mobile",
    },
  },
  {
    slideNumber: 3,
    title: "Imagem 3 do Hero",
    desktop: {
      key: "hero_3_desktop",
      label: "Anexo Desktop",
      variant: "desktop",
      recommendedSize: "1920x823px",
      cloudinaryFolder: "store/hero/desktop",
      cloudinaryPublicId: "hero_3_desktop",
    },
    mobile: {
      key: "hero_3_mobile",
      label: "Anexo Mobile",
      variant: "mobile",
      recommendedSize: "1080x1350px",
      cloudinaryFolder: "store/hero/mobile",
      cloudinaryPublicId: "hero_3_mobile",
    },
  },
];

export const PROMO_SLIDES: CarouselSlideGroup[] = [
  {
    slideNumber: 1,
    title: "Imagem 1 do Carrossel Promocional",
    desktop: {
      key: "promo_1_desktop",
      label: "Anexo Desktop",
      variant: "desktop",
      recommendedSize: "1200x400px",
      cloudinaryFolder: "store/promo/desktop",
      cloudinaryPublicId: "promo_1_desktop",
    },
    mobile: {
      key: "promo_1_mobile",
      label: "Anexo Mobile",
      variant: "mobile",
      recommendedSize: "800x600px",
      cloudinaryFolder: "store/promo/mobile",
      cloudinaryPublicId: "promo_1_mobile",
    },
  },
  {
    slideNumber: 2,
    title: "Imagem 2 do Carrossel Promocional",
    desktop: {
      key: "promo_2_desktop",
      label: "Anexo Desktop",
      variant: "desktop",
      recommendedSize: "1200x400px",
      cloudinaryFolder: "store/promo/desktop",
      cloudinaryPublicId: "promo_2_desktop",
    },
    mobile: {
      key: "promo_2_mobile",
      label: "Anexo Mobile",
      variant: "mobile",
      recommendedSize: "800x600px",
      cloudinaryFolder: "store/promo/mobile",
      cloudinaryPublicId: "promo_2_mobile",
    },
  },
  {
    slideNumber: 3,
    title: "Imagem 3 do Carrossel Promocional",
    desktop: {
      key: "promo_3_desktop",
      label: "Anexo Desktop",
      variant: "desktop",
      recommendedSize: "1200x400px",
      cloudinaryFolder: "store/promo/desktop",
      cloudinaryPublicId: "promo_3_desktop",
    },
    mobile: {
      key: "promo_3_mobile",
      label: "Anexo Mobile",
      variant: "mobile",
      recommendedSize: "800x600px",
      cloudinaryFolder: "store/promo/mobile",
      cloudinaryPublicId: "promo_3_mobile",
    },
  },
];

export const CATEGORY_SLOTS: Record<
  "colecao_1" | "colecao_2",
  StoreImageSlotConfig
> = {
  colecao_1: {
    key: "colecao_1",
    label: "Coleção 1",
    variant: "single",
    recommendedSize: "800x800px",
    cloudinaryFolder: "store/colecoes",
    cloudinaryPublicId: "colecao_1",
  },
  colecao_2: {
    key: "colecao_2",
    label: "Coleção 2",
    variant: "single",
    recommendedSize: "800x800px",
    cloudinaryFolder: "store/colecoes",
    cloudinaryPublicId: "colecao_2",
  },
};

const ALL_SLOTS: StoreImageSlotConfig[] = [
  ...HERO_SLIDES.flatMap((s) => [s.desktop, s.mobile]),
  ...PROMO_SLIDES.flatMap((s) => [s.desktop, s.mobile]),
  CATEGORY_SLOTS.colecao_1,
  CATEGORY_SLOTS.colecao_2,
];

export const StoreImagesForm: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<
    Partial<Record<StoreImageSlotKey, File | null>>
  >({});
  const [uploadedUrls, setUploadedUrls] = useState<
    Partial<Record<StoreImageSlotKey, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Carrega as imagens atuais salvas no banco ao abrir a página
  useEffect(() => {
    let active = true;

    const fetchCurrentStoreImages = async () => {
      try {
        const response = await api.get("/store-images");
        const data = response.data?.data;

        if (active && data && typeof data === "object") {
          const urlsMap: Partial<Record<StoreImageSlotKey, string>> = {};
          Object.keys(data).forEach((slotKey) => {
            if (data[slotKey]?.image_url) {
              urlsMap[slotKey as StoreImageSlotKey] = data[slotKey].image_url;
            }
          });
          setUploadedUrls(urlsMap);
        }
      } catch (err) {
        console.error("Não foi possível carregar as imagens prévias da loja:", err);
      }
    };

    fetchCurrentStoreImages();

    return () => {
      active = false;
    };
  }, []);

  const handleFileChange = (key: StoreImageSlotKey, file: File | null) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const selectedCount = ALL_SLOTS.filter((slot) =>
    Boolean(selectedFiles[slot.key]),
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const entriesToUpload = ALL_SLOTS.filter((slot) =>
      Boolean(selectedFiles[slot.key]),
    );

    if (entriesToUpload.length === 0) {
      setStatusMessage({
        type: "error",
        text: "Por favor, selecione ao menos uma imagem para enviar.",
      });
      return;
    }

    // FormData preparado para integração com Cloudinary no back-end:
    // envia cada arquivo pela sua chave única (ex: hero_1_desktop, promo_2_mobile, category_1)
    // e também um manifesto JSON com pasta/public_id de destino no Cloudinary.
    const formData = new FormData();
    const cloudinaryManifest: Array<{
      slot: StoreImageSlotKey;
      folder: string;
      public_id: string;
    }> = [];

    for (const slot of entriesToUpload) {
      const file = selectedFiles[slot.key];
      if (!file) continue;

      formData.append(slot.key, file);
      cloudinaryManifest.push({
        slot: slot.key,
        folder: slot.cloudinaryFolder,
        public_id: slot.cloudinaryPublicId,
      });
    }

    formData.append("cloudinary_manifest", JSON.stringify(cloudinaryManifest));

    setLoading(true);

    try {
      const response = await api.post("/upload-store-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      const isSuccess = data?.success === true || data?.status === "success";

      if (isSuccess) {
        if (data?.urls && typeof data.urls === "object") {
          setUploadedUrls((prev) => ({ ...prev, ...data.urls }));
        }
        setStatusMessage({
          type: "success",
          text:
            data?.message ||
            "Imagens enviadas e atualizadas no Cloudinary com sucesso!",
        });
      } else {
        setStatusMessage({
          type: "error",
          text:
            data?.message ||
            data?.error ||
            "Erro ao realizar o envio das imagens.",
        });
      }
    } catch (error: any) {
      console.error("Erro na requisição de upload de imagens da loja:", error);
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Falha na comunicação com o servidor. Verifique a conexão com o back-end.";
      setStatusMessage({
        type: "error",
        text: apiMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSlideGroup = (slide: CarouselSlideGroup) => (
    <div
      key={`${slide.desktop.key}-${slide.mobile.key}`}
      className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-sm font-semibold text-gray-800">{slide.title}</h3>
        <span className="text-xs text-gray-400">Desktop + Mobile</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ImageUploadInput
          id={slide.desktop.key}
          label={slide.desktop.label}
          variant={slide.desktop.variant}
          recommendedSize={slide.desktop.recommendedSize}
          cloudinaryPublicId={`${slide.desktop.cloudinaryFolder}/${slide.desktop.cloudinaryPublicId}`}
          currentImageUrl={uploadedUrls[slide.desktop.key]}
          onImageChange={(file) => handleFileChange(slide.desktop.key, file)}
        />
        <ImageUploadInput
          id={slide.mobile.key}
          label={slide.mobile.label}
          variant={slide.mobile.variant}
          recommendedSize={slide.mobile.recommendedSize}
          cloudinaryPublicId={`${slide.mobile.cloudinaryFolder}/${slide.mobile.cloudinaryPublicId}`}
          currentImageUrl={uploadedUrls[slide.mobile.key]}
          onImageChange={(file) => handleFileChange(slide.mobile.key, file)}
        />
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-10"
    >
      {/* Seção 1: Banner Principal (Hero) */}
      <section className="border-b border-gray-200 pb-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            1. Hero - Banner Principal (Home)
          </h2>
          <p className="text-sm text-gray-500">
            Imagens de destaque principal exibidas no topo do site (3 slides com
            versão Desktop e Mobile).
          </p>
        </div>
        <div className="space-y-4">{HERO_SLIDES.map(renderSlideGroup)}</div>
      </section>

      {/* Seção 2: Carrossel Promocional */}
      <section className="border-b border-gray-200 pb-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            2. Carrossel Promocional
          </h2>
          <p className="text-sm text-gray-500">
            Banner secundário rotativo para campanhas de desconto ou lançamentos
            (3 slides com versão Desktop e Mobile).
          </p>
        </div>
        <div className="space-y-4">{PROMO_SLIDES.map(renderSlideGroup)}</div>
      </section>

      {/* Seção 3: Coleção 1 */}
      <section className="border-b border-gray-200 pb-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            3. Coleção 1
          </h2>
          <p className="text-sm text-gray-500">
            Primeira imagem ilustrativa de coleção em destaque na página
            inicial.
          </p>
        </div>
        <ImageUploadInput
          id={CATEGORY_SLOTS.colecao_1.key}
          label={CATEGORY_SLOTS.colecao_1.label}
          variant={CATEGORY_SLOTS.colecao_1.variant}
          recommendedSize={CATEGORY_SLOTS.colecao_1.recommendedSize}
          cloudinaryPublicId={`${CATEGORY_SLOTS.colecao_1.cloudinaryFolder}/${CATEGORY_SLOTS.colecao_1.cloudinaryPublicId}`}
          currentImageUrl={uploadedUrls.colecao_1}
          onImageChange={(file) => handleFileChange("colecao_1", file)}
        />
      </section>

      {/* Seção 4: Coleção 2 */}
      <section className="pb-2 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            4. Coleção 2
          </h2>
          <p className="text-sm text-gray-500">
            Segunda imagem ilustrativa de coleção em destaque na página inicial.
          </p>
        </div>
        <ImageUploadInput
          id={CATEGORY_SLOTS.colecao_2.key}
          label={CATEGORY_SLOTS.colecao_2.label}
          variant={CATEGORY_SLOTS.colecao_2.variant}
          recommendedSize={CATEGORY_SLOTS.colecao_2.recommendedSize}
          cloudinaryPublicId={`${CATEGORY_SLOTS.colecao_2.cloudinaryFolder}/${CATEGORY_SLOTS.colecao_2.cloudinaryPublicId}`}
          currentImageUrl={uploadedUrls.colecao_2}
          onImageChange={(file) => handleFileChange("colecao_2", file)}
        />
      </section>

      {/* Feedback de status */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${statusMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {statusMessage.type === "success" ? (
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Ações do Formulário */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <span className="text-xs text-slate-500">
          {selectedCount === 0
            ? "Nenhuma imagem nova selecionada"
            : `${selectedCount} ${selectedCount === 1 ? "imagem selecionada" : "imagens selecionadas"} para envio`}
        </span>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-900 hover:bg-zinc-800 disabled:bg-blue-900/60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
        >
          {loading && (
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading ? "Enviando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};
