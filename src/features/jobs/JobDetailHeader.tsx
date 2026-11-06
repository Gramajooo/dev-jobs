import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface JobDetailHeaderProps {
  title: string;
  company: string;
  companyId?: string;
  location: string;
  experienceLevel: string;
  modality: string;
  salaryText?: string;
  workSchedule?: string;
  isUrgent?: boolean;
  technologies: string[];
  isApplied: boolean;
  onApply: () => void;
  isRecruiter?: boolean;
}

export const JobDetailHeader = ({
  title,
  company,
  companyId,
  location,
  experienceLevel,
  modality,
  salaryText,
  workSchedule,
  isUrgent,
  technologies,
  isApplied,
  onApply,
  isRecruiter = false,
}: JobDetailHeaderProps) => {
  const formatSchedule = (val?: string) => {
    if (!val) return "";
    if (val === "tiempo-completo") return "Tiempo completo";
    if (val === "medio-tiempo") return "Medio tiempo";
    if (val === "indefinido") return "Contrato indefinido";
    return val;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 pb-8 border-b border-white/10 mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            {title}
          </h1>
          {isUrgent && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              🔥 Urgente
            </span>
          )}
        </div>
        <p className="text-lg text-slate-300 flex items-center gap-2 flex-wrap mb-4">
          {companyId ? (
            <Link
              to={`/companies/${companyId}`}
              className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50 rounded"
              title={`Ver detalles de ${company}`}
            >
              {company}
            </Link>
          ) : (
            <span className="font-semibold text-sky-400">{company}</span>
          )}
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{location}</span>
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {salaryText && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              💰 {salaryText}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 capitalize">
            {experienceLevel}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 capitalize">
            {modality}
          </span>
          {workSchedule && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
              {formatSchedule(workSchedule)}
            </span>
          )}
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 pt-1">
        {isRecruiter ? (
          <div className="flex flex-col items-end gap-1.5">
            <div
              className="inline-flex items-center justify-center rounded-xl h-12 px-5 text-sm font-semibold bg-slate-800/90 text-slate-400 border border-white/10 select-none cursor-not-allowed"
              title="Tu cuenta es de tipo reclutador. No puedes postularte a ofertas de empleo."
            >
              Solo candidatos pueden postularse
            </div>
            <Link
              to="/profile?tab=jobs"
              className="text-xs text-sky-400 hover:text-sky-300 hover:underline transition-colors"
            >
              Gestionar mis vacantes →
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={onApply}
            className={`inline-flex items-center justify-center rounded-lg h-12 px-7 text-base font-bold gap-2 transition-colors ${
              isApplied
                ? "bg-green-600 text-white hover:bg-green-700 shadow-green-600/40"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/35"
            }`}
          >
            {isApplied ? (
              <>
                <Check size={18} strokeWidth={2.5} className="w-5 h-5" />
                Postulación enviada
              </>
            ) : (
              "Aplicar ahora"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
