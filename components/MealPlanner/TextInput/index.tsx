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
  <div className="relative">
    <label
      className="block absolute translate-y-1 text-xs left-3 transition-all"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      id={id}
      className="block mb-10 h-12 rounded md:w-2/3 p-4 pt-7 outline-none w-full bg-[#a5c8fa]/[0.1] border border-current border-solid"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode="text"
      autoComplete="off"
    />
  </div>
);
