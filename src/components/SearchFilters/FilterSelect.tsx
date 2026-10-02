import { memo } from "react";
import { ChevronDown, X } from "lucide-react";
import type { FilterSelectProps } from "./types";

export const FilterSelect = memo(
  ({
    id,
    name,
    value,
    placeholder,
    options,
    icon,
    onChange,
    onClear,
    className = "",
  }: FilterSelectProps) => {
    const isSelected = Boolean(value) && value !== "relevance";

    return (
      <div className={`relative flex-1 min-w-[170px] group ${className}`.trim()}>
        <div className="relative flex items-center">
          {icon && (
            <span
              className={`absolute left-3.5 pointer-events-none transition-colors duration-200 ${
                isSelected
                  ? "text-sky-400"
                  : "text-slate-400 group-hover:text-slate-200"
              }`}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            aria-label={placeholder}
            className={`w-full appearance-none py-2.5 pr-10 text-sm rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              icon ? "pl-10" : "pl-4"
            } ${
              isSelected
                ? "bg-slate-800 text-sky-200 border border-sky-500/50 shadow-sm shadow-sky-500/15 font-semibold"
                : "bg-[#242d3a]/90 hover:bg-slate-700/90 text-slate-200 border border-white/10 hover:border-white/20"
            }`}
          >
            <option value="" className="bg-[#1e293b] text-slate-400">
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#1e293b] text-slate-200 font-normal"
              >
                {option.label}
              </option>
            ))}
          </select>

          {isSelected && onClear ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-sky-500/20 hover:bg-rose-500/30 text-sky-300 hover:text-rose-200 border border-sky-500/30 hover:border-rose-500/40 transition-all duration-150 z-10 cursor-pointer shadow-sm"
              title={`Eliminar filtro ${placeholder}`}
              aria-label={`Eliminar filtro ${placeholder}`}
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
            </button>
          ) : (
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    );
  },
);

FilterSelect.displayName = "FilterSelect";
