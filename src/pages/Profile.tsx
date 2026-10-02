import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Home,
  Send,
  Heart,
  Bell,
  EyeOff,
  Settings,
  Download,
  Building2,
  MapPin,
  Sparkles,
  Eye,
  Briefcase,
  Users,
  PlusCircle,
  BarChart3,
  Trash2,
  Edit3,
  Search,
  Star,
  Clock,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useRecruiter } from "../hooks/useRecruiter";
import type { CandidateStage, RecruiterJobPost } from "../types/recruiter";

interface ProfileFormData {
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

const SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "HTML",
  "CSS",
  "TypeScript",
  "Tailwind CSS",
  "Next.js",
];

export const Profile = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";
  const editJobId = searchParams.get("editId");

  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  // Recruiter Context
  const {
    jobs: recruiterJobs,
    candidates: recruiterCandidates,
    createJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    updateCandidateStage,
    updateCandidateNotes,
    stats: recruiterStats,
  } = useRecruiter();

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("¡Cambios guardados con éxito!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // General Profile / Company Form State
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || (isRecruiter ? "Sofia R. (Reclutadora)" : "Laura G."),
    email: user?.email || (isRecruiter ? "recruiter@techsolutions.com" : "laura.garcia@example.com"),
    location: isRecruiter ? "Madrid, España" : "Madrid, España",
    about: isRecruiter
      ? "Líder de Adquisición de Talento en Tech Solutions. Especializada en la contratación de ingenieros de software, arquitectos cloud y perfiles tecnológicos de alto impacto."
      : "Desarrolladora Full Stack apasionada por crear aplicaciones web modernas, accesibles y de alto rendimiento utilizando el ecosistema React y TypeScript.",
    role:
      user?.title ||
      (isRecruiter
        ? "Talent Acquisition Lead"
        : user?.role === "admin"
          ? "Administrador"
          : "Programadora Full Stack"),
    company: user?.company || (isRecruiter ? "Tech Solutions" : "Tech Solutions"),
    experience: isRecruiter ? "6" : "4",
    industry: "Tecnología, Software SaaS y Cloud",
    companySize: "50 - 200 empleados",
    website: "https://techsolutions.example.com",
  });

  // Candidate CV File state (for developer role)
  const [cvFileName, setCvFileName] = useState<string | null>("CV_Laura_Garcia_FullStack.pdf");

  // Recruiter: Job Form State (for creating / editing jobs)
  const existingJobToEdit = editJobId
    ? recruiterJobs.find((j) => j.id === editJobId)
    : null;

  const [jobFormData, setJobFormData] = useState<{
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
  }>({
    title: existingJobToEdit?.title || "",
    department: existingJobToEdit?.department || "Ingeniería de Software",
    location: existingJobToEdit?.location || "Remoto (España / LATAM)",
    modality: existingJobToEdit?.modality || "Remoto",
    level: existingJobToEdit?.level || "Senior",
    salaryText: existingJobToEdit?.salaryText || "€45.000 - €60.000 / año",
    workSchedule: existingJobToEdit?.workSchedule || "Tiempo Completo",
    description:
      existingJobToEdit?.description ||
      "Buscamos un profesional apasionado por la excelencia técnica para incorporarse a nuestro equipo de producto.",
    requirements:
      existingJobToEdit?.requirements?.join("\n") ||
      "Experiencia mínima de 3 años en tecnologías frontend o backend.\nDominio de TypeScript y arquitectura moderna.\nCapacidad para trabajar en equipo distribuido.",
    responsibilities:
      existingJobToEdit?.responsibilities?.join("\n") ||
      "Construir y diseñar características clave de la plataforma.\nColaborar en revisiones de código y diseño de sistemas.\nOptimizar rendimiento y experiencia de usuario.",
    tags: existingJobToEdit?.tags?.join(", ") || "React, TypeScript, Node.js",
    status: existingJobToEdit?.status === "pausada" ? "pausada" : "activa",
  });

  // Recruiter: Filter state for Vacancies
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<string>("todas");

  // Recruiter: Filter state for Candidates / Applicants
  const [candidateFilterJob, setCandidateFilterJob] = useState<string>("todas");
  const [candidateFilterStage, setCandidateFilterStage] = useState<string>("todas");
  const [candidateSearchTerm, setCandidateSearchTerm] = useState<string>("");

  // Recruiter: Candidate Notes Modal
  const [selectedCandidateForNotes, setSelectedCandidateForNotes] = useState<string | null>(null);
  const [candidateNotesText, setCandidateNotesText] = useState("");
  const [candidateRatingValue, setCandidateRatingValue] = useState(5);

  // Recruiter: Delete Job Confirmation Modal
  const [jobToDelete, setJobToDelete] = useState<RecruiterJobPost | null>(null);

  // Candidate developer mock data (favorites, alerts, viewers, hidden)
  const [savedJobs] = useState([
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
  ]);

  const [alerts] = useState([
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
  ]);

  const profileViewers = [
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

  const [hiddenJobs, setHiddenJobs] = useState([
    {
      id: "hidden-1",
      title: "Junior PHP / WordPress Developer",
      company: "Legacy Studio",
      reason: "Descartada por tecnologías no deseadas",
    },
  ]);

  // Handlers for profile
  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerToast(
      isRecruiter
        ? "¡Perfil corporativo y de reclutador actualizado!"
        : "¡Perfil profesional actualizado con éxito!"
    );
  };

  // Handlers for CV (Candidate role)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFileName(file.name);
      triggerToast("¡Nuevo CV adjuntado correctamente!");
    }
  };

  // Handlers for Recruiter: Job Creation / Edit
  const handleJobFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tagsList = jobFormData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const requirementsList = jobFormData.requirements
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const responsibilitiesList = jobFormData.responsibilities
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    if (existingJobToEdit) {
      // Update existing
      updateJob(existingJobToEdit.id, {
        title: jobFormData.title,
        department: jobFormData.department,
        location: jobFormData.location,
        modality: jobFormData.modality,
        level: jobFormData.level,
        salaryText: jobFormData.salaryText,
        workSchedule: jobFormData.workSchedule,
        description: jobFormData.description,
        requirements: requirementsList,
        responsibilities: responsibilitiesList,
        tags: tagsList,
        status: jobFormData.status,
      });
      triggerToast("¡Oferta de empleo actualizada con éxito!");
    } else {
      // Create new
      createJob({
        title: jobFormData.title,
        company: formData.company || "Tech Solutions",
        department: jobFormData.department,
        location: jobFormData.location,
        modality: jobFormData.modality,
        level: jobFormData.level,
        salaryText: jobFormData.salaryText,
        workSchedule: jobFormData.workSchedule,
        description: jobFormData.description,
        requirements: requirementsList,
        responsibilities: responsibilitiesList,
        tags: tagsList,
        status: jobFormData.status,
      });
      triggerToast("¡Nueva oferta de empleo publicada con éxito!");
    }

    // Switch to jobs list
    setSearchParams({ tab: "jobs" });
  };

  const handleStartEditJob = (job: RecruiterJobPost) => {
    setJobFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      modality: job.modality,
      level: job.level,
      salaryText: job.salaryText,
      workSchedule: job.workSchedule,
      description: job.description,
      requirements: job.requirements.join("\n"),
      responsibilities: job.responsibilities.join("\n"),
      tags: job.tags.join(", "),
      status: job.status === "pausada" ? "pausada" : "activa",
    });
    setSearchParams({ tab: "new-job", editId: job.id });
  };

  const handleConfirmDeleteJob = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      triggerToast(`Oferta "${jobToDelete.title}" eliminada.`);
      setJobToDelete(null);
    }
  };

  // Handlers for Recruiter: Candidate Progression
  const handleAdvanceStage = (
    candidateId: string,
    currentStage: CandidateStage
  ) => {
    const stageFlow: Record<CandidateStage, CandidateStage> = {
      recibida: "en_revision",
      en_revision: "entrevista",
      entrevista: "finalista",
      finalista: "contratado",
      contratado: "contratado",
      descartada: "recibida",
    };

    const nextStage = stageFlow[currentStage] || "en_revision";
    updateCandidateStage(candidateId, nextStage);
    triggerToast(`Candidato movido a la etapa: ${getStageLabel(nextStage)}`);
  };

  const handleOpenCandidateNotes = (candId: string) => {
    const cand = recruiterCandidates.find((c) => c.id === candId);
    if (cand) {
      setSelectedCandidateForNotes(candId);
      setCandidateNotesText(cand.notes || "");
      setCandidateRatingValue(cand.rating || 5);
    }
  };

  const handleSaveCandidateNotes = () => {
    if (selectedCandidateForNotes) {
      updateCandidateNotes(
        selectedCandidateForNotes,
        candidateNotesText,
        candidateRatingValue
      );
      triggerToast("Notas de evaluación y calificación guardadas");
      setSelectedCandidateForNotes(null);
    }
  };

  // Candidate progress stage visual percentage
  const getStagePercentage = (stage: CandidateStage) => {
    switch (stage) {
      case "recibida":
        return 20;
      case "en_revision":
        return 40;
      case "entrevista":
        return 65;
      case "finalista":
        return 85;
      case "contratado":
        return 100;
      case "descartada":
        return 0;
      default:
        return 20;
    }
  };

  const getStageLabel = (stage: CandidateStage) => {
    switch (stage) {
      case "recibida":
        return "Recibida";
      case "en_revision":
        return "En revisión";
      case "entrevista":
        return "Entrevista técnica";
      case "finalista":
        return "Finalista";
      case "contratado":
        return "¡Contratado!";
      case "descartada":
        return "Descartada";
      default:
        return stage;
    }
  };

  const getStageBadgeClass = (stage: CandidateStage) => {
    switch (stage) {
      case "recibida":
        return "bg-slate-700/60 text-slate-300 border-slate-600";
      case "en_revision":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "entrevista":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "finalista":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "contratado":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "descartada":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  const avatarUrl =
    user?.avatar ||
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256";

  const navItemClass = (tabKey: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      currentTab === tabKey
        ? "bg-blue-600/20 text-sky-400 font-semibold border border-blue-500/30"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  // Filtered jobs for recruiter
  const filteredRecruiterJobs = recruiterJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(jobSearchTerm.toLowerCase()));
    const matchesStatus =
      jobStatusFilter === "todas" ? true : job.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered candidates for recruiter
  const filteredCandidates = recruiterCandidates.filter((cand) => {
    const matchesJob =
      candidateFilterJob === "todas" ? true : cand.jobId === candidateFilterJob;
    const matchesStage =
      candidateFilterStage === "todas" ? true : cand.stage === candidateFilterStage;
    const matchesSearch =
      cand.name.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
      cand.email.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
      cand.skills.some((s) => s.toLowerCase().includes(candidateSearchTerm.toLowerCase()));
    return matchesJob && matchesStage && matchesSearch;
  });

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full max-w-7xl mx-auto flex-col lg:flex-row">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0a233d] text-sky-300 border border-sky-500/40 rounded-xl shadow-2xl shadow-black/60 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={18} strokeWidth={2.5} className="text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0a1e34] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">¿Eliminar vacante?</h3>
            </div>
            <p className="text-sm text-slate-300">
              ¿Estás seguro de que deseas eliminar permanentemente la oferta{" "}
              <strong className="text-white">"{jobToDelete.title}"</strong>? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteJob}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md shadow-rose-600/30"
              >
                Sí, eliminar oferta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Notes & Evaluation Modal */}
      {selectedCandidateForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0a1e34] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <span>Notas de Evaluación del Candidato</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCandidateForNotes(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Calificación Técnica y Cultural (1 a 5 estrellas)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCandidateRatingValue(star)}
                    className="p-1 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= candidateRatingValue
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-amber-400 font-bold ml-2">
                  {candidateRatingValue} / 5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Feedback interno y seguimiento:
              </label>
              <textarea
                rows={4}
                value={candidateNotesText}
                onChange={(e) => setCandidateNotesText(e.target.value)}
                placeholder="Escribe comentarios sobre la entrevista, nivel técnico, disponibilidad o dudas salariales..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCandidateForNotes(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCandidateNotes}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                Guardar notas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 flex-shrink-0 p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#06182a]/70">
        <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white/5 border border-white/5">
          <img
            alt={`${formData.name} profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md shadow-blue-500/20"
            src={avatarUrl}
          />
          <div className="min-w-0">
            <h2 className="font-bold text-base text-white leading-tight truncate">
              {formData.name}
            </h2>
            <p className="text-xs text-sky-400 font-medium truncate">
              {isRecruiter
                ? `${formData.company} • Reclutador`
                : formData.role || "Programadora"}
            </p>
          </div>
        </div>

        <nav
          className="flex flex-row lg:flex-col flex-wrap gap-1.5"
          aria-label="Navegación de perfil"
        >
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Inicio</span>
          </Link>

          {isRecruiter ? (
            /* NAV ITEMS FOR RECRUITER */
            <>
              <button
                type="button"
                onClick={() => setSearchParams({ tab: "profile" })}
                className={navItemClass("profile")}
              >
                <Building2 className="w-4 h-4" />
                <span>Perfil de Empresa</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "jobs" })}
                className={navItemClass("jobs")}
              >
                <Briefcase className="w-4 h-4" />
                <span className="flex-1 text-left">Mis vacantes</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {recruiterStats.activeJobs}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "candidates" })}
                className={navItemClass("candidates")}
              >
                <Users className="w-4 h-4" />
                <span className="flex-1 text-left">Candidatos y Progreso</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {recruiterStats.totalCandidates}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "new-job" })}
                className={navItemClass("new-job")}
              >
                <PlusCircle className="w-4 h-4 text-sky-400" />
                <span>Publicar empleo</span>
              </button>

              <div className="hidden lg:block my-2 border-t border-white/10" />

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "stats" })}
                className={navItemClass("stats")}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Métricas y Pipeline</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "settings" })}
                className={navItemClass("settings")}
              >
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </button>
            </>
          ) : (
            /* NAV ITEMS FOR CANDIDATE (DEVELOPER) */
            <>
              <button
                type="button"
                onClick={() => setSearchParams({ tab: "profile" })}
                className={navItemClass("profile")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z" />
                </svg>
                <span>Mi área</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "cv" })}
                className={navItemClass("cv")}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="3" />
                  <circle cx="8.5" cy="8.5" r="2" />
                  <path d="M14 8h3" />
                  <path d="M14 12h3" />
                  <path d="M6 16h12" />
                </svg>
                <span>Mi CV</span>
              </button>

              <div className="hidden lg:block my-2 border-t border-white/10" />

              <Link
                to="/jobs"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Buscar ofertas</span>
              </Link>

              <Link
                to="/candidaturas"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Send className="w-4 h-4 text-slate-400" />
                <span>Mis postulaciones</span>
              </Link>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "favorites" })}
                className={navItemClass("favorites")}
              >
                <Heart className="w-4 h-4" />
                <span>Mis favoritos</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "alerts" })}
                className={navItemClass("alerts")}
              >
                <Bell className="w-4 h-4" />
                <span>Mis alertas</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "views" })}
                className={navItemClass("views")}
              >
                <Eye className="w-4 h-4" />
                <span>Quién vio mi perfil</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "hidden" })}
                className={navItemClass("hidden")}
              >
                <EyeOff className="w-4 h-4" />
                <span>Ofertas ocultas</span>
              </button>

              <div className="hidden lg:block my-2 border-t border-white/10" />

              <button
                type="button"
                onClick={() => setSearchParams({ tab: "settings" })}
                className={navItemClass("settings")}
              >
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {/* ========================================================
            RECRUITER VIEWS
        ======================================================== */}
        {isRecruiter && (
          <>
            {/* TAB: RECRUITER VACANCIES / GESTIÓN DE VACANTES */}
            {currentTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                      Mis vacantes publicadas
                    </h1>
                    <p className="text-sm text-slate-400">
                      Gestiona, edita, pausa o elimina las ofertas de empleo de tu empresa
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setJobFormData({
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
                      });
                      setSearchParams({ tab: "new-job" });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer w-fit"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publicar nueva oferta</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-2xl bg-[#0a1e34]/80 border border-white/10">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por título o tag..."
                      value={jobSearchTerm}
                      onChange={(e) => setJobSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    {[
                      { key: "todas", label: `Todas (${recruiterJobs.length})` },
                      { key: "activa", label: `Activas (${recruiterStats.activeJobs})` },
                      { key: "pausada", label: "Pausadas" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setJobStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          jobStatusFilter === tab.key
                            ? "bg-blue-600 text-white"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vacancies List */}
                {filteredRecruiterJobs.length === 0 ? (
                  <div className="p-12 text-center bg-[#0a1e34]/60 border border-white/10 rounded-2xl">
                    <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">
                      No se encontraron vacantes
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                      No hay ofertas de empleo que coincidan con los filtros seleccionados.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchParams({ tab: "new-job" })}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Crear primera oferta
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecruiterJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-5 rounded-2xl bg-[#0a1e34]/80 border border-white/10 hover:border-white/20 transition-all shadow-md shadow-black/20"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  job.status === "activa"
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                }`}
                              >
                                {job.status === "activa" ? "● Activa" : "⏸ Pausada"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {job.department}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {job.location} ({job.modality})
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">
                              {job.title}
                            </h3>

                            <p className="text-xs text-slate-300 line-clamp-2 max-w-2xl mb-3">
                              {job.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="text-xs font-semibold text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded-md border border-sky-500/30">
                                {job.salaryText}
                              </span>
                              <span className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-md">
                                {job.workSchedule}
                              </span>
                              {job.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Candidate Counter Pill */}
                          <button
                            type="button"
                            onClick={() => {
                              setCandidateFilterJob(job.id);
                              setSearchParams({ tab: "candidates" });
                            }}
                            className="flex items-center gap-2 p-3 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-300 hover:bg-blue-600/25 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                            title="Ver candidatos para esta vacante"
                          >
                            <Users className="w-5 h-5 text-sky-400" />
                            <div className="text-left">
                              <span className="text-base font-extrabold text-white block leading-tight">
                                {job.applicantsCount}
                              </span>
                              <span className="text-[10px] text-sky-300 uppercase font-bold tracking-wider">
                                Candidatos
                              </span>
                            </div>
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                          <span className="text-[11px] text-slate-500">
                            Publicado el {new Date(job.createdAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleJobStatus(job.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                job.status === "activa"
                                  ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30"
                                  : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                              }`}
                            >
                              {job.status === "activa" ? "Pausar vacante" : "Reactivar vacante"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEditJob(job)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setJobToDelete(job)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar vacante"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PUBLICAR O EDITAR OFERTA DE EMPLEO */}
            {currentTab === "new-job" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                      {existingJobToEdit ? "Editar oferta de empleo" : "Publicar nueva oferta"}
                    </h1>
                    <p className="text-sm text-slate-400">
                      {existingJobToEdit
                        ? `Modifica los detalles de "${existingJobToEdit.title}"`
                        : "Publica una nueva vacante para atraer a los mejores desarrolladores"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSearchParams({ tab: "jobs" })}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Volver a mis vacantes
                  </button>
                </div>

                <div className="bg-[#0a1e34]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <form onSubmit={handleJobFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Título del puesto *
                        </label>
                        <input
                          type="text"
                          required
                          value={jobFormData.title}
                          onChange={(e) =>
                            setJobFormData({ ...jobFormData, title: e.target.value })
                          }
                          placeholder="Ej: Senior React & TypeScript Developer"
                          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Departamento / Área
                        </label>
                        <input
                          type="text"
                          value={jobFormData.department}
                          onChange={(e) =>
                            setJobFormData({ ...jobFormData, department: e.target.value })
                          }
                          placeholder="Ej: Frontend Engineering"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Ubicación
                        </label>
                        <input
                          type="text"
                          value={jobFormData.location}
                          onChange={(e) =>
                            setJobFormData({ ...jobFormData, location: e.target.value })
                          }
                          placeholder="Ej: Remoto, Madrid, Ciudad de Guatemala"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Modalidad
                        </label>
                        <select
                          value={jobFormData.modality}
                          onChange={(e) =>
                            setJobFormData({
                              ...jobFormData,
                              modality: e.target.value as "Remoto" | "Híbrido" | "Presencial",
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Remoto">Remoto</option>
                          <option value="Híbrido">Híbrido</option>
                          <option value="Presencial">Presencial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Nivel de experiencia
                        </label>
                        <select
                          value={jobFormData.level}
                          onChange={(e) =>
                            setJobFormData({
                              ...jobFormData,
                              level: e.target.value as "Junior" | "Mid" | "Senior" | "Lead",
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Junior">Junior</option>
                          <option value="Mid">Mid</option>
                          <option value="Senior">Senior</option>
                          <option value="Lead">Lead / Architect</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Rango Salarial / Salario
                        </label>
                        <input
                          type="text"
                          value={jobFormData.salaryText}
                          onChange={(e) =>
                            setJobFormData({ ...jobFormData, salaryText: e.target.value })
                          }
                          placeholder="Ej: €48.000 - €60.000 / año o Q18,000 / mes"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Jornada laboral
                        </label>
                        <select
                          value={jobFormData.workSchedule}
                          onChange={(e) =>
                            setJobFormData({
                              ...jobFormData,
                              workSchedule: e.target.value as
                                | "Tiempo Completo"
                                | "Medio Tiempo"
                                | "Freelance",
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Tiempo Completo">Tiempo Completo</option>
                          <option value="Medio Tiempo">Medio Tiempo</option>
                          <option value="Freelance">Freelance / Contrato</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Tecnologías y Tags (separados por coma)
                        </label>
                        <input
                          type="text"
                          value={jobFormData.tags}
                          onChange={(e) =>
                            setJobFormData({ ...jobFormData, tags: e.target.value })
                          }
                          placeholder="Ej: React, TypeScript, Next.js, Node.js, GraphQL"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Descripción del puesto *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={jobFormData.description}
                          onChange={(e) =>
                            setJobFormData({ ...jobFormData, description: e.target.value })
                          }
                          placeholder="Describe el contexto del equipo, proyectos y metas del rol..."
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Responsabilidades (una por línea)
                        </label>
                        <textarea
                          rows={4}
                          value={jobFormData.responsibilities}
                          onChange={(e) =>
                            setJobFormData({
                              ...jobFormData,
                              responsibilities: e.target.value,
                            })
                          }
                          placeholder="Diseñar e implementar features&#10;Hacer code reviews&#10;Mejorar performance"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Requisitos mínimos (uno por línea)
                        </label>
                        <textarea
                          rows={4}
                          value={jobFormData.requirements}
                          onChange={(e) =>
                            setJobFormData({
                              ...jobFormData,
                              requirements: e.target.value,
                            })
                          }
                          placeholder="+3 años en React&#10;TypeScript avanzado&#10;Buenas prácticas de accesibilidad"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setSearchParams({ tab: "jobs" })}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-98"
                      >
                        {existingJobToEdit ? "Guardar cambios" : "Publicar oferta"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: SEGUIMIENTO Y PROGRESO DE CANDIDATOS (ATS) */}
            {currentTab === "candidates" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                    Candidatos y Seguimiento
                  </h1>
                  <p className="text-sm text-slate-400">
                    Gestiona a los postulantes, evalúa su progreso por etapas y añade notas del proceso
                  </p>
                </div>

                {/* Pipeline Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {[
                    { label: "Total postulantes", count: recruiterStats.totalCandidates, color: "text-white" },
                    { label: "En revisión", count: recruiterStats.inReview, color: "text-sky-400" },
                    { label: "En entrevista", count: recruiterStats.inInterview, color: "text-purple-400" },
                    {
                      label: "Finalistas",
                      count: recruiterCandidates.filter((c) => c.stage === "finalista").length,
                      color: "text-amber-400",
                    },
                    { label: "Contratados", count: recruiterStats.hired, color: "text-emerald-400" },
                    {
                      label: "Descartadas",
                      count: recruiterCandidates.filter((c) => c.stage === "descartada").length,
                      color: "text-rose-400",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0a1e34]/70 border border-white/10 text-center"
                    >
                      <span className={`text-2xl font-extrabold block ${stat.color}`}>
                        {stat.count}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl bg-[#0a1e34]/80 border border-white/10">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Filter by Job */}
                    <div className="w-full sm:w-56">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Filtrar por vacante:
                      </label>
                      <select
                        value={candidateFilterJob}
                        onChange={(e) => setCandidateFilterJob(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950/80 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todas">Todas las ofertas ({recruiterCandidates.length})</option>
                        {recruiterJobs.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.title} ({j.applicantsCount})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter by Stage */}
                    <div className="w-full sm:w-48">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Filtrar por etapa:
                      </label>
                      <select
                        value={candidateFilterStage}
                        onChange={(e) => setCandidateFilterStage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950/80 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todas">Todas las etapas</option>
                        <option value="recibida">Recibida</option>
                        <option value="en_revision">En revisión</option>
                        <option value="entrevista">Entrevista técnica</option>
                        <option value="finalista">Finalista</option>
                        <option value="contratado">Contratado</option>
                        <option value="descartada">Descartada</option>
                      </select>
                    </div>
                  </div>

                  {/* Search candidate */}
                  <div className="relative w-full sm:w-64 self-end">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por candidato o skill..."
                      value={candidateSearchTerm}
                      onChange={(e) => setCandidateSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Candidate List with Progress Trackers */}
                {filteredCandidates.length === 0 ? (
                  <div className="p-12 text-center bg-[#0a1e34]/60 border border-white/10 rounded-2xl">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">
                      No se encontraron candidatos
                    </h3>
                    <p className="text-xs text-slate-400">
                      Intenta cambiar los filtros de búsqueda o vacante seleccionada.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="p-5 rounded-2xl bg-[#0a1e34]/80 border border-white/10 hover:border-white/20 transition-all shadow-md shadow-black/30 space-y-4"
                      >
                        {/* Candidate Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                          <div className="flex items-start gap-3.5">
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white">
                                  {cand.name}
                                </h3>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStageBadgeClass(
                                    cand.stage
                                  )}`}
                                >
                                  {getStageLabel(cand.stage)}
                                </span>
                              </div>

                              <p className="text-xs text-sky-400 font-medium">
                                Postuló a: <strong className="text-white">{cand.jobTitle}</strong>
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5">
                                {cand.role} • {cand.location} • Exp: {cand.experienceYears} • Expectativa: {cand.salaryExpectation}
                              </p>
                            </div>
                          </div>

                          {/* Quick Rating & CV */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <div className="flex items-center bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/10">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                              <span className="text-xs font-bold text-white">
                                {cand.rating} / 5
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                triggerToast(`Descargando CV de ${cand.name}...`)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="Ver CV del candidato"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{cand.cvFileName}</span>
                            </button>
                          </div>
                        </div>

                        {/* Candidate Skills */}
                        <div className="flex flex-wrap gap-1.5">
                          {cand.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] font-medium text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Progress Tracker (El seguimiento que tienen, todo su progreso) */}
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-300 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-sky-400" />
                              <span>Progreso en el proceso:</span>
                            </span>
                            <span className="font-bold text-sky-400">
                              {getStagePercentage(cand.stage)}% completado
                            </span>
                          </div>

                          {/* Stepper bar */}
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                cand.stage === "descartada"
                                  ? "bg-rose-500 w-full"
                                  : cand.stage === "contratado"
                                  ? "bg-emerald-500"
                                  : "bg-gradient-to-r from-blue-600 via-sky-400 to-purple-500"
                              }`}
                              style={{
                                width:
                                  cand.stage === "descartada"
                                    ? "100%"
                                    : `${getStagePercentage(cand.stage)}%`,
                              }}
                            />
                          </div>

                          {/* Stage names step badges */}
                          <div className="grid grid-cols-5 text-[10px] text-center pt-1 font-medium">
                            <span
                              className={
                                cand.stage === "recibida"
                                  ? "text-sky-300 font-bold"
                                  : "text-slate-500"
                              }
                            >
                              1. Recibida
                            </span>
                            <span
                              className={
                                cand.stage === "en_revision"
                                  ? "text-sky-300 font-bold"
                                  : "text-slate-500"
                              }
                            >
                              2. Revisión
                            </span>
                            <span
                              className={
                                cand.stage === "entrevista"
                                  ? "text-purple-300 font-bold"
                                  : "text-slate-500"
                              }
                            >
                              3. Entrevista
                            </span>
                            <span
                              className={
                                cand.stage === "finalista"
                                  ? "text-amber-300 font-bold"
                                  : "text-slate-500"
                              }
                            >
                              4. Finalista
                            </span>
                            <span
                              className={
                                cand.stage === "contratado"
                                  ? "text-emerald-300 font-bold"
                                  : "text-slate-500"
                              }
                            >
                              5. Contratado
                            </span>
                          </div>
                        </div>

                        {/* Recruiter Evaluation Notes */}
                        {cand.notes && (
                          <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs">
                            <p className="font-bold text-sky-300 mb-0.5">
                              Notas de evaluación del reclutador:
                            </p>
                            <p className="text-slate-300 leading-relaxed italic">
                              "{cand.notes}"
                            </p>
                          </div>
                        )}

                        {/* Stage Controls & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] text-slate-500">
                            Postulado el {new Date(cand.appliedAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenCandidateNotes(cand.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5 text-sky-400" />
                              <span>{cand.notes ? "Editar notas" : "+ Añadir notas"}</span>
                            </button>

                            {/* Dropdown to change stage directly */}
                            <select
                              value={cand.stage}
                              onChange={(e) =>
                                updateCandidateStage(cand.id, e.target.value as CandidateStage)
                              }
                              className="px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="recibida">Mover a: Recibida</option>
                              <option value="en_revision">Mover a: En revisión</option>
                              <option value="entrevista">Mover a: Entrevista</option>
                              <option value="finalista">Mover a: Finalista</option>
                              <option value="contratado">Mover a: Contratado</option>
                              <option value="descartada">Mover a: Descartada</option>
                            </select>

                            {cand.stage !== "contratado" && cand.stage !== "descartada" && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceStage(cand.id, cand.stage)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer active:scale-98"
                              >
                                Avanzar etapa ➔
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RECRUITER METRICS / STATS */}
            {currentTab === "stats" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                    Métricas y Pipeline de Selección
                  </h1>
                  <p className="text-sm text-slate-400">
                    Estadísticas clave del rendimiento de tus ofertas de empleo y embudo de conversión
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-[#0a1e34] border border-blue-500/20">
                    <span className="text-xs font-semibold text-sky-400 block mb-1">
                      Vacantes Activas
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      {recruiterStats.activeJobs}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      De un total de {recruiterStats.totalJobs} vacantes
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-[#0a1e34] border border-purple-500/20">
                    <span className="text-xs font-semibold text-purple-400 block mb-1">
                      Candidatos en Proceso
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      {recruiterStats.totalCandidates}
                    </span>
                    <span className="text-xs text-emerald-400 block mt-1">
                      +18% de postulaciones este mes
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/30 to-[#0a1e34] border border-amber-500/20">
                    <span className="text-xs font-semibold text-amber-400 block mb-1">
                      En Fase de Entrevista
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      {recruiterStats.inInterview}
                    </span>
                    <span className="text-xs text-amber-300 block mt-1">
                      Tasa de paso a técnica: 65%
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-[#0a1e34] border border-emerald-500/20">
                    <span className="text-xs font-semibold text-emerald-400 block mb-1">
                      Contrataciones
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      {recruiterStats.hired}
                    </span>
                    <span className="text-xs text-emerald-300 block mt-1">
                      Tiempo prom. de contratación: 14 días
                    </span>
                  </div>
                </div>

                {/* Recruitment Funnel Visual Card */}
                <div className="p-6 rounded-2xl bg-[#0a1e34]/80 border border-white/10 space-y-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-sky-400" />
                    <span>Embudo de Selección (Hiring Funnel)</span>
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>1. Candidaturas Recibidas</span>
                        <span className="font-bold text-white">
                          {recruiterStats.totalCandidates} candidatos (100%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-full rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>2. Filtrado y Revisión de CV</span>
                        <span className="font-bold text-white">
                          {recruiterStats.totalCandidates - 1} candidatos (85%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full w-[85%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>3. Entrevistas Técnicas</span>
                        <span className="font-bold text-white">
                          {recruiterStats.inInterview + recruiterStats.hired} candidatos (55%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[55%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>4. Oferta y Contratación</span>
                        <span className="font-bold text-white">
                          {recruiterStats.hired} contratados (20%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[20%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================
            TAB 1: MI ÁREA / PERFIL GENERAL (BOTH CANDIDATE & RECRUITER)
        ======================================================== */}
        {currentTab === "profile" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {isRecruiter ? "Perfil de Empresa y Reclutador" : "Mi área"}
              </h1>
              <p className="text-sm text-slate-400">
                {isRecruiter
                  ? "Configura la información pública de tu empresa y datos de contacto de contratación"
                  : "Actualiza tu información personal, profesional y preferencias de empleo"}
              </p>
            </div>

            <div className="bg-[#0a1e34]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleProfileSubmit} className="space-y-8 divide-y divide-white/10">
                {/* Personal / Corporate Info */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-white">
                    {isRecruiter ? "Datos del Reclutador" : "Información personal"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="name">
                        Nombre completo
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
                        Correo {isRecruiter ? "corporativo" : "electrónico"}
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="role">
                        Cargo / Puesto
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="role"
                        type="text"
                        value={formData.role}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="company">
                        Empresa
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="about">
                        {isRecruiter ? "Acerca de la empresa y cultura" : "Sobre mí"}
                      </label>
                      <textarea
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[6rem]"
                        id="about"
                        rows={4}
                        value={formData.about}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </section>

                {/* Recruiter-specific Company Details */}
                {isRecruiter && (
                  <section className="pt-8 space-y-4">
                    <h2 className="text-lg font-bold text-white">
                      Detalles de la Empresa
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="industry">
                          Sector / Industria
                        </label>
                        <input
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          id="industry"
                          type="text"
                          value={formData.industry}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="companySize">
                          Tamaño de la empresa
                        </label>
                        <input
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          id="companySize"
                          type="text"
                          value={formData.companySize}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="website">
                          Sitio Web
                        </label>
                        <input
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Candidate Experience and Skills */}
                {!isRecruiter && (
                  <section className="pt-8 space-y-4">
                    <h2 className="text-lg font-bold text-white">
                      Habilidades Principales
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-6">
                  <button
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                    type="submit"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            CANDIDATE ONLY VIEWS (CV, FAVORITES, ALERTS, VIEWS, HIDDEN)
        ======================================================== */}
        {!isRecruiter && currentTab === "cv" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                Mi CV
              </h1>
              <p className="text-sm text-slate-400">
                Gestiona tu currículum vitae para aplicar rápidamente a cualquier empleo
              </p>
            </div>

            <div className="bg-[#0a1e34]/80 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Currículum principal activo</span>
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                    PDF
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {cvFileName || "CV_Laura_Garcia_FullStack.pdf"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Actualizado recientemente • 1.4 MB • Completo
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerToast("Descargando currículum...")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>

            <div className="bg-[#0a1e34]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-3">
                Subir o actualizar versión de CV
              </h2>
              <div className="flex items-center justify-center w-full">
                <label
                  className="flex flex-col items-center justify-center w-full min-h-[12rem] border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-slate-900/80 hover:border-blue-500 transition-all p-6 text-center group"
                  htmlFor="cv-upload-input"
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <p className="mb-1 text-sm text-slate-300">
                      <span className="font-semibold text-blue-400 group-hover:underline">
                        Haz clic para subir
                      </span>{" "}
                      o arrastra tu documento aquí
                    </p>
                    <p className="text-xs text-slate-500">PDF, DOC o DOCX (Máx. 5MB)</p>
                  </div>

                  <input
                    className="hidden"
                    id="cv-upload-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {!isRecruiter && currentTab === "favorites" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              Mis favoritos
            </h1>
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-[#0a1e34]/80 border border-white/10 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                  </div>
                  <Link
                    to="/jobs"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    Ver oferta
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isRecruiter && currentTab === "alerts" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              Mis alertas de empleo
            </h1>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-[#0a1e34]/80 border border-white/10 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-white text-sm">{alert.keyword}</h3>
                    <p className="text-xs text-slate-400">{alert.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Activa
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isRecruiter && currentTab === "views" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              Quién vio mi perfil
            </h1>
            <div className="space-y-3">
              {profileViewers.map((viewer) => (
                <div
                  key={viewer.id}
                  className="p-4 rounded-xl bg-[#0a1e34]/80 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={viewer.logo} alt={viewer.company} className="w-10 h-10 rounded-xl" />
                    <div>
                      <h3 className="font-bold text-white text-sm">{viewer.company}</h3>
                      <p className="text-xs text-slate-400">{viewer.recruiter}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{viewer.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isRecruiter && currentTab === "hidden" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
              Ofertas ocultas
            </h1>
            <div className="space-y-3">
              {hiddenJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl bg-[#0a1e34]/80 border border-white/10 flex items-center justify-between"
                >
                  <span className="text-white text-sm">{job.title}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHiddenJobs([]);
                      triggerToast("Oferta restaurada");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold"
                  >
                    Mostrar de nuevo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CONFIGURACIÓN (BOTH ROLES) */}
        {currentTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                Configuración
              </h1>
              <p className="text-sm text-slate-400">
                {isRecruiter
                  ? "Ajustes de alertas de candidatos y notificaciones de selección"
                  : "Ajustes de privacidad, visibilidad y notificaciones de tu cuenta"}
              </p>
            </div>

            <div className="bg-[#0a1e34]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-white">
                  {isRecruiter ? "Preferencias de Reclutamiento" : "Privacidad y visibilidad"}
                </h2>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-white/10">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {isRecruiter
                        ? "Notificar por correo nuevas postulaciones"
                        : "Visible para empresas verificadas"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isRecruiter
                        ? "Recibe un email instantáneo cada vez que un candidato calificado aplique a una de tus ofertas"
                        : "Permite que reclutadores con vacantes activas encuentren tu perfil en las búsquedas"}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-white/10">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {isRecruiter
                        ? "Envío automático de confirmación al candidato"
                        : "Notificaciones de cambios de estado"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isRecruiter
                        ? "Envía un acuse de recibo profesional al candidato inmediatamente tras su postulación"
                        : "Recibe notificaciones cuando el estado de tu postulación avance"}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              </section>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => triggerToast("Preferencias guardadas con éxito")}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Guardar configuración
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
