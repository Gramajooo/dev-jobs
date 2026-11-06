/**
 * Application Global Configuration
 */

export const APP_CONFIG = {
  name: "DevJobs",
  description: "Plataforma líder para encontrar empleos en desarrollo de software y tecnología",
  version: "1.0.0",
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "/api",
    timeout: 10000,
  },
  pagination: {
    jobsPerPage: 5,
    companiesPerPage: 6,
    companyJobsPerPage: 3,
  },
  routes: {
    home: "/",
    jobs: "/jobs",
    jobDetail: (id: string) => `/jobs/${id}`,
    companies: "/companies",
    companyDetail: (id: string, tab?: string) =>
      tab ? `/companies/${id}/${tab}` : `/companies/${id}`,
    login: "/login",
    applications: "/applications",
    applicationsEs: "/candidaturas",
    profile: "/profile",
    profileEs: "/perfil",
  },
} as const;

export default APP_CONFIG;
