import { BadgeCheck, Building2, ExternalLink, Globe } from "lucide-react";
import { memo, useState } from "react";
import type { Company } from "../../types/company";

interface CompanyHeaderProps {
  company: Company;
}

export const CompanyHeader = memo(({ company }: CompanyHeaderProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
      <div className="flex items-start md:items-center gap-5">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
          {!imgError && company.logo ? (
            <img
              src={company.logo}
              alt={`Logo de ${company.name}`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Building2 className="w-10 h-10 text-sky-400" />
          )}
        </div>

        {/* Title & Metadata */}
        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {company.name}
          </h1>
          {company.verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Verificada</span>
            </span>
          )}
        </div>
      </div>

      {/* External Website Button */}
      {company.website && (
        <div className="shrink-0 flex items-center gap-3">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-sm"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Sitio web</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      )}
    </div>
  );
});

CompanyHeader.displayName = "CompanyHeader";
