// src/components/atoms/ImageUploadInput.tsx
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Monitor, Smartphone, X } from "lucide-react";
import { UploadIcon } from "./Icons";

export type ImageVariant = "desktop" | "mobile" | "single";

interface ImageUploadInputProps {
  id: string;
  label: string;
  recommendedSize?: string;
  currentImageUrl?: string;
  variant?: ImageVariant;
  cloudinaryPublicId?: string;
  onImageChange: (file: File | null) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  id,
  label,
  recommendedSize,
  currentImageUrl,
  variant,
  cloudinaryPublicId,
  onImageChange,
}) => {
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null,
  );
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!fileName) {
      setPreview(currentImageUrl || null);
    }
  }, [currentImageUrl, fileName]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setFileName(file.name);
      setPreview(objectUrl);
      onImageChange(file);
    }
  };

  const handleClear = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFileName("");
    setPreview(currentImageUrl || null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onImageChange(null);
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800"
        >
          {variant === "desktop" && (
            <Monitor className="w-4 h-4 text-blue-700" />
          )}
          {variant === "mobile" && (
            <Smartphone className="w-4 h-4 text-purple-700" />
          )}
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {variant === "desktop" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Desktop
            </span>
          )}
          {variant === "mobile" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Mobile
            </span>
          )}
          {cloudinaryPublicId && (
            <span
              className="text-[11px] font-mono text-slate-400 hidden sm:inline"
              title="Identificador preparado para o Cloudinary"
            >
              {cloudinaryPublicId}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        {/* Dropzone Container */}
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full sm:w-3/5 min-h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center py-4 px-3 text-center">
            <UploadIcon className="w-7 h-7 mb-1.5 text-gray-400" />
            <p className="mb-1 text-xs sm:text-sm text-gray-600 font-medium">
              Clique para selecionar{" "}
              <span className="font-normal">ou arraste a imagem</span>
            </p>
            {recommendedSize && (
              <p className="text-[11px] text-gray-500">
                Dimensão recomendada: {recommendedSize} (PNG, JPG ou WEBP)
              </p>
            )}
            {fileName && (
              <p className="mt-1.5 text-xs font-semibold text-emerald-600 truncate max-w-55">
                Selecionado: {fileName}
              </p>
            )}
          </div>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        {/* Preview Container */}
        <div className="w-full sm:w-2/5 min-h-32 max-h-40 border border-gray-200 rounded-lg bg-gray-100 flex flex-col items-center justify-center overflow-hidden relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt={`Pré-visualização de ${label}`}
                className="w-full h-full object-cover"
              />
              {fileName && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Remover arquivo selecionado"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            <div className="text-center p-3">
              <span className="text-xs text-gray-400 block">
                Sem imagem definida
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
