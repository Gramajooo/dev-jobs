import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import type {
  ApplicationStats,
  ApplicationStatus,
  JobApplication,
} from "../types/application";
import { getAllJobs, getCompanyName, getLocationName } from "../utils/lookups";

export interface ApplicationsContextType {
  applications: JobApplication[];
  stats: ApplicationStats;
  applyToJob: (jobId: string, notes?: string) => boolean;
  withdrawApplication: (jobId: string) => void;
  isJobApplied: (jobId: string) => boolean;
  getApplication: (jobId: string) => JobApplication | undefined;
  updateApplicationStatus: (jobId: string, status: ApplicationStatus) => void;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
);

const STORAGE_PREFIX = "devjobs_applications_";

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Load from localStorage or initialize for user
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setApplications([]);
      return;
    }

    const storageKey = `${STORAGE_PREFIX}${user.id}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as JobApplication[];
        setApplications(parsed);
        return;
      } catch (e) {
        console.error("Error parsing stored applications:", e);
      }
    }

    // Default demo applications for dev demo account
    if (user.id === "usr-dev-03") {
      const allJobs = getAllJobs();
      const initialApps: JobApplication[] = [];

      const job1 = allJobs[0];
      if (job1) {
        initialApps.push({
          id: `app_${job1.idJob}_1`,
          jobId: job1.idJob,
          userId: user.id,
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "entrevista",
          jobTitle: job1.title,
          companyName: getCompanyName(job1.idCompany),
          companyId: job1.idCompany,
          locationName: getLocationName(job1.idLocation),
          salaryText: job1.data?.salaryText || job1.salaryText,
          modality: job1.data?.modality,
          workSchedule: job1.data?.workSchedule || job1.workSchedule,
        });
      }

      const job2 = allJobs[1];
      if (job2) {
        initialApps.push({
          id: `app_${job2.idJob}_2`,
          jobId: job2.idJob,
          userId: user.id,
          appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "en_revision",
          jobTitle: job2.title,
          companyName: getCompanyName(job2.idCompany),
          companyId: job2.idCompany,
          locationName: getLocationName(job2.idLocation),
          salaryText: job2.data?.salaryText || job2.salaryText,
          modality: job2.data?.modality,
          workSchedule: job2.data?.workSchedule || job2.workSchedule,
        });
      }

      setApplications(initialApps);
      localStorage.setItem(storageKey, JSON.stringify(initialApps));
    } else {
      setApplications([]);
    }
  }, [isAuthenticated, user]);

  // Sync to localStorage
  const saveApplications = useCallback(
    (newApps: JobApplication[]) => {
      setApplications(newApps);
      if (user) {
        localStorage.setItem(
          `${STORAGE_PREFIX}${user.id}`,
          JSON.stringify(newApps)
        );
      }
    },
    [user]
  );

  const isJobApplied = useCallback(
    (jobId: string) => {
      return applications.some((app) => app.jobId === jobId);
    },
    [applications]
  );

  const getApplication = useCallback(
    (jobId: string) => {
      return applications.find((app) => app.jobId === jobId);
    },
    [applications]
  );

  const applyToJob = useCallback(
    (jobId: string, notes?: string): boolean => {
      if (!user || !isAuthenticated) return false;
      // Recruiters are not allowed to apply to jobs
      if (user.role === "recruiter") {
        console.warn("Recruiter users cannot apply to job postings.");
        return false;
      }
      if (applications.some((app) => app.jobId === jobId)) return false;

      const job = getAllJobs().find(
        (j) => j.idJob === jobId || (j as unknown as { id?: string }).id === jobId
      );

      const newApp: JobApplication = {
        id: `app_${jobId}_${Date.now()}`,
        jobId,
        userId: user.id,
        appliedAt: new Date().toISOString(),
        status: "recibida",
        jobTitle: job?.title || "Oferta de empleo",
        companyName: job ? getCompanyName(job.idCompany) : "Empresa",
        companyId: job?.idCompany,
        locationName: job ? getLocationName(job.idLocation) : "Ubicación",
        salaryText: job?.data?.salaryText || job?.salaryText,
        modality: job?.data?.modality,
        workSchedule: job?.data?.workSchedule || job?.workSchedule,
        notes,
      };

      const updated = [newApp, ...applications];
      saveApplications(updated);
      return true;
    },
    [applications, isAuthenticated, saveApplications, user]
  );

  const withdrawApplication = useCallback(
    (jobId: string) => {
      const updated = applications.filter((app) => app.jobId !== jobId);
      saveApplications(updated);
    },
    [applications, saveApplications]
  );

  const updateApplicationStatus = useCallback(
    (jobId: string, status: ApplicationStatus) => {
      const updated = applications.map((app) =>
        app.jobId === jobId ? { ...app, status } : app
      );
      saveApplications(updated);
    },
    [applications, saveApplications]
  );

  const stats = useMemo<ApplicationStats>(() => {
    return {
      total: applications.length,
      enRevision: applications.filter(
        (a) => a.status === "en_revision" || a.status === "recibida"
      ).length,
      entrevista: applications.filter((a) => a.status === "entrevista").length,
      finalista: applications.filter((a) => a.status === "finalista").length,
      descartada: applications.filter((a) => a.status === "descartada").length,
    };
  }, [applications]);

  const value = useMemo(
    () => ({
      applications,
      stats,
      applyToJob,
      withdrawApplication,
      isJobApplied,
      getApplication,
      updateApplicationStatus,
    }),
    [
      applications,
      stats,
      applyToJob,
      withdrawApplication,
      isJobApplied,
      getApplication,
      updateApplicationStatus,
    ]
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error(
      "useApplications must be used within an ApplicationsProvider"
    );
  }
  return context;
};
