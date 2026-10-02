import { memo, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";
import { FilterSelect } from "../SearchFilters/FilterSelect";

interface LocationItem {
  idLocation: string;
  name: string;
}

interface CompanySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  industries: string[];
  locations: LocationItem[];
  totalResults: number;
  onReset: () => void;
}

export const CompanySearch = memo(
  ({
    search,
    onSearchChange,
    selectedIndustry,
    onIndustryChange,
    selectedLocation,
    onLocationChange,
    industries,
    locations,
    totalResults,
    onReset,
  }: CompanySearchProps) => {
    const hasActiveFilters = Boolean(search || selectedIndustry || selectedLocation);

    const industryOptions = industries.map((ind) => ({
      value: ind,
      label: ind,
    }));

    const locationOptions = locations.map((loc) => ({
      value: loc.idLocation,
      label: loc.name,
    }));

    return (
      <section className="card-surface p-6 mb-8" aria-label="Búsqueda y filtros de empresas">
        {/* Search input */}
        <div className="relative w-full">
          <label htmlFor="company-search-input" className="sr-only">
            Buscar empresa por nombre o sector
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            id="company-search-input"
            type="text"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            placeholder="Buscar empresa por nombre o descripción..."
            className="w-full pl-11 pr-10 py-3 bg-[#242d3a] border border-white/10 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
              aria-label="Borrar término de búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters + Clear */}
        <div className="flex flex-wrap items-center gap-3 mt-4 w-full">
          <FilterSelect
            id="filter-company-industry"
            name="industry"
            value={selectedIndustry}
            placeholder="Todas las industrias"
            options={industryOptions}
            onChange={(e) => onIndustryChange(e.target.value)}
          />

          <FilterSelect
            id="filter-company-location"
            name="location"
            value={selectedLocation}
            placeholder="Todas las ubicaciones"
            options={locationOptions}
            onChange={(e) => onLocationChange(e.target.value)}
          />

          {hasActiveFilters && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-red-500/15 text-red-400 border border-red-500/35 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-red-500/25 hover:border-red-500/60 hover:text-red-300 hover:-translate-y-0.5 active:translate-y-0"
              onClick={onReset}
              aria-label="Limpiar filtros"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>
            Mostrando <strong className="text-white font-semibold">{totalResults}</strong>{" "}
            {totalResults === 1 ? "empresa encontrada" : "empresas encontradas"}
          </span>
        </div>
      </section>
    );
  }
);

CompanySearch.displayName = "CompanySearch";
