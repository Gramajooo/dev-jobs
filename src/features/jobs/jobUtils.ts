import type { Job } from "../../types/job";
import { getCompanyById, getLocationName } from "../../utils/lookups";

export interface JobDetailData {
  id: string;
  idJob: string;
  idCompany: string;
  idLocation: string;
  title: string;
  company: string;
  location: string;
  description: string;
  modality: string;
  level: string;
  salaryText?: string;
  workSchedule?: string;
  isUrgent?: boolean;
  technologies: string[];
  responsibilities: string[];
  requirements: string[];
  aboutCompany: string;
}

export const getJobDetailData = (job: Job): JobDetailData => {
  const companyObj = job.idCompany ? getCompanyById(job.idCompany) : undefined;
  const company = companyObj?.name || job.company || job.idCompany || "Empresa Confidencial";
  const location = job.idLocation ? getLocationName(job.idLocation) : (job.location || "Remoto");

  const techs = Array.isArray(job.data?.technology)
    ? job.data.technology
    : job.data?.technology
      ? [job.data.technology]
      : [];

  const techNames = techs
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(", ");

  const responsibilities =
    job.responsibilities && job.responsibilities.length > 0
      ? job.responsibilities
      : [
          `Diseñar, desarrollar y mantener aplicaciones y soluciones robustas utilizando ${techNames || "tecnologías modernas"}.`,
          "Colaborar con equipos de producto, diseño y negocio para definir y entregar nuevas características de alto valor.",
          "Escribir código limpio, eficiente, escalable y con una sólida cobertura de pruebas.",
          "Realizar revisiones de código y proporcionar retroalimentación constructiva para asegurar la calidad del software.",
        ];

  const requirements =
    job.requirements && job.requirements.length > 0
      ? job.requirements
      : [
          "Licenciatura en Informática, Ingeniería de Software o experiencia equivalente.",
          `Experiencia comprobable en el desarrollo con ${techNames || "tecnologías relevantes del sector"}.`,
          `Nivel de experiencia requerido: perfil ${job.data?.level || "profesional"} con capacidad de resolución autónoma de problemas.`,
          "Familiaridad con metodologías ágiles (Scrum/Kanban) y herramientas de control de versiones (Git).",
        ];

  const aboutCompany =
    job.aboutCompany ||
    companyObj?.description ||
    `${company} es una empresa innovadora comprometida con el desarrollo de productos tecnológicos de vanguardia. Ofrecemos un entorno de trabajo colaborativo e inclusivo, oportunidades de crecimiento profesional continuo, salarios competitivos y flexibilidad (${location}).`;

  return {
    id: job.idJob || (job as unknown as { id?: string }).id || "",
    idJob: job.idJob || (job as unknown as { id?: string }).id || "",
    idCompany: job.idCompany,
    idLocation: job.idLocation,
    title: job.title,
    company,
    location,
    description: job.description,
    modality: job.data?.modality || location,
    level: job.data?.level || "Mid-Level",
    salaryText: job.data?.salaryText || job.salaryText,
    workSchedule: job.data?.workSchedule || job.workSchedule,
    isUrgent: job.data?.isUrgent ?? job.isUrgent,
    technologies: techs,
    responsibilities,
    requirements,
    aboutCompany,
  };
};
