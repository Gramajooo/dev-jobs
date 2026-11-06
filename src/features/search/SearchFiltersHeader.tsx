import { memo } from "react";
import { X } from "lucide-react";

interface SearchFiltersHeaderProps {
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

export const SearchFiltersHeader = memo(
  ({ hasActiveFilters, onClearAll }: SearchFiltersHeaderProps) => {
    return (
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
        <span className="text-sm font-semibold text-white">
          Filtros de búsqueda
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-red-500/15 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-red-500/25 hover:border-red-500/50 hover:text-white active:scale-95"
            aria-label="Eliminar todos los filtros seleccionados"
            title="Restablecer todos los filtros"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Limpiar todo</span>
          </button>
        )}
      </div>
    );
  },
);

SearchFiltersHeader.displayName = "SearchFiltersHeader";
