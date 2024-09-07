import { TextInputConfig } from "@/hooks/useInputConfig";

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
}: TextInputConfig) => (
  <div className={`relative last:mb-0 `}>
    <label className="block absolute text-xs left-4 top-1" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      className={`block h-12 rounded p-4 pt-7 outline-none w-full bg-[#a5c8fa]/[0.1] ${className}`}
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
);
