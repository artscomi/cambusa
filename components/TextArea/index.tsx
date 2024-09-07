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
}: TextAreaConfig) => (
  <div className="relative last:mb-0">
    <label className="block absolute text-xs left-4 top-1" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      className={`block rounded p-4 pt-7 outline-none w-full bg-[#a5c8fa]/[0.1] resize-none ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete="off"
    />
  </div>
);
