"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Plus, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

export interface ColorOption {
  name: string;
  value: string;
  isCustom?: boolean;
}

export const DEFAULT_COLORS: ColorOption[] = [
  { name: "Preto", value: "#000000" },
  { name: "Branco", value: "#FFFFFF" },
  { name: "Cinza", value: "#6B7280" },
  { name: "Vermelho", value: "#EF4444" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Amarelo", value: "#EAB308" },
  { name: "Vinho", value: "#7C2D12" },
  { name: "Verde", value: "#22C55E" },
  { name: "Laranja", value: "#F97316" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Roxo", value: "#8B5CF6" },
  { name: "Marrom", value: "#78350F" },
];

interface ColorSelectorProps {
  label?: string;
  selectedColors: ColorOption[];
  onChange: (colors: ColorOption[]) => void;
  className?: string;
  error?: string;
}

export function ColorSelector({
  label,
  selectedColors = [],
  onChange,
  className,
  error,
}: ColorSelectorProps) {
  const [showCustomForm, setShowCustomForm] = React.useState(false);
  const [customName, setCustomName] = React.useState("");
  const [customColor, setCustomColor] = React.useState("#000000");

  const safeSelectedColors = selectedColors ?? [];

  const isColorSelected = (color: ColorOption) => {
    return safeSelectedColors.some(
      (c) => c?.value?.toLowerCase?.() === color?.value?.toLowerCase?.()
    );
  };

  const toggleColor = (color: ColorOption) => {
    if (isColorSelected(color)) {
      onChange?.(safeSelectedColors.filter(
        (c) => c?.value?.toLowerCase?.() !== color?.value?.toLowerCase?.()
      ));
    } else {
      onChange?.([...safeSelectedColors, color]);
    }
  };

  const addCustomColor = () => {
    if (!customName?.trim?.()) return;
    
    const newColor: ColorOption = {
      name: customName.trim(),
      value: customColor,
      isCustom: true,
    };
    
    if (!isColorSelected(newColor)) {
      onChange?.([...safeSelectedColors, newColor]);
    }
    
    setCustomName("");
    setCustomColor("#000000");
    setShowCustomForm(false);
  };

  const removeColor = (color: ColorOption) => {
    onChange?.(safeSelectedColors.filter(
      (c) => c?.value?.toLowerCase?.() !== color?.value?.toLowerCase?.()
    ));
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Cores Padrão */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Cores padrão:</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color)}
              className={cn(
                "relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                isColorSelected(color)
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {isColorSelected(color) && (
                <Check
                  className={cn(
                    "absolute inset-0 m-auto h-4 w-4",
                    color.value === "#FFFFFF" || color.value === "#EAB308"
                      ? "text-gray-800"
                      : "text-white"
                  )}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cores Selecionadas */}
      {safeSelectedColors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Cores selecionadas:</p>
          <div className="flex flex-wrap gap-2">
            {safeSelectedColors.map((color, index) => (
              <div
                key={`${color?.value ?? ''}-${index}`}
                className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                <span
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color?.value ?? '#000' }}
                />
                <span className="text-gray-700">{color?.name ?? 'Cor'}</span>
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="p-0.5 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adicionar Cor Personalizada */}
      {!showCustomForm ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCustomForm(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar cor personalizada
        </Button>
      ) : (
        <div className="p-3 bg-gray-50 rounded-xl space-y-3">
          <p className="text-sm font-medium text-gray-700">Nova cor personalizada</p>
          <div className="flex gap-3">
            <Input
              placeholder="Nome da cor (ex: Azul Metálico)"
              value={customName}
              onChange={(e) => setCustomName(e?.target?.value ?? '')}
              className="flex-1"
            />
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e?.target?.value ?? '#000000')}
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={addCustomColor}>
              Adicionar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCustomForm(false);
                setCustomName("");
                setCustomColor("#000000");
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
