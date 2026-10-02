import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Building2 } from "lucide-react";

interface CompanyBreadcrumbProps {
  companyName: string;
}

export const CompanyBreadcrumb = memo(({ companyName }: CompanyBreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs md:text-sm text-slate-400 overflow-x-auto whitespace-nowrap py-1"
    >
      <Link
        to="/"
        className="flex items-center gap-1.5 hover:text-white transition-colors"
      >
        <Home size={14} className="shrink-0" />
        <span>Inicio</span>
      </Link>

      <ChevronRight size={14} className="text-slate-600 shrink-0" />

      <Link
        to="/companies"
        className="flex items-center gap-1.5 hover:text-white transition-colors"
      >
        <Building2 size={14} className="shrink-0" />
        <span>Empresas</span>
      </Link>

      <ChevronRight size={14} className="text-slate-600 shrink-0" />

      <span className="text-slate-200 font-medium truncate max-w-[200px] md:max-w-none">
        {companyName}
      </span>
    </nav>
  );
});

CompanyBreadcrumb.displayName = "CompanyBreadcrumb";
