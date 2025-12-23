"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const presetColors = [
  "#22c55e", // green-500
  "#16a34a", // green-600
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#f97316", // orange-500
  "#ef4444", // red-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#eab308", // yellow-500
  "#6366f1", // indigo-500
  "#000000", // black
  "#374151", // gray-700
];

export function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value ?? '#22c55e'}
            onChange={(e) => onChange?.(e?.target?.value ?? '#22c55e')}
            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value ?? '#22c55e'}
          onChange={(e) => onChange?.(e?.target?.value ?? '#22c55e')}
          className="flex-1 h-10 rounded-lg border border-gray-300 px-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
          maxLength={7}
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {presetColors?.map?.((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange?.(color)}
            className={cn(
              "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
              value === color ? "border-gray-900 scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
          />
        )) ?? []}
      </div>
    </div>
  );
}
