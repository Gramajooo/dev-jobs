export type ApplicationStatus =
  | "recibida"
  | "en_revision"
  | "entrevista"
  | "finalista"
  | "descartada";

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string; // ISO date string
  status: ApplicationStatus;
  jobTitle: string;
  companyName: string;
  companyId?: string;
  locationName: string;
  salaryText?: string;
  modality?: string;
  workSchedule?: string;
  notes?: string;
}

export interface ApplicationStats {
  total: number;
  enRevision: number;
  entrevista: number;
  finalista: number;
  descartada: number;
}
