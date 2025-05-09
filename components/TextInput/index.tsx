export type TextInputConfig = {
  id: string;
  label: string;
  value: string | undefined;
  type?: "number" | "text";
  placeholder: string;
  inputType?: "numeric" | "text";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  center?: boolean;
  error?: string;
  name?: string;
  required?: boolean;
};

export const TextInput = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  type,
  className,
  onFocus,
  onBlur,
  center,
  error,
  name,
  required,
}: TextInputConfig) => (
  <div className={`${center ? "flex flex-col items-center" : ""}`}>
    <div className={`relative last:mb-0 ${error ? "mb-6" : ""}`}>
      <label
        className={`block absolute text-xs left-0 top-[0.3rem] transition-colors duration-200 ${
          error ? "text-red-500" : "text-primary"
        }`}
        htmlFor={id}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        className={`block h-14 sm:h-12 py-4 pt-8 outline-none w-full text-base sm:text-sm bg-white transition-all duration-300 ${
          error
            ? "border-b-[3px] border-b-red-500 focus:border-b-red-500"
            : "border-b-[3px] border-b-secondary focus:border-b-primary"
        } ${className}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={type === "number" ? "numeric" : "text"}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        required={required}
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
