import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface JobBreadcrumbProps {
  currentTitle: string;
  companyName?: string;
  companyId?: string;
}

export const JobBreadcrumb = ({
  currentTitle,
  companyName,
  companyId,
}: JobBreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-slate-400 mb-7 flex-wrap"
    >
      <Link
        to="/jobs"
        className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-400"
      >
        Empleos
      </Link>
      {companyName && companyId && (
        <>
          <ChevronRight size={14} className="text-slate-500 shrink-0" />
          <Link
            to={`/companies/${companyId}`}
            className="text-slate-400 no-underline transition-colors duration-200 hover:text-sky-400 max-w-[150px] sm:max-w-[200px] truncate"
            title={companyName}
          >
            {companyName}
          </Link>
        </>
      )}
      <ChevronRight size={14} className="text-slate-500 shrink-0" />
      <span className="text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-md">
        {currentTitle}
      </span>
    </nav>
  );
};
