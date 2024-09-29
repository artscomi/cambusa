import { ChangeEvent } from "react";

interface TextAreaConfig {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  maxLength?: number;
}
export const TextArea = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
  rows = 4, // Default number of rows
  onFocus,
  onBlur,
  error,
  maxLength,
}: TextAreaConfig) => (
  <div className="relative last:mb-0">
    <label className="block absolute text-xs left-4 top-1" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      rows={rows}
      className={`block rounded p-4 pt-8 outline-none w-full text-sm bg-gray-50 shadow-inner transition-all duration-300 resize-none ${
        error
          ? "shadow-[0_0_0_1px_rgba(239,68,68,0.75)]" // Red shadow for error state
          : "shadow-[0_0_0_1px_rgba(156,163,175,0.5)]" // Gray shadow for normal state
      } ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      onFocus={onFocus}
      onBlur={onBlur}
      maxLength={maxLength}
    />
    {!!error && (
      <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>
    )}
  </div>
);
