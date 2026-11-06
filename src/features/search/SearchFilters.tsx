import { memo, useCallback, type ChangeEvent } from "react";
import {
  DEFAULT_FILTERS,
  FILTER_CONFIGS,
  FilterSelect,
  hasAnyFilterActive,
  isFilterActive,
  SearchFiltersHeader,
  type FilterOption,
  type FilterValues,
  type SearchFiltersProps,
} from "./";

export { FilterSelect };
export type { FilterOption, FilterValues, SearchFiltersProps };

export const SearchFilters = memo(
  ({ filters, onSearch, onReset }: SearchFiltersProps) => {
    const hasActiveFilters = hasAnyFilterActive(filters);

    const handleFilterChange = useCallback(
      (field: keyof FilterValues) =>
        (event: ChangeEvent<HTMLSelectElement>): void => {
          onSearch({
            ...DEFAULT_FILTERS,
            ...filters,
            [field]: event.target.value,
          });
        },
      [filters, onSearch],
    );

    const handleClearField = useCallback(
      (field: keyof FilterValues) => (): void => {
        onSearch({
          ...DEFAULT_FILTERS,
          ...filters,
          [field]: field === "sortBy" ? "relevance" : "",
        });
      },
      [filters, onSearch],
    );

    const handleClearAll = useCallback((): void => {
      onSearch(DEFAULT_FILTERS);
      onReset?.();
    }, [onSearch, onReset]);

    return (
      <div className="w-full mt-5 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
        {/* Encabezado con título y botón de reset */}
        <SearchFiltersHeader
          hasActiveFilters={hasActiveFilters}
          onClearAll={handleClearAll}
        />

        {/* Cuadrícula responsiva de selectores de filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FILTER_CONFIGS.map((config) => {
            const currentValue = filters?.[config.name] || "";
            const active = isFilterActive(config.name, currentValue);

            return (
              <FilterSelect
                key={config.id}
                id={config.id}
                name={config.name}
                value={currentValue}
                placeholder={config.placeholder}
                options={config.options}
                icon={config.icon}
                onChange={handleFilterChange(config.name)}
                onClear={active ? handleClearField(config.name) : undefined}
              />
            );
          })}
        </div>
      </div>
    );
  },
);

SearchFilters.displayName = "SearchFilters";

export default SearchFilters;
