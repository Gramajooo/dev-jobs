import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, BadgeCheck, ArrowRight, Building2 } from "lucide-react";
import type { Company } from "../../types/company";
import { getLocationName } from "../../utils/lookups";

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = memo(({ company }: CompanyCardProps) => {
  const [imgError, setImgError] = useState(false);
  const locationLabel = getLocationName(company.idLocation);
  const jobCount = company.jobIds?.length ?? 0;

  return (
    <article className="group bg-[#1e293b] border border-white/10 hover:border-sky-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1">
      <div>
        {/* Top Header: Logo + Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
            {!imgError && company.logo ? (
              <img
                src={company.logo}
                alt={`Logo de ${company.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <Building2 className="w-7 h-7 text-sky-400" />
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
            {jobCount} {jobCount === 1 ? "oferta activa" : "ofertas activas"}
          </span>
        </div>

        {/* Company Name & Verification */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors duration-200 line-clamp-1">
            <Link to={`/companies/${company.idCompany}`} className="focus:outline-none">
              {company.name}
            </Link>
          </h2>
          {company.verified && (
            <BadgeCheck className="w-5 h-5 text-sky-400 shrink-0" aria-label="Empresa verificada" />
          )}
        </div>

        {/* Industry & Location */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-400 mb-3">
          <span className="font-medium text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-white/5">
            {company.industry}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
            {locationLabel}
            {company.country && company.country !== "Internacional" ? `, ${company.country}` : ""}
          </span>
        </div>

        {/* Description preview */}
        <p className="text-sm text-slate-300/90 line-clamp-2 leading-relaxed mb-6">
          {company.description}
        </p>
      </div>

      {/* Action footer */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Fundada en <strong className="text-slate-300 font-semibold">{company.founded}</strong>
        </span>

        <Link
          to={`/companies/${company.idCompany}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 group-hover:translate-x-0.5 transition-all duration-200"
          aria-label={`Ver detalle y ofertas de ${company.name}`}
        >
          <span>Ver perfil</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
});

CompanyCard.displayName = "CompanyCard";
