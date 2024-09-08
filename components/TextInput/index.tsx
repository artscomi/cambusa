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
  center?: boolean
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
}: TextInputConfig) => (
  <div className={`${center ? 'flex flex-col items-center' : ''}`}>
  <div className={`relative last:mb-0`}>
    <label className="block absolute text-xs left-4 top-2" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      className={`block h-12 rounded p-4 pt-8 outline-none w-full bg-[#a5c8fa]/[0.1] shadow-inner text-sm ${className}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode={type === "number" ? "numeric" : "text"}
      autoComplete="off"
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </div>
  </div>
);
