import type { CandidateStage } from '@/types/recruiter';

/**
 * Mock data for developer profile tabs (favorites, alerts, viewers, hidden jobs)
 */

export const SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "HTML",
  "CSS",
  "TypeScript",
  "Tailwind CSS",
  "Next.js",
];

export const INITIAL_SAVED_JOBS = [
  {
    id: "job-fav-1",
    title: "Senior React Developer",
    company: "Stripe",
    location: "Remoto (España / LATAM)",
    salary: "€55.000 - €70.000",
    tags: ["React", "TypeScript", "GraphQL"],
  },
  {
    id: "job-fav-2",
    title: "Full Stack Engineer (Node & React)",
    company: "Mercado Libre",
    location: "Híbrido - Madrid",
    salary: "€48.000 - €62.000",
    tags: ["Node.js", "React", "PostgreSQL"],
  },
];

export const INITIAL_ALERTS = [
  {
    id: "alert-1",
    keyword: "Desarrollador React / Frontend",
    location: "Remoto",
    frequency: "Diaria",
    active: true,
  },
  {
    id: "alert-2",
    keyword: "TypeScript Full Stack",
    location: "Madrid, España",
    frequency: "Inmediata",
    active: true,
  },
];

export const PROFILE_VIEWERS = [
  {
    id: "v-1",
    company: "Globant",
    recruiter: "Senior Tech Recruiter",
    time: "Hace 2 horas",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100",
    action: "Vio tu perfil y tu CV",
  },
  {
    id: "v-2",
    company: "Mercado Libre",
    recruiter: "Engineering Manager",
    time: "Hace 1 día",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100",
    action: "Vio tu experiencia en React",
  },
  {
    id: "v-3",
    company: "Stripe",
    recruiter: "Talent Acquisition Partner",
    time: "Hace 3 días",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100",
    action: "Buscó perfiles 'TypeScript Senior'",
  },
];

export const INITIAL_HIDDEN_JOBS = [
  {
    id: "hidden-1",
    title: "Junior PHP / WordPress Developer",
    company: "Legacy Studio",
    reason: "Descartada por tecnologías no deseadas",
  },
];

/**
 * Candidate stage utility functions used across recruiter components
 */
export const getStagePercentage = (stage: CandidateStage): number => {
  switch (stage) {
    case "recibida": return 20;
    case "en_revision": return 40;
    case "entrevista": return 65;
    case "finalista": return 85;
    case "contratado": return 100;
    case "descartada": return 0;
    default: return 20;
  }
};

export const getStageLabel = (stage: CandidateStage): string => {
  switch (stage) {
    case "recibida": return "Recibida";
    case "en_revision": return "En revisión";
    case "entrevista": return "Entrevista técnica";
    case "finalista": return "Finalista";
    case "contratado": return "¡Contratado!";
    case "descartada": return "Descartada";
    default: return stage;
  }
};

export const getStageBadgeClass = (stage: CandidateStage): string => {
  switch (stage) {
    case "recibida": return "bg-slate-700/60 text-slate-300 border-slate-600";
    case "en_revision": return "bg-sky-500/20 text-sky-300 border-sky-500/30";
    case "entrevista": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "finalista": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "contratado": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "descartada": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    default: return "bg-slate-700 text-slate-300";
  }
};

/** Stage progression flow map */
export const STAGE_FLOW: Record<CandidateStage, CandidateStage> = {
  recibida: "en_revision",
  en_revision: "entrevista",
  entrevista: "finalista",
  finalista: "contratado",
  contratado: "contratado",
  descartada: "recibida",
};

export interface ProfileFormData {
  name: string;
  email: string;
  location: string;
  about: string;
  role: string;
  company: string;
  experience: string;
  industry?: string;
  companySize?: string;
  website?: string;
}

export interface JobFormData {
  title: string;
  department: string;
  location: string;
  modality: "Remoto" | "Híbrido" | "Presencial";
  level: "Junior" | "Mid" | "Senior" | "Lead";
  salaryText: string;
  workSchedule: "Tiempo Completo" | "Medio Tiempo" | "Freelance";
  description: string;
  requirements: string;
  responsibilities: string;
  tags: string;
  status: "activa" | "pausada";
}

export const DEFAULT_JOB_FORM: JobFormData = {
  title: "",
  department: "Ingeniería de Software",
  location: "Remoto (España / LATAM)",
  modality: "Remoto",
  level: "Senior",
  salaryText: "€45.000 - €60.000 / año",
  workSchedule: "Tiempo Completo",
  description: "",
  requirements: "",
  responsibilities: "",
  tags: "React, TypeScript",
  status: "activa",
};
