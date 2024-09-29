export type TextInputConfig = {
  id: string;
  label: string;
  value: string;
  type: "number" | "text";
  placeholder: string;
  inputType: "numeric" | "text";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  center?: boolean;
  error?: string;
  name?: string
  required?: boolean
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
  required
}: TextInputConfig) => (
  <div className={`${center ? "flex flex-col items-center" : ""}`}>
    <div className={`relative last:mb-0`}>
      <label className="block absolute text-xs left-4 top-[0.3rem]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`block h-14 sm:h-12 rounded p-4 pt-8 outline-none w-full text-base sm:text-sm bg-white sm:bg-gray-50 shadow-inner transition-all duration-300 ${
          error
            ? "shadow-[0_0_0_1px_rgba(239,68,68,0.75)]" // Red shadow
            : "shadow-[0_0_0_1px_rgba(156,163,175,0.5)]" // Gray shadow for normal state
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
        <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>
      )}
    </div>
  </div>
);
