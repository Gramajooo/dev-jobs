import { memo } from "react";
import { Building, Calendar, MapPin } from "lucide-react";
import type { Company } from "../../types/company";
import { getLocationName } from "../../utils/lookups";
import { CompanySocialLinks } from "./CompanySocialLinks";

interface CompanyInfoTabProps {
  company: Company;
}

export const CompanyInfoTab = memo(({ company }: CompanyInfoTabProps) => {
  const locationLabel = getLocationName(company.idLocation);

  const keyFacts = [
    {
      icon: <Building className="w-4 h-4 text-sky-400" />,
      label: "Industria / Sector",
      value: company.industry,
    },
    {
      icon: <MapPin className="w-4 h-4 text-sky-400" />,
      label: "Ubicación sede",
      value: `${locationLabel}${company.country && company.country !== "Internacional" ? `, ${company.country}` : ""}`,
    },
    {
      icon: <Calendar className="w-4 h-4 text-sky-400" />,
      label: "Año de fundación",
      value: company.founded.toString(),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* About Company Section */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Acerca de la empresa</h2>
        <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line bg-slate-900/40 p-6 rounded-2xl border border-white/5">
          {company.description}
        </p>
      </section>

      {/* Key Facts Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Datos clave de la empresa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyFacts.map((fact) => (
            <div
              key={fact.label}
              className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-start gap-3.5 transition-colors hover:border-white/10"
            >
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-white/5 shrink-0">
                {fact.icon}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                  {fact.label}
                </span>
                <span className="block text-sm font-semibold text-slate-200 truncate">
                  {fact.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Componentized Social Networks with custom vector logos */}
      <CompanySocialLinks socialLinks={company.socialLinks} />
    </div>
  );
});

CompanyInfoTab.displayName = "CompanyInfoTab";
