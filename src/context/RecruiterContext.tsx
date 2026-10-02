import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  CandidateApplicant,
  CandidateStage,
  RecruiterJobPost,
} from "../types/recruiter";
import { RecruiterContext } from "./recruiterContextDef";

const JOBS_STORAGE_KEY = "devjobs_recruiter_jobs_v1";
const CANDIDATES_STORAGE_KEY = "devjobs_recruiter_candidates_v1";

const INITIAL_JOBS: RecruiterJobPost[] = [
  {
    id: "rec-job-1",
    title: "Senior Frontend Engineer (React & TypeScript)",
    company: "Tech Solutions",
    department: "Frontend Engineering",
    location: "Madrid, España (Híbrido)",
    modality: "Híbrido",
    level: "Senior",
    salaryText: "€52.000 - €65.000 / año",
    workSchedule: "Tiempo Completo",
    description:
      "Buscamos un Ingeniero Frontend Senior con experiencia sólida en React 19, TypeScript y arquitectura de componentes para liderar el desarrollo de nuestras plataformas SaaS principales.",
    responsibilities: [
      "Diseñar y construir aplicaciones web de alto rendimiento con React y TypeScript",
      "Colaborar estrechamente con diseñadores UX/UI y equipos de backend",
      "Liderar code reviews y mantener altos estándares de calidad y accesibilidad",
      "Optimizar tiempos de carga y métricas Web Vitals",
    ],
    requirements: [
      "Más de 4 años de experiencia con React y TypeScript",
      "Dominio de Tailwind CSS y sistemas de diseño modernos",
      "Experiencia con pruebas automatizadas (Vitest / Playwright)",
      "Buenas prácticas de arquitectura y clean code",
    ],
    tags: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Zustand"],
    status: "activa",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicantsCount: 4,
  },
  {
    id: "rec-job-2",
    title: "Full Stack Developer (Node.js & React)",
    company: "Tech Solutions",
    department: "Core Product",
    location: "Remoto (España / LATAM)",
    modality: "Remoto",
    level: "Mid",
    salaryText: "€42.000 - €54.000 / año",
    workSchedule: "Tiempo Completo",
    description:
      "Únete a nuestro equipo para construir APIs escalables en Node.js/Express y crear interfaces reactivas modernas utilizando React.",
    responsibilities: [
      "Desarrollar y documentar APIs RESTful y GraphQL",
      "Implementar módulos frontend integrados con la lógica del negocio",
      "Diseñar modelos de datos eficientes en PostgreSQL y Redis",
    ],
    requirements: [
      "Al menos 3 años de experiencia con Node.js y React",
      "Manejo de bases de datos SQL y NoSQL",
      "Conocimiento de Docker y despliegues en la nube",
    ],
    tags: ["Node.js", "React", "PostgreSQL", "Express", "Docker"],
    status: "activa",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    applicantsCount: 3,
  },
  {
    id: "rec-job-3",
    title: "DevOps & Cloud Engineer (AWS / Kubernetes)",
    company: "Tech Solutions",
    department: "Infraestructura",
    location: "Remoto",
    modality: "Remoto",
    level: "Senior",
    salaryText: "€58.000 - €72.000 / año",
    workSchedule: "Tiempo Completo",
    description:
      "Responsable de liderar nuestra infraestructura en AWS con Terraform, pipelines CI/CD y clusters Kubernetes en alta disponibilidad.",
    responsibilities: [
      "Automatizar infraestructura como código con Terraform",
      "Gestionar clusters Kubernetes EKS y observabilidad con Grafana/Prometheus",
      "Asegurar alta disponibilidad y compliance de seguridad",
    ],
    requirements: [
      "Experiencia comprobable en AWS y Kubernetes",
      "Dominio de pipelines GitHub Actions / GitLab CI",
      "Certificaciones AWS (deseable)",
    ],
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"],
    status: "pausada",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    applicantsCount: 1,
  },
];

const INITIAL_CANDIDATES: CandidateApplicant[] = [
  {
    id: "cand-1",
    name: "Laura García",
    email: "laura.garcia@example.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDomCyY_G2z6S7PJLGHlOHkL0ATioq0bbrqR0Mk7mKxmE68MhmrqsldCIgZRsnIG6PORPrG4cLuQl2kEJv7t1Nn4C7eQWJB2JjPbdUEyo6D65gIE1seQJoz2xRdBM_734KDc1u8BPK3uYvL5XrjfjmSjC0gO5tUTxMcWq-CMcj69c7gAkEGNrpIfCzgFBn8fr2ZhDy9LTw73fHseGpFklr-2E-2mx1B0OeMcmJWoFWtKLpxSHAFQRti6HnZz9l9o3G97KZBNTUpx5k",
    jobId: "rec-job-1",
    jobTitle: "Senior Frontend Engineer (React & TypeScript)",
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "entrevista",
    experienceYears: "4 años",
    role: "Programadora Full Stack",
    location: "Madrid, España",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Node.js"],
    cvFileName: "CV_Laura_Garcia_2026.pdf",
    notes:
      "Excelente desempeño en la prueba técnica inicial (95/100). Código limpio y modular. Agendada entrevista con el Tech Lead para este jueves a las 11:00 AM.",
    rating: 5,
    salaryExpectation: "€58.000 / año",
  },
  {
    id: "cand-2",
    name: "Mateo Silva",
    email: "mateo.silva@devmail.com",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-1",
    jobTitle: "Senior Frontend Engineer (React & TypeScript)",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "finalista",
    experienceYears: "5 años",
    role: "Frontend Architect",
    location: "Valencia, España (Remoto)",
    skills: ["React", "TypeScript", "Redux Toolkit", "GraphQL", "Jest"],
    cvFileName: "Mateo_Silva_Frontend_CV.pdf",
    notes:
      "Entrevistas superadas con éxito. Feedback muy positivo de parte del equipo de producto. Preparando propuesta formal de contratación.",
    rating: 5,
    salaryExpectation: "€62.000 / año",
  },
  {
    id: "cand-3",
    name: "Elena Rostova",
    email: "elena.rostova@techmail.io",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-1",
    jobTitle: "Senior Frontend Engineer (React & TypeScript)",
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "en_revision",
    experienceYears: "3 años",
    role: "Frontend Developer",
    location: "Barcelona, España",
    skills: ["React", "JavaScript", "HTML/CSS", "Git", "Figma"],
    cvFileName: "Elena_Rostova_Resume.pdf",
    notes:
      "Perfil sólido en maquetación y diseño UI. Pendiente de evaluar experiencia profunda con TypeScript estricto.",
    rating: 4,
    salaryExpectation: "€48.000 / año",
  },
  {
    id: "cand-4",
    name: "Carlos Ruiz",
    email: "carlos.ruiz.dev@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-1",
    jobTitle: "Senior Frontend Engineer (React & TypeScript)",
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "recibida",
    experienceYears: "2 años",
    role: "Junior Web Developer",
    location: "Madrid, España",
    skills: ["React", "JavaScript", "CSS"],
    cvFileName: "CarlosRuiz_CV.pdf",
    notes: "Postulación recibida recientemente. Aún no revisada por el equipo.",
    rating: 3,
    salaryExpectation: "€38.000 / año",
  },
  {
    id: "cand-5",
    name: "Daniela Morales",
    email: "daniela.morales@clouddev.org",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-2",
    jobTitle: "Full Stack Developer (Node.js & React)",
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "contratado",
    experienceYears: "4 años",
    role: "Full Stack Engineer",
    location: "Remoto (Colombia)",
    skills: ["Node.js", "React", "PostgreSQL", "Express", "Docker"],
    cvFileName: "Daniela_Morales_Fullstack.pdf",
    notes: "¡Oferta aceptada! Comienza el 15 del próximo mes. Onboarding preparado.",
    rating: 5,
    salaryExpectation: "€48.000 / año",
  },
  {
    id: "cand-6",
    name: "Javier Mendoza",
    email: "javi.mendoza@engineer.es",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-2",
    jobTitle: "Full Stack Developer (Node.js & React)",
    appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "entrevista",
    experienceYears: "3 años",
    role: "Full Stack Developer",
    location: "Sevilla, España",
    skills: ["Node.js", "TypeScript", "React", "MongoDB"],
    cvFileName: "Javier_Mendoza_CV.pdf",
    notes: "Buena experiencia con microservicios. Agendada entrevista técnica para el viernes.",
    rating: 4,
    salaryExpectation: "€44.000 / año",
  },
  {
    id: "cand-7",
    name: "Alejandro Pérez",
    email: "alex.perez@pythondev.io",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-2",
    jobTitle: "Full Stack Developer (Node.js & React)",
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "descartada",
    experienceYears: "3 años",
    role: "Python Backend Developer",
    location: "Madrid, España",
    skills: ["Python", "Django", "FastAPI"],
    cvFileName: "Alejandro_Perez_CV.pdf",
    notes: "Perfil muy enfocado a Python sin experiencia en Node.js requerida para el puesto.",
    rating: 2,
    salaryExpectation: "€46.000 / año",
  },
  {
    id: "cand-8",
    name: "Rodrigo Casas",
    email: "rodrigo.casas@devops.net",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
    jobId: "rec-job-3",
    jobTitle: "DevOps & Cloud Engineer (AWS / Kubernetes)",
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    stage: "finalista",
    experienceYears: "6 años",
    role: "Senior Cloud & DevOps Engineer",
    location: "Remoto (España)",
    skills: ["AWS", "Kubernetes", "Terraform", "ArgoCD", "Python"],
    cvFileName: "Rodrigo_Casas_DevOps_CV.pdf",
    notes: "Certificación AWS Solutions Architect Professional. Excelente perfil para liderar infraestructura.",
    rating: 5,
    salaryExpectation: "€68.000 / año",
  },
];

export const RecruiterProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<RecruiterJobPost[]>(() => {
    try {
      const stored = localStorage.getItem(JOBS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [candidates, setCandidates] = useState<CandidateApplicant[]>(() => {
    try {
      const stored = localStorage.getItem(CANDIDATES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  // Sync jobs to localStorage
  useEffect(() => {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  // Sync candidates to localStorage
  useEffect(() => {
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  // CREATE JOB
  const createJob = useCallback(
    (jobData: Omit<RecruiterJobPost, "id" | "createdAt" | "applicantsCount">): string => {
      const newId = `rec-job-${Date.now()}`;
      const newJob: RecruiterJobPost = {
        ...jobData,
        id: newId,
        createdAt: new Date().toISOString(),
        applicantsCount: 0,
      };

      setJobs((prev) => [newJob, ...prev]);
      return newId;
    },
    []
  );

  // UPDATE JOB
  const updateJob = useCallback(
    (id: string, updates: Partial<RecruiterJobPost>) => {
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, ...updates } : job))
      );
    },
    []
  );

  // DELETE JOB
  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
    // Also remove associated applicants or keep them
    setCandidates((prev) => prev.filter((c) => c.jobId !== id));
  }, []);

  // TOGGLE STATUS
  const toggleJobStatus = useCallback((id: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;
        const newStatus = job.status === "activa" ? "pausada" : "activa";
        return { ...job, status: newStatus };
      })
    );
  }, []);

  // UPDATE CANDIDATE STAGE
  const updateCandidateStage = useCallback(
    (candidateId: string, stage: CandidateStage) => {
      setCandidates((prev) =>
        prev.map((cand) =>
          cand.id === candidateId ? { ...cand, stage } : cand
        )
      );
    },
    []
  );

  // UPDATE CANDIDATE NOTES & RATING
  const updateCandidateNotes = useCallback(
    (candidateId: string, notes: string, rating?: number) => {
      setCandidates((prev) =>
        prev.map((cand) => {
          if (cand.id !== candidateId) return cand;
          return {
            ...cand,
            notes,
            rating: rating !== undefined ? rating : cand.rating,
          };
        })
      );
    },
    []
  );

  const getJobById = useCallback(
    (id: string) => {
      return jobs.find((j) => j.id === id);
    },
    [jobs]
  );

  const getCandidatesByJobId = useCallback(
    (jobId: string) => {
      return candidates.filter((c) => c.jobId === jobId);
    },
    [candidates]
  );

  // Derive jobs with accurate applicant counts
  const jobsWithCounts = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      applicantsCount: candidates.filter((c) => c.jobId === job.id).length,
    }));
  }, [jobs, candidates]);

  // Derived stats
  const stats = useMemo(
    () => ({
      totalJobs: jobsWithCounts.length,
      activeJobs: jobsWithCounts.filter((j) => j.status === "activa").length,
      totalCandidates: candidates.length,
      inReview: candidates.filter((c) => c.stage === "en_revision").length,
      inInterview: candidates.filter((c) => c.stage === "entrevista").length,
      hired: candidates.filter((c) => c.stage === "contratado").length,
    }),
    [jobsWithCounts, candidates]
  );

  return (
    <RecruiterContext.Provider
      value={{
        jobs: jobsWithCounts,
        candidates,
        createJob,
        updateJob,
        deleteJob,
        toggleJobStatus,
        updateCandidateStage,
        updateCandidateNotes,
        getJobById,
        getCandidatesByJobId,
        stats,
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
};
