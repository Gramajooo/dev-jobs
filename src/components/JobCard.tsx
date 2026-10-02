import { type FC, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";

interface JobCardProps {
  idJob: string;
  children?: ReactNode;
  isEnableButton?: boolean;
}
interface TitleProps {
  title?: string;
  idJob?: string;
}
interface CompanyProps {
  company?: string;
}
interface LocationProps {
  location?: string;
}
interface DescriptionProps {
  description?: string;
}
interface BadgesProps {
  salaryText?: string;
  modality?: string;
  workSchedule?: string;
  isUrgent?: boolean;
  experienceYears?: string;
}
interface ApplyButtonProps {
  isApplied?: boolean;
  onClick?: () => void;
}

type JobCardType = FC<JobCardProps> & {
  Title: FC<TitleProps>;
  Company: FC<CompanyProps>;
  Location: FC<LocationProps>;
  Description: FC<DescriptionProps>;
  Badges: FC<BadgesProps>;
  ApplyButton: FC<ApplyButtonProps>;
};

export const JobCard: JobCardType = (({
  idJob,
  children,
  isEnableButton = true,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { isJobApplied, applyToJob } = useApplications();
  const navigate = useNavigate();
  const location = useLocation();
  const isApplied = isJobApplied(idJob);
  const isRecruiter = user?.role === "recruiter";

  const handleApply = () => {
    if (isRecruiter) return;
    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?returnTo=${returnTo}`, { state: { from: location } });
      return;
    }
    if (!isApplied) {
      applyToJob(idJob);
    }
  };

  return (
    <article
      key={idJob}
      className="bg-transparent border-b border-white/10 last:border-b-0 p-6 flex items-start justify-between gap-6 transition-colors duration-200 hover:bg-white/[0.02]"
    >
      <div className="flex-1">{children}</div>
      {isEnableButton && (
        <JobCard.ApplyButton onClick={handleApply} isApplied={isApplied} />
      )}
    </article>
  );
}) as JobCardType;

const JobCardTitle: FC<TitleProps> = ({ title = "Título", idJob }) => {
  return (
    <h3 className="text-xl font-bold text-white mb-1">
      {idJob ? (
        <Link
          to={`/jobs/${idJob}`}
          className="text-white hover:text-sky-400 transition-colors duration-200 no-underline hover:underline"
        >
          {title}
        </Link>
      ) : (
        title
      )}
    </h3>
  );
};

const JobCardCompany: FC<CompanyProps> = ({ company = "Empresa" }) => {
  return (
    <small className="text-sm text-sky-400 font-semibold">{company}</small>
  );
};

const JobCardLocation: FC<LocationProps> = ({ location = "Ubicación" }) => {
  return <small className="text-sm text-slate-400"> · {location}</small>;
};

const JobCardDescription: FC<DescriptionProps> = ({
  description = "Descripción",
}) => {
  return (
    <p className="mt-2 text-slate-300 text-[0.95rem] leading-relaxed">
      {description}
    </p>
  );
};

const JobCardBadges: FC<BadgesProps> = ({
  salaryText,
  modality,
  workSchedule,
  isUrgent,
  experienceYears,
}) => {
  const formatSchedule = (val?: string) => {
    if (!val) return "";
    if (val === "tiempo-completo") return "Tiempo completo";
    if (val === "medio-tiempo") return "Medio tiempo";
    if (val === "indefinido") return "Indefinido";
    return val;
  };

  const formatExp = (val?: string) => {
    if (!val) return "";
    if (val === "sin-experiencia") return "Sin experiencia";
    if (val === "1-ano") return "1 año";
    if (val === "2-anos") return "2 años";
    if (val === "3-anos") return "3 años";
    if (val === "3-4-anos") return "3-4 años";
    if (val === "5-o-mas") return "5+ años";
    return val;
  };

  const hasAnyBadge = Boolean(
    salaryText || modality || workSchedule || isUrgent || experienceYears
  );

  if (!hasAnyBadge) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3.5">
      {isUrgent && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
          🔥 Urgente
        </span>
      )}
      {salaryText && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          💰 {salaryText}
        </span>
      )}
      {modality && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/25 capitalize">
          {modality}
        </span>
      )}
      {workSchedule && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/25">
          {formatSchedule(workSchedule)}
        </span>
      )}
      {experienceYears && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600/30 text-slate-300 border border-white/10">
          Exp: {formatExp(experienceYears)}
        </span>
      )}
    </div>
  );
};

const JobCardApplyButton: FC<ApplyButtonProps> = ({
  isApplied = false,
  onClick,
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user?.role === "recruiter") {
    return (
      <span
        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 whitespace-nowrap select-none cursor-default"
        title="Los perfiles reclutadores no pueden postularse a ofertas"
      >
        Vista reclutador
      </span>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?returnTo=${returnTo}`, { state: { from: location } });
      return;
    }
    onClick?.();
  };

  const buttonText = isApplied ? "Aplicado" : "Aplicar";
  const buttonClass = `px-5 py-2.5 rounded-lg text-white font-semibold text-[0.9rem] cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
    isApplied
      ? "bg-emerald-600 pointer-events-none"
      : "bg-sky-500 hover:bg-blue-600 hover:-translate-y-0.5"
  }`;

  return (
    <button type="button" className={buttonClass} onClick={handleClick}>
      {buttonText}
    </button>
  );
};

JobCard.Title = JobCardTitle;
JobCard.Company = JobCardCompany;
JobCard.Location = JobCardLocation;
JobCard.Description = JobCardDescription;
JobCard.Badges = JobCardBadges;
JobCard.ApplyButton = JobCardApplyButton;
