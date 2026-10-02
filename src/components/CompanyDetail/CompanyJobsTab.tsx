import { memo, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Briefcase, SearchX } from "lucide-react";
import type { Job } from "../../types/job";
import { getLocationName } from "../../utils/lookups";
import { JobCard } from "../JobCard";
import { CompanyJobsFilter } from "./CompanyJobsFilter";
import { Pagination } from "../Pagination/Pagination";

const JOBS_PER_PAGE = 3;

interface CompanyJobsTabProps {
  jobs: Job[];
  companyName: string;
}

export const CompanyJobsTab = memo(
  ({ jobs, companyName }: CompanyJobsTabProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Sync filtros y paginación con la URL
    const search = searchParams.get("q") || searchParams.get("search") || "";
    const modality = searchParams.get("modality") || "";
    const salary = searchParams.get("salary") || "";
    const date = searchParams.get("date") || "";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const rawPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const hasActiveFilters = Boolean(search || modality || salary || date);

    // Helper para actualizar filtros en la URL resguardando otros parámetros (ej. tab)
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
            // Al modificar cualquier filtro se reinicia a la página 1
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

    const handleModalityChange = useCallback(
      (val: string) => updateSearchParam("modality", val),
      [updateSearchParam]
    );

    const handleSalaryChange = useCallback(
      (val: string) => updateSearchParam("salary", val),
      [updateSearchParam]
    );

    const handleDateChange = useCallback(
      (val: string) => updateSearchParam("date", val),
      [updateSearchParam]
    );

    const handleReset = useCallback(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("q");
          next.delete("search");
          next.delete("modality");
          next.delete("salary");
          next.delete("date");
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

    // Filtrado reactivo de vacantes de la empresa
    const filteredJobs = useMemo(() => {
      const query = search.trim().toLowerCase();
      const now = Date.now();
      const DAY_MS = 24 * 60 * 60 * 1000;

      return jobs.filter((job) => {
        // 1. Búsqueda por texto (título, descripción, tecnologías)
        if (query) {
          const techs = Array.isArray(job.data?.technology)
            ? job.data.technology.join(" ").toLowerCase()
            : (job.data?.technology || "").toLowerCase();
          const content = `${job.title} ${job.description} ${techs}`.toLowerCase();
          if (!content.includes(query)) return false;
        }

        // 2. Modalidad
        if (modality) {
          const jobModality =
            job.data?.modality ||
            (job.idLocation === "remoto" ? "remoto" : undefined);
          if (jobModality !== modality) return false;
        }

        // 3. Salario mínimo
        if (salary) {
          const jobSalary = Number(job.data?.salary || job.salary || 0);
          const minSalary = Number(salary);
          if (jobSalary < minSalary) return false;
        }

        // 4. Fecha y Urgencia
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

        return true;
      });
    }, [jobs, search, modality, salary, date]);

    // Paginación con mínimo 3 vacantes por página
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
    const currentPage = Math.min(rawPage, totalPages);

    const paginatedJobs = useMemo(() => {
      const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
      return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
    }, [filteredJobs, currentPage]);

    return (
      <div className="space-y-6">
        {/* Header / Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
          <h2 className="text-lg font-bold text-white">
            Vacantes activas en {companyName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {jobs.length}{" "}
            {jobs.length === 1 ? "oferta publicada" : "ofertas publicadas"}
          </p>
        </div>

        {/* Componente minimalista de filtros si la empresa tiene vacantes */}
        {jobs.length > 0 && (
          <CompanyJobsFilter
            search={search}
            onSearchChange={handleSearchChange}
            modality={modality}
            onModalityChange={handleModalityChange}
            salary={salary}
            onSalaryChange={handleSalaryChange}
            date={date}
            onDateChange={handleDateChange}
            totalJobs={jobs.length}
            filteredCount={filteredJobs.length}
            onReset={handleReset}
          />
        )}

        {/* Lista de empleos filtrados/paginados o estado vacío */}
        {paginatedJobs.length > 0 ? (
          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#1e293b]">
              {paginatedJobs.map((job) => (
                <JobCard key={job.idJob} idJob={job.idJob}>
                  <JobCard.Title title={job.title} idJob={job.idJob} />
                  <JobCard.Company company={companyName} />
                  <JobCard.Location location={getLocationName(job.idLocation)} />
                  <JobCard.Description description={job.description} />
                  <JobCard.Badges
                    salaryText={job.data?.salaryText || job.salaryText}
                    modality={job.data?.modality}
                    workSchedule={job.data?.workSchedule || job.workSchedule}
                    isUrgent={job.data?.isUrgent ?? job.isUrgent}
                    experienceYears={
                      job.data?.experienceYears || job.experienceYears
                    }
                  />
                </JobCard>
              ))}
            </div>

            {/* Paginación en la URL */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        ) : jobs.length > 0 ? (
          <div className="p-10 text-center border border-white/5 rounded-2xl bg-slate-900/40 backdrop-blur-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">
              No se encontraron vacantes con estos filtros
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Prueba modificando tus términos de búsqueda o restablece los
              filtros para ver todas las ofertas de {companyName}.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-1 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Ver todas las vacantes
              </button>
            )}
          </div>
        ) : (
          <div className="p-12 text-center border border-white/5 rounded-2xl bg-slate-900/30 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">
              No hay ofertas activas actualmente
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Esta empresa no cuenta con vacantes abiertas en este momento.
              Vuelve a consultar pronto.
            </p>
          </div>
        )}
      </div>
    );
  },
);

CompanyJobsTab.displayName = "CompanyJobsTab";
