import { TextInputConfig } from "@/hooks/useInputConfig";

export const TextInput = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  type,
  max,
  className, 
}: TextInputConfig) => (
  <div className={`relative last:mb-0 ${className}`}>
    <label className="block absolute text-xs left-4 top-1" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      className="block h-12 rounded p-4 pt-7 outline-none w-full bg-[#a5c8fa]/[0.1]"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode={type === "number" ? "numeric" : "text"}
      autoComplete="off"
      max={max}
    />
  </div>
);
