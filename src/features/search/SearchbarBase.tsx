import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export interface SearchbarBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
  children?: ReactNode;
}

export const SearchbarBase = ({
  value,
  onChange,
  onClear,
  className,
  placeholder,
  children,
  ...inputProps
}: SearchbarBaseProps) => {
  const hasValue = Boolean(value && value.toString().length > 0);

  return (
    <div
      className={`flex items-center bg-[#1e293b] rounded-xl shadow-lg p-2 gap-2 border border-white/10 w-full ${className || ""}`}
    >
      <span
        className="pl-3 text-slate-400 flex items-center shrink-0"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none text-white py-3 px-2 text-base min-w-0 placeholder:text-slate-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputProps}
      />

      {hasValue && onClear && (
        <button
          type="button"
          className="flex items-center justify-center bg-transparent border-none text-slate-400 p-1.5 rounded-full cursor-pointer transition-all duration-200 mr-1 shrink-0 hover:bg-white/10 hover:text-slate-100 hover:scale-105 active:scale-95"
          onClick={onClear}
          aria-label="Borrar texto de búsqueda"
          title="Borrar texto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {children}
    </div>
  );
};
