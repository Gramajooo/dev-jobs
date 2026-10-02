import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { JobListings } from "../components/JobListings";
import { Pagination } from "../components/Pagination/Pagination";
import { DebouncedSearchbar } from "../components/Searchbar";
import { type FilterValues } from "../components/SearchFilters";
import { SearchFilters } from "../components/SearchFilters/SearchFilters";
import type { Job } from "../types/job";
import { getAllJobs } from "../utils/lookups";
import { matchesJobTokens, tokenize } from "../utils/search";

/**
 * Constantes inmutables de configuración
 */
const ALL_JOBS: readonly Job[] = getAllJobs();
const RESULTS_PER_PAGE = 5;

/**
 * Función constante pura para filtrar empleos según texto tokenizado y filtros.
 * Definida fuera del componente para evitar recreación de funciones en memoria.
 */
const filterJobsList = (
  jobs: readonly Job[],
  searchText: string,
  filters: FilterValues,
): Job[] => {
  let filtered = [...jobs];
  const queryTokens = tokenize(searchText);

  if (queryTokens.length > 0) {
    filtered = filtered.filter((job) => matchesJobTokens(job, queryTokens));
  }

  const {
    technology,
    location,
    experienceLevel,
    sortBy,
    date,
    salary,
    workSchedule,
    modality,
  } = filters;

  const hasAnyFilter = Boolean(
    technology ||
    location ||
    experienceLevel ||
    date ||
    salary ||
    workSchedule ||
    modality,
  );

  if (hasAnyFilter) {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    filtered = filtered.filter((job) => {
      // 1. Filtro de Tecnología
      if (technology) {
        const techs = Array.isArray(job.data?.technology)
          ? job.data.technology
          : job.data?.technology
            ? [job.data.technology]
            : [];
        if (!techs.includes(technology)) return false;
      }

      // 2. Filtro de Ubicación
      if (location) {
        if (job.idLocation !== location && job.data?.modality !== location) {
          return false;
        }
      }

      // 3. Filtro de Experiencia
      if (experienceLevel) {
        const exp =
          job.data?.experienceYears || job.experienceYears || job.data?.level;
        if (exp !== experienceLevel && job.data?.level !== experienceLevel) {
          return false;
        }
      }

      // 4. Filtro de Fecha y Urgencia
      if (date) {
        if (date === "urgent") {
          if (!job.data?.isUrgent && !job.isUrgent) return false;
        } else {
          const createdAtStr = job.data?.createdAt || job.createdAt;
          if (createdAtStr) {
            const jobTime = new Date(createdAtStr).getTime();
            const diffDays = Math.max(0, (now - jobTime) / DAY_MS);

            if (date === "today" && diffDays > 1) return false;
            if (date === "3days" && diffDays > 3) return false;
            if (date === "1week" && diffDays > 7) return false;
            if (date === "1month" && diffDays > 30) return false;
            if (date === "3months" && diffDays > 90) return false;
          }
        }
      }

      // 5. Filtro de Salario (mínimo en Quetzales)
      if (salary) {
        const jobSalary = Number(job.data?.salary || job.salary || 0);
        const minSalary = Number(salary);
        if (jobSalary < minSalary) return false;
      }

      // 6. Filtro de Jornada Laboral
      if (workSchedule) {
        const jobSchedule = job.data?.workSchedule || job.workSchedule;
        if (jobSchedule !== workSchedule) return false;
      }

      // 7. Filtro de Modalidad
      if (modality) {
        const jobModality =
          job.data?.modality ||
          (job.idLocation === "remoto" ? "remoto" : undefined);
        if (jobModality !== modality) return false;
      }

      return true;
    });
  }

  // Ordenamiento
  if (sortBy === "date") {
    filtered.sort((a, b) => {
      const timeA = new Date(a.data?.createdAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.data?.createdAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  } else if (sortBy === "salary") {
    filtered.sort((a, b) => {
      const salA = Number(a.data?.salary || a.salary || 0);
      const salB = Number(b.data?.salary || b.salary || 0);
      return salB - salA;
    });
  }

  return filtered;
};

/**
 * Función constante pura para paginar resultados.
 */
const paginateJobsList = (
  items: readonly Job[],
  page: number,
  pageSize: number,
): Job[] => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Single Source of Truth: Leer búsqueda, filtros y paginación desde la URL
  const searchText = useMemo(
    () => searchParams.get("q") || searchParams.get("search") || "",
    [searchParams],
  );

  const filters = useMemo<FilterValues>(
    () => ({
      technology: searchParams.get("technology") || "",
      location: searchParams.get("location") || "",
      experienceLevel:
        searchParams.get("experienceLevel") || searchParams.get("level") || "",
      sortBy: searchParams.get("sortBy") || "relevance",
      date: searchParams.get("date") || "",
      salary: searchParams.get("salary") || "",
      workSchedule: searchParams.get("workSchedule") || "",
      modality: searchParams.get("modality") || "",
    }),
    [searchParams],
  );

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const rawPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Helper centralizado para actualizar query params resguardando la URL
  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>, resetPage: boolean = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (
              value !== null &&
              value !== "" &&
              (key !== "sortBy" || value !== "relevance")
            ) {
              next.set(key, value);
            } else {
              next.delete(key);
              if (key === "q") next.delete("search");
              if (key === "experienceLevel") next.delete("level");
            }
          });

          if (resetPage) {
            next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // 1. Filtrado reactivo memoizado
  const filteredJobs = useMemo(
    () => filterJobsList(ALL_JOBS, searchText, filters),
    [searchText, filters],
  );

  // 2. Cálculo eficiente del total de páginas
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredJobs.length / RESULTS_PER_PAGE)),
    [filteredJobs.length],
  );

  // 3. Ajuste de página válida
  const currentPage = Math.min(rawPage, totalPages);

  // 4. Porción de resultados paginados
  const currentJobs = useMemo(
    () => paginateJobsList(filteredJobs, currentPage, RESULTS_PER_PAGE),
    [filteredJobs, currentPage],
  );

  // Callbacks estables de eventos que persisten en la URL
  const handleDebouncedSearch = useCallback(
    (value: string) => {
      updateQueryParams({ q: value.trim() || null }, true);
    },
    [updateQueryParams],
  );

  const handleFilterSearch = useCallback(
    (newFilters: FilterValues) => {
      updateQueryParams(
        {
          technology: newFilters.technology || null,
          location: newFilters.location || null,
          experienceLevel: newFilters.experienceLevel || null,
          sortBy:
            newFilters.sortBy && newFilters.sortBy !== "relevance"
              ? newFilters.sortBy
              : null,
          date: newFilters.date || null,
          salary: newFilters.salary || null,
          workSchedule: newFilters.workSchedule || null,
          modality: newFilters.modality || null,
        },
        true,
      );
    },
    [updateQueryParams],
  );

  const handleResetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        if (prev.has("q")) next.set("q", prev.get("q")!);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateQueryParams({ page: page > 1 ? page.toString() : null }, false);
    },
    [updateQueryParams],
  );

  return (
    <main className="max-w-7xl mx-auto pt-12 pb-20 px-4 w-full">
      <section className="text-center mb-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
          Encuentra tu próximo trabajo
        </h1>
        <p className="text-lg text-slate-400 mb-8 max-w-xl">
          Explora miles de oportunidades en el sector tecnológico.
        </p>

        <form
          id="empleos-search-form"
          role="search"
          className="w-full max-w-5xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <DebouncedSearchbar
            value={searchText}
            placeholder="Buscar trabajos, empresas o habilidades"
            onSearch={handleDebouncedSearch}
          />
          <SearchFilters
            filters={filters}
            onSearch={handleFilterSearch}
            onReset={handleResetFilters}
          />
        </form>
      </section>

      <section>
        <JobListings currentJobs={currentJobs} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </main>
  );
};

export default Jobs;
