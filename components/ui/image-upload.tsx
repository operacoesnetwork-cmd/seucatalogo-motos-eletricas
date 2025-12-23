"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string, key?: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: "square" | "video" | "banner";
  compact?: boolean;
  error?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = "square",
  compact = false,
  error,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith?.("image/")) {
      setUploadError("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("A imagem deve ter no máximo 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response?.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const data = await response?.json?.();
      onChange?.(data?.url ?? '', data?.key ?? '');
    } catch (err) {
      setUploadError("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden transition-colors",
          !value && "hover:border-green-500 hover:bg-green-50 cursor-pointer",
          aspectClasses[aspectRatio],
          compact && "max-w-[200px]"
        )}
        onClick={() => !value && inputRef?.current?.click?.()}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <button
              type="button"
              onClick={(e) => {
                e?.stopPropagation?.();
                onRemove?.();
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-10 w-10 mb-2" />
            <span className="text-sm">Clique para enviar</span>
            <span className="text-xs mt-1">PNG, JPG até 10MB (convertido para WebP)</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {(error || uploadError) && (
        <p className="mt-1 text-sm text-red-500">{error || uploadError}</p>
      )}
    </div>
  );
}
