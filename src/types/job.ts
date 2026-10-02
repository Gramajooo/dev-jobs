export interface JobData {
  technology: string[] | string;
  modality?: string;
  level: string;
  experienceYears?: string;
  salary?: number;
  salaryText?: string;
  workSchedule?: string;
  createdAt?: string;
  isUrgent?: boolean;
}

export interface Job {
  idJob: string;
  title: string;
  idCompany: string;
  idLocation: string;
  description: string;
  data: JobData;
  responsibilities?: string[];
  requirements?: string[];
  aboutCompany?: string;
  company?: string;
  location?: string;
  salary?: number;
  salaryText?: string;
  workSchedule?: string;
  createdAt?: string;
  isUrgent?: boolean;
  experienceYears?: string;
}
