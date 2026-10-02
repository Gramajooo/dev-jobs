import companiesData from "../data/companies.json";
import locationsData from "../data/locations.json";
import jobsData from "../data/jobs.json";
import type { Company } from "../types/company";
import type { Job } from "../types/job";

export interface LocationItem {
  idLocation: string;
  name: string;
}

const companiesMap = new Map<string, Company>(
  (companiesData as unknown as Company[]).map((company) => [company.idCompany, company])
);

const locationsMap = new Map<string, LocationItem>(
  (locationsData as LocationItem[]).map((location) => [location.idLocation, location])
);

/**
 * Normaliza y enriquece cada empleo con atributos consistentes de experiencia,
 * salario en Quetzales (Q), jornada laboral, fecha de publicación y modalidad.
 */
export const normalizeJob = (job: Job, index: number = 0): Job => {
  const level = (job.data?.level || "mid").toLowerCase();

  // 1. Experiencia según especificación: sin-experiencia, 1-ano, 2-anos, 3-anos, 3-4-anos, 5-o-mas
  let experienceYears = job.data?.experienceYears;
  if (!experienceYears) {
    if (level === "junior") {
      experienceYears = index % 2 === 0 ? "sin-experiencia" : "1-ano";
    } else if (level === "mid") {
      experienceYears = index % 2 === 0 ? "2-anos" : "3-anos";
    } else if (level === "senior") {
      experienceYears = index % 2 === 0 ? "3-4-anos" : "5-o-mas";
    } else {
      experienceYears = "5-o-mas";
    }
  }

  // 2. Salario en Quetzales: opciones de filtro >Q2k, >Q4k, >Q6k, >Q8k, >Q12k
  let salary = job.data?.salary || job.salary;
  if (!salary) {
    if (level === "junior") {
      salary = 3500 + (index % 5) * 500; // Q3,500 - Q5,500
    } else if (level === "mid") {
      salary = 6500 + (index % 6) * 600; // Q6,500 - Q9,500
    } else if (level === "senior") {
      salary = 11000 + (index % 6) * 1000; // Q11,000 - Q16,000
    } else {
      salary = 18000 + (index % 6) * 2000; // Q18,000 - Q28,000
    }
  }
  const salaryText =
    job.data?.salaryText ||
    job.salaryText ||
    `Q${salary.toLocaleString("es-GT")} / mes`;

  // 3. Jornada laboral: tiempo-completo, medio-tiempo, indefinido
  let workSchedule = job.data?.workSchedule || job.workSchedule;
  if (!workSchedule) {
    const schedules = [
      "tiempo-completo",
      "tiempo-completo",
      "tiempo-completo",
      "medio-tiempo",
      "indefinido",
    ];
    workSchedule = schedules[index % schedules.length];
  }

  // 4. Modalidad: remoto, hibrido, presencial
  let modality = job.data?.modality;
  if (
    !modality ||
    (modality !== "remoto" && modality !== "hibrido" && modality !== "presencial")
  ) {
    if (job.idLocation === "remoto") {
      modality = "remoto";
    } else {
      const modalities = ["hibrido", "presencial", "remoto", "hibrido", "presencial"];
      modality = modalities[index % modalities.length];
    }
  }

  // 5. Urgencia y Fecha de publicación: urgente, hoy, 3 dias, 1 semana, 1 mes, 3 meses
  let isUrgent = job.data?.isUrgent ?? job.isUrgent;
  if (isUrgent === undefined) {
    isUrgent = index % 4 === 0;
  }

  let createdAt = job.data?.createdAt || job.createdAt;
  if (!createdAt) {
    // Generar fechas relativas a hoy: hoy (0d), 1-2d, 4-6d, 15-20d, 45-75d
    const daysAgo =
      index % 7 === 0
        ? 0
        : index % 5 === 0
        ? 2
        : index % 3 === 0
        ? 5
        : index % 2 === 0
        ? 18
        : 45;
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - daysAgo);
    baseDate.setHours(9 + (index % 8), (index * 7) % 60, 0, 0);
    createdAt = baseDate.toISOString();
  }

  return {
    ...job,
    salary,
    salaryText,
    workSchedule,
    createdAt,
    isUrgent,
    data: {
      ...job.data,
      modality,
      experienceYears,
      salary,
      salaryText,
      workSchedule,
      createdAt,
      isUrgent,
    },
  };
};

export const jobsList: Job[] = (jobsData as unknown as Job[]).map((job, idx) =>
  normalizeJob(job, idx)
);

const jobsMap = new Map<string, Job>(jobsList.map((job) => [job.idJob, job]));

export const getAllJobs = (): Job[] => {
  return jobsList;
};

export const getAllCompanies = (): Company[] => {
  return companiesData as unknown as Company[];
};

export const getCompanyById = (idCompany: string): Company | undefined => {
  return companiesMap.get(idCompany);
};

export const getCompanyName = (idCompany: string): string => {
  return companiesMap.get(idCompany)?.name || idCompany;
};

export const getLocationById = (idLocation: string): LocationItem | undefined => {
  return locationsMap.get(idLocation);
};

export const getLocationName = (idLocation: string): string => {
  return locationsMap.get(idLocation)?.name || idLocation;
};

export const getJobsByIds = (jobIds: string[]): Job[] => {
  if (!jobIds || jobIds.length === 0) return [];
  return jobIds
    .map((id) => jobsMap.get(id))
    .filter((job): job is Job => Boolean(job));
};

export const getJobsByCompanyId = (idCompany: string): Job[] => {
  return jobsList.filter((job) => job.idCompany === idCompany);
};
