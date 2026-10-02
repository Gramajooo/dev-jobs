import { memo } from "react";
import { Briefcase } from "lucide-react";
import { JobCard } from "./JobCard";
import type { Job } from "../types/job";
import { getCompanyName, getLocationName } from "../utils/lookups";

interface JobListingsProps {
  currentJobs: Job[];
}

export const JobListings = memo(({ currentJobs }: JobListingsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-5">
        Resultados de búsqueda
      </h2>

      {currentJobs.length > 0 ? (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#1e293b]">
          {currentJobs.map((job) => (
            <JobCard key={job.idJob} idJob={job.idJob}>
              <JobCard.Title title={job.title} idJob={job.idJob} />
              <JobCard.Company company={getCompanyName(job.idCompany)} />
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
      ) : (
        <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#1e293b]/60 backdrop-blur-sm flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            No se encontraron ofertas de empleo
          </h3>
          <p className="text-sm text-slate-400 max-w-md">
            Prueba a cambiar tus filtros de búsqueda o restablecerlos para ver más oportunidades disponibles.
          </p>
        </div>
      )}
    </div>
  );
});

JobListings.displayName = "JobListings";
