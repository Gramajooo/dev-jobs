export type CandidateStage =
  | "recibida"
  | "en_revision"
  | "entrevista"
  | "finalista"
  | "contratado"
  | "descartada";

export interface CandidateApplicant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  jobId: string;
  jobTitle: string;
  appliedAt: string; // ISO date
  stage: CandidateStage;
  experienceYears: string;
  role: string;
  location: string;
  skills: string[];
  cvFileName: string;
  notes: string;
  rating: number; // 1 to 5
  salaryExpectation: string;
}

export interface RecruiterJobPost {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  modality: "Remoto" | "Híbrido" | "Presencial";
  level: "Junior" | "Mid" | "Senior" | "Lead";
  salaryText: string;
  workSchedule: "Tiempo Completo" | "Medio Tiempo" | "Freelance";
  description: string;
  requirements: string[];
  responsibilities: string[];
  tags: string[];
  status: "activa" | "pausada" | "cerrada";
  createdAt: string;
  applicantsCount: number;
}
