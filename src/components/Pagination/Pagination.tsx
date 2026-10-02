import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Calcula la lista de páginas visible de forma validada:
 * - Muestra la página actual
 * - Incluye los 3 números siguientes según la página en la que esté
 * - Valida y ajusta si está en la última página o cerca del final
 * - Incluye elipsis (...) y extremos cuando corresponda
 */
export const getVisiblePages = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 1) return [1];

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Se muestran la página actual y los 3 números siguientes
  let end = Math.min(totalPages, currentPage + 3);
  let start = Math.max(1, currentPage - 1);

  // Si está en la primera página
  if (currentPage === 1) {
    start = 1;
    end = Math.min(totalPages, 4);
  }

  // Si está cerca del final o en la última página, asegurar que se muestren las anteriores
  if (totalPages - currentPage < 3) {
    end = totalPages;
    start = Math.max(1, totalPages - 3);
  }

  const pages: (number | string)[] = [];

  // Agregar primera página y elipsis si está lejos del inicio
  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push("dots-start");
    }
  }

  // Agregar rango calculado
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Agregar elipsis y última página si está lejos del final
  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push("dots-end");
    }
    pages.push(totalPages);
  }

  return pages;
};

export const Pagination = memo(
  ({ currentPage = 1, totalPages, onPageChange }: PaginationProps) => {
    // Validación de límites seguros
    const safeTotalPages = Math.max(0, totalPages || 0);

    if (safeTotalPages <= 0) {
      return null;
    }

    const validCurrentPage = Math.max(
      1,
      Math.min(currentPage || 1, safeTotalPages),
    );

    const isFirstPage = validCurrentPage === 1;
    const isLastPage = validCurrentPage >= safeTotalPages;

    const visiblePages = useMemo(
      () => getVisiblePages(validCurrentPage, safeTotalPages),
      [validCurrentPage, safeTotalPages],
    );

    const handlePrevPage = (): void => {
      if (!isFirstPage) {
        onPageChange(validCurrentPage - 1);
      }
    };

    const handleNextPage = (): void => {
      if (!isLastPage) {
        onPageChange(validCurrentPage + 1);
      }
    };

    const handlePageClick = (page: number): void => {
      if (page !== validCurrentPage && page >= 1 && page <= safeTotalPages) {
        onPageChange(page);
      }
    };

    return (
      <div
        className="flex flex-col items-center justify-center gap-3 my-10 w-full animate-in fade-in duration-300"
        aria-label="Paginación de resultados"
      >
        {/* Controles de Paginación */}
        <nav
          className="inline-flex items-center gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-xl"
          aria-label="Controles de navegación de páginas"
        >
          {/* Botón Anterior */}
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={isFirstPage}
            aria-label="Ir a la página anterior"
            title={
              isFirstPage
                ? "Estás en la primera página"
                : `Ir a la página ${validCurrentPage - 1}`
            }
            className={`h-10 px-3 sm:px-3.5 flex items-center gap-1.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isFirstPage
                ? "opacity-35 text-slate-500 cursor-not-allowed bg-white/[0.02] border border-white/5"
                : "text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 hover:border-white/20 active:scale-95 shadow-sm"
            }`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Números de Página y Elipsis */}
          <div className="flex items-center gap-1">
            {visiblePages.map((item) => {
              if (typeof item === "string") {
                return (
                  <span
                    key={item}
                    className="w-7 sm:w-8 h-10 flex items-center justify-center text-slate-500 font-bold select-none text-xs tracking-widest"
                    aria-hidden="true"
                  >
                    •••
                  </span>
                );
              }

              const isActive = item === validCurrentPage;

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => handlePageClick(item)}
                  aria-label={`Página ${item}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-9 sm:w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-400 text-white pointer-events-none"
                      : "text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-white/5 hover:border-white/15 active:scale-95"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Botón Siguiente */}
          <button
            type="button"
            onClick={handleNextPage}
            disabled={isLastPage}
            aria-label="Ir a la página siguiente"
            title={
              isLastPage
                ? "Estás en la última página"
                : `Ir a la página ${validCurrentPage + 1}`
            }
            className={`h-10 px-3 sm:px-3.5 flex items-center gap-1.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isLastPage
                ? "opacity-35 text-slate-500 cursor-not-allowed bg-white/[0.02] border border-white/5"
                : "text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 hover:border-white/20 active:scale-95 shadow-sm"
            }`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
