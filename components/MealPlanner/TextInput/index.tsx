type TextInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput = ({
  id,
  label,
  value,
  placeholder,
  onChange,
}: TextInputProps) => (
  <div className="relative mb-8 last:mb-0">
    <label
      className="block absolute translate-y-1 text-xs left-3 transition-all"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      id={id}
      className="block h-12 rounded p-4 pt-7 outline-none w-full bg-[#a5c8fa]/[0.1]"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode="text"
      autoComplete="off"
    />
  </div>
);
