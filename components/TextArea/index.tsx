import { ChangeEvent } from "react";

export type TextAreaConfig = {
  id: string;
  label: string;
  value: string | undefined;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  center?: boolean;
  error?: string;
  name?: string;
  required?: boolean;
  rows?: number;
  showRequiredIndicator?: boolean;
};

export const TextArea = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
  onFocus,
  onBlur,
  center,
  error,
  name,
  required,
  rows = 4,
}: TextAreaConfig) => (
  <div className={`${center ? "flex flex-col items-center" : ""}`}>
    <div className={`relative last:mb-0 ${error ? "mb-6" : ""}`}>
      <label
        className={`block text-xs mb-2 transition-colors duration-200 ${
          error ? "text-red-500" : "text-primary"
        }`}
        htmlFor={id}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`block w-full py-4 outline-none text-base sm:text-sm bg-white transition-all duration-300 resize-none ${
          error
            ? "border-b-[3px] border-b-red-500 focus:border-b-red-500"
            : "border-b-[3px] border-b-secondary focus:border-b-primary"
        } ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
      />
      {!!error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm animate-fadeIn">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}
    </div>
  </div>
);
