import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Sparkles } from "lucide-react";
import { CompanyCard, CompanySearch } from "../components/Companies";
import { Pagination } from "../components/Pagination/Pagination";
import { getAllCompanies } from "../utils/lookups";
import locationsData from "../data/locations.json";
import { normalizeText } from "../utils/search";

const COMPANIES_PER_PAGE = 6;

export const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Single Source of Truth desde la URL
  const search = searchParams.get("q") || searchParams.get("search") || "";
  const selectedIndustry = searchParams.get("industry") || "";
  const selectedLocation = searchParams.get("location") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const rawPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const allCompanies = useMemo(() => getAllCompanies(), []);

  // Get unique industries from companies
  const industries = useMemo(() => {
    const set = new Set<string>();
    allCompanies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  }, [allCompanies]);

  // Helper para actualizar parametros de búsqueda en la URL
  const updateSearchParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
            if (key === "q") next.delete("search");
          }
          // Reinicia a la página 1 cuando cambia un filtro
          next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleSearchChange = useCallback(
    (val: string) => updateSearchParam("q", val),
    [updateSearchParam]
  );

  const handleIndustryChange = useCallback(
    (val: string) => updateSearchParam("industry", val),
    [updateSearchParam]
  );

  const handleLocationChange = useCallback(
    (val: string) => updateSearchParam("location", val),
    [updateSearchParam]
  );

  const handleResetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        next.delete("search");
        next.delete("industry");
        next.delete("location");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newPage > 1) {
            next.set("page", newPage.toString());
          } else {
            next.delete("page");
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return allCompanies.filter((company) => {
      // Search match
      if (normalizedSearch) {
        const searchable = normalizeText(
          `${company.name} ${company.industry} ${company.description} ${company.country}`
        );
        if (!searchable.includes(normalizedSearch)) return false;
      }

      // Industry match
      if (selectedIndustry && company.industry !== selectedIndustry) {
        return false;
      }

      // Location match
      if (selectedLocation && company.idLocation !== selectedLocation) {
        return false;
      }

      return true;
    });
  }, [allCompanies, search, selectedIndustry, selectedLocation]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE));
  const currentPage = Math.min(rawPage, totalPages);

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * COMPANIES_PER_PAGE;
    return filteredCompanies.slice(start, start + COMPANIES_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <header className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ecosistema Tech</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Empresas Contratando
        </h1>
        <p className="text-slate-400 text-base">
          Conoce a las compañías innovadoras que buscan talento tecnológico y explora sus vacantes disponibles.
        </p>
      </header>

      {/* Search and Filters */}
      <CompanySearch
        search={search}
        onSearchChange={handleSearchChange}
        selectedIndustry={selectedIndustry}
        onIndustryChange={handleIndustryChange}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        industries={industries}
        locations={locationsData}
        totalResults={filteredCompanies.length}
        onReset={handleResetFilters}
      />

      {/* Grid of Company Cards */}
      {paginatedCompanies.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCompanies.map((company) => (
              <CompanyCard key={company.idCompany} company={company} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="card-surface p-12 text-center max-w-md mx-auto flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">No se encontraron empresas</h2>
          <p className="text-slate-400 text-sm">
            No hay empresas que coincidan con los filtros seleccionados. Prueba modificando tus criterios de búsqueda.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </main>
  );
};

export default Companies;