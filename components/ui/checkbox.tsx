"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({
  label,
  checked,
  onChange,
  className,
  disabled,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          checked
            ? "bg-green-500 border-green-500"
            : "bg-white border-gray-300 hover:border-green-500"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
