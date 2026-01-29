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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {safeValues?.map?.((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-200"
          >
            <Image
              src={url}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 translate-y-2 group-hover:translate-y-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )) ?? []}
        {safeValues.length < maxImages && (
          <div
            onClick={() => !isUploading && inputRef?.current?.click?.()}
            className={cn(
              "group relative aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden transition-all duration-300",
              !isUploading && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer hover:shadow-sm"
            )}
          >
            {isUploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-xs font-medium text-gray-500">Enviando...</span>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors p-2 text-center">
                <div className="p-3 rounded-full bg-white shadow-sm ring-1 ring-gray-200 mb-2 group-hover:ring-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">
                  Adicionar
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  {safeValues.length}/{maxImages}
                </span>
              </div>
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
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
          <X className="h-3 w-3" />
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
