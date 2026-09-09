// src/components/atoms/ImageUploadInput.tsx
import React, { useState, ChangeEvent } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploadInputProps {
  id: string;
  label: string;
  recommendedSize?: string;
  currentImageUrl?: string;
  onImageChange: (file: File | null) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  id,
  label,
  recommendedSize,
  currentImageUrl,
  onImageChange,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Dropzone Container */}
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full md:w-2/3 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-600 font-medium">
              Clique para selecionar <span className="font-normal">ou arraste a imagem</span>
            </p>
            {recommendedSize && (
              <p className="text-xs text-gray-500">
                Dimensão recomendada: {recommendedSize} (PNG, JPG ou WEBP)
              </p>
            )}
            {fileName && (
              <p className="mt-2 text-xs font-semibold text-emerald-600 truncate max-w-xs">
                Arquivo selecionado: {fileName}
              </p>
            )}
          </div>
          <input
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        {/* Preview Container */}
        <div className="w-full md:w-1/3 h-40 border border-gray-200 rounded-lg bg-gray-100 flex flex-col items-center justify-center overflow-hidden relative">
          {preview ? (
            <img
              src={preview}
              alt={`Pré-visualização de ${label}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <span className="text-xs text-gray-400 block">Sem imagem definida</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};