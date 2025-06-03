import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          style={{
            accentColor: "var(--accent-light)",
            width: "1.5rem",
            height: "1.5rem",
            marginRight: "0.75rem",
            cursor: "pointer",
          }}
          className={cn(
            "rounded border-2 border-secondary checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            error && "border-red-500"
          )}
        />
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
