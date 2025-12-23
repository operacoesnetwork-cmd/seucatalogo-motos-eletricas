"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, ImageIcon, Plus } from "lucide-react";
import Image from "next/image";

interface UploadedImage {
  url: string;
  key?: string;
}

interface MultiImageUploadProps {
  label?: string;
  values: string[];
  keys?: string[];
  onChange: (urls: string[], keys?: string[]) => void;
  className?: string;
  maxImages?: number;
  error?: string;
}

export function MultiImageUpload({
  label,
  values = [],
  keys = [],
  onChange,
  className,
  maxImages = 6,
  error,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const safeValues = values ?? [];
  const safeKeys = keys ?? [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e?.target?.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - safeValues.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setUploadError(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = filesToUpload.map(async (file): Promise<UploadedImage> => {
        if (!file?.type?.startsWith?.("image/")) {
          throw new Error("Arquivo inválido");
        }
        if ((file?.size ?? 0) > 10 * 1024 * 1024) {
          throw new Error("Imagem muito grande");
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response?.ok) throw new Error("Erro no upload");
        const data = await response?.json?.();
        return { url: data?.url ?? '', key: data?.key ?? '' };
      });

      const newImages = await Promise.all(uploadPromises);
      const newUrls = newImages.map(img => img.url).filter(Boolean);
      const newKeys = newImages.map(img => img.key ?? '').filter(Boolean);
      
      onChange?.(
        [...safeValues, ...newUrls],
        [...safeKeys, ...newKeys]
      );
    } catch (err) {
      setUploadError("Erro ao fazer upload das imagens");
    } finally {
      setIsUploading(false);
      if (inputRef?.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newValues = safeValues.filter((_, i) => i !== index);
    const newKeys = safeKeys.filter((_, i) => i !== index);
    onChange?.(newValues, newKeys);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-3">
        {safeValues?.map?.((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
          >
            <Image
              src={url}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )) ?? []}
        {safeValues.length < maxImages && (
          <div
            onClick={() => inputRef?.current?.click?.()}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50 cursor-pointer flex flex-col items-center justify-center text-gray-400 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            ) : (
              <>
                <Plus className="h-6 w-6" />
                <span className="text-xs mt-1">Adicionar</span>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      {(error || uploadError) && (
        <p className="mt-1 text-sm text-red-500">{error || uploadError}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        {safeValues.length}/{maxImages} imagens (convertidas para WebP)
      </p>
    </div>
  );
}
