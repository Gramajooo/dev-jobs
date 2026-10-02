import { createContext } from "react";
import type {
  CandidateApplicant,
  CandidateStage,
  RecruiterJobPost,
} from "../types/recruiter";

export interface RecruiterContextType {
  jobs: RecruiterJobPost[];
  candidates: CandidateApplicant[];
  createJob: (job: Omit<RecruiterJobPost, "id" | "createdAt" | "applicantsCount">) => string;
  updateJob: (id: string, updates: Partial<RecruiterJobPost>) => void;
  deleteJob: (id: string) => void;
  toggleJobStatus: (id: string) => void;
  updateCandidateStage: (candidateId: string, stage: CandidateStage) => void;
  updateCandidateNotes: (candidateId: string, notes: string, rating?: number) => void;
  getJobById: (id: string) => RecruiterJobPost | undefined;
  getCandidatesByJobId: (jobId: string) => CandidateApplicant[];
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalCandidates: number;
    inInterview: number;
    hired: number;
    inReview: number;
  };
}

export const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);
