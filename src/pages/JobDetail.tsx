import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  JobBreadcrumb,
  JobDetailHeader,
  JobDetailList,
  JobDetailSection,
  getJobDetailData,
} from "../components/JobDetail";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import { getAllJobs } from "../utils/lookups";

export const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { isJobApplied, applyToJob } = useApplications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  const isRecruiter = user?.role === "recruiter";

  const job = useMemo(() => {
    return getAllJobs().find(
      (item) =>
        item.idJob === id || (item as unknown as { id?: string }).id === id,
    );
  }, [id]);

  const isApplied = isJobApplied(job?.idJob || id || "");

  if (!job) {
    return (
      <main className="flex-1 flex justify-center items-center py-16 px-4">
        <div className="card-surface p-10 text-center max-w-md flex flex-col items-center gap-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_p]:text-slate-400 [&_p]:text-[0.95rem]">
          <h2>Oferta de empleo no encontrada</h2>
          <p>La oferta de trabajo que buscas no existe o ha expirado.</p>
          <Link
            to="/jobs"
            className="btn-primary h-11 px-7 text-sm shadow-blue-600/35"
          >
            Ver todas las ofertas
          </Link>
        </div>
      </main>
    );
  }

  const jobData = getJobDetailData(job);

  const handleApply = () => {
    if (isRecruiter) return;

    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?returnTo=${returnTo}`, { state: { from: location } });
      return;
    }

    if (!isApplied) {
      applyToJob(job.idJob);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <main className="flex-1 w-full pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto relative">
        {showToast && (
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-emerald-950 text-emerald-200 border border-emerald-600 py-3.5 px-5 rounded-xl shadow-2xl text-[0.925rem] font-medium animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2
              size={20}
              strokeWidth={2.5}
              className="w-5 h-5 text-emerald-400 shrink-0"
            />
            <span>¡Has aplicado con éxito a {jobData.title}!</span>
          </div>
        )}

        <div className="mb-7">
          <JobBreadcrumb
            currentTitle={jobData.title}
            companyName={jobData.company}
            companyId={jobData.idCompany}
          />
        </div>

        <article className="card-surface p-8 md:p-10">
          <JobDetailHeader
            title={jobData.title}
            company={jobData.company}
            companyId={jobData.idCompany}
            location={jobData.location}
            experienceLevel={jobData.level}
            modality={jobData.modality}
            salaryText={jobData.salaryText}
            workSchedule={jobData.workSchedule}
            isUrgent={jobData.isUrgent}
            technologies={jobData.technologies}
            isApplied={isApplied}
            onApply={handleApply}
            isRecruiter={isRecruiter}
          />

          <div className="flex flex-col gap-8">
            <JobDetailSection
              title="Descripción del puesto"
              description={jobData.description}
            />

            <JobDetailSection title="Responsabilidades">
              <JobDetailList items={jobData.responsibilities} />
            </JobDetailSection>

            <JobDetailSection title="Requisitos">
              <JobDetailList items={jobData.requirements} />
            </JobDetailSection>

            <JobDetailSection
              title="Acerca de la empresa"
              description={jobData.aboutCompany}
            />
          </div>
        </article>
      </div>
    </main>
  );
};

export default JobDetail;
