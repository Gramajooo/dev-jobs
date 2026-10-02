import { memo } from "react";
import { Search, X, Laptop, Banknote, Calendar } from "lucide-react";
import { FilterSelect } from "../SearchFilters/FilterSelect";
import type { FilterOption } from "../SearchFilters/types";
import modalityOptionsData from "../../data/modalityOptions.json";
import salaryOptionsData from "../../data/salaryOptions.json";
import dateOptionsData from "../../data/dateOptions.json";

export interface CompanyJobsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  modality: string;
  onModalityChange: (value: string) => void;
  salary: string;
  onSalaryChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  totalJobs: number;
  filteredCount: number;
  onReset: () => void;
}

export const CompanyJobsFilter = memo(
  ({
    search,
    onSearchChange,
    modality,
    onModalityChange,
    salary,
    onSalaryChange,
    date,
    onDateChange,
    totalJobs,
    filteredCount,
    onReset,
  }: CompanyJobsFilterProps) => {
    const hasActiveFilters = Boolean(search || modality || salary || date);

    return (
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-sm space-y-3">
        {/* Fila superior: Input de búsqueda y botón Limpiar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" aria-hidden="true" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar vacante por puesto o palabra clave..."
              className="w-full pl-10 pr-9 py-2 bg-[#242d3a]/90 hover:bg-slate-700/90 border border-white/10 hover:border-white/20 rounded-xl text-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Borrar búsqueda"
                aria-label="Borrar término de búsqueda"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="shrink-0 inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold cursor-pointer transition-all active:scale-95"
              title="Restablecer todos los filtros"
              aria-label="Restablecer filtros"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Fila de selectores minimalistas: Modalidad, Salario, Fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Modalidad */}
          <FilterSelect
            id="company-filter-modality"
            name="modality"
            value={modality}
            placeholder="Modalidad"
            options={modalityOptionsData as FilterOption[]}
            icon={<Laptop className="w-3.5 h-3.5" />}
            onChange={(e) => onModalityChange(e.target.value)}
            onClear={modality ? () => onModalityChange("") : undefined}
          />

          {/* 2. Salario */}
          <FilterSelect
            id="company-filter-salary"
            name="salary"
            value={salary}
            placeholder="Salario mínimo"
            options={salaryOptionsData as FilterOption[]}
            icon={<Banknote className="w-3.5 h-3.5" />}
            onChange={(e) => onSalaryChange(e.target.value)}
            onClear={salary ? () => onSalaryChange("") : undefined}
          />

          {/* 3. Fecha */}
          <FilterSelect
            id="company-filter-date"
            name="date"
            value={date}
            placeholder="Fecha de publicación"
            options={dateOptionsData as FilterOption[]}
            icon={<Calendar className="w-3.5 h-3.5" />}
            onChange={(e) => onDateChange(e.target.value)}
            onClear={date ? () => onDateChange("") : undefined}
          />
        </div>

        {/* Contador discreto cuando hay filtros activos */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>
              Mostrando <strong className="text-sky-400 font-semibold">{filteredCount}</strong> de{" "}
              <strong className="text-white">{totalJobs}</strong> vacantes
            </span>
          </div>
        )}
      </div>
    );
  },
);

CompanyJobsFilter.displayName = "CompanyJobsFilter";
