"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, ImageIcon, ZoomIn, Check, RotateCcw } from "lucide-react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { Modal } from "@/components/ui/modal";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import getCroppedImg from "@/lib/canvas-utils";

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

  // Editor State
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [aspect, setAspect] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  };

  React.useEffect(() => {
    switch (aspectRatio) {
      case "video":
        setAspect(16 / 9);
        break;
      case "banner":
        setAspect(3 / 1);
        break;
      case "square":
      default:
        setAspect(1);
        break;
    }
  }, [aspectRatio]);

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

    setUploadError(null);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || null);
      setIsEditorOpen(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    });
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset input
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      setIsEditorOpen(false);

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      if (!croppedBlob) {
        throw new Error("Erro ao processar imagem");
      }

      await uploadFile(croppedBlob);
    } catch (e) {
      console.error(e);
      setUploadError("Erro ao processar imagem");
      setIsUploading(false);
    }
  };

  const uploadFile = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob); // Send blob directly

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response?.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const data = await response?.json?.();
      onChange?.(data?.url ?? "", data?.key ?? "");
    } catch (err) {
      console.error(err);
      setUploadError("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
      setImageSrc(null); // Clean up
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        className={cn(
          "group relative rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden transition-all duration-300",
          !value && !isUploading && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer hover:shadow-sm",
          aspectClasses[aspectRatio],
          compact && "max-w-[200px]"
        )}
        onClick={() => !value && !isUploading && inputRef?.current?.click?.()}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <span className="text-sm font-medium text-gray-500">Enviando...</span>
          </div>
        ) : value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            <button
              type="button"
              onClick={(e) => {
                e?.stopPropagation?.();
                onRemove?.();
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 translate-y-2 group-hover:translate-y-0"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
            <div className="p-4 rounded-full bg-white shadow-sm ring-1 ring-gray-200 mb-3 group-hover:ring-primary/20 group-hover:scale-110 transition-all duration-300">
              <ImageIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">
              Clique para enviar
            </span>
            <span className="text-xs text-gray-400 mt-1">
              JPG, PNG até 10MB
            </span>
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
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
          <X className="h-3 w-3" />
          {error || uploadError}
        </p>
      )}

      {/* Crop Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title="Editar Imagem"
        className="max-w-xl"
      >
        <div className="flex flex-col gap-6">
          <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden ring-1 ring-gray-200 shadow-inner">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="flex items-center gap-4 px-2">
            <ZoomIn className="h-4 w-4 text-gray-500" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
              className="flex-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditorOpen(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCrop}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
