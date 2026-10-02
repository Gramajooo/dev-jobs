import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import type { ApplicationStatus, JobApplication } from "../types/application";

type FilterTab = "todas" | "en_revision" | "entrevista" | "finalista" | "descartada";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    stepIndex: number;
  }
> = {
  recibida: {
    label: "Recibida",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dotClass: "bg-sky-400",
    stepIndex: 0,
  },
  en_revision: {
    label: "En revisión",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dotClass: "bg-amber-400",
    stepIndex: 1,
  },
  entrevista: {
    label: "En entrevista",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    dotClass: "bg-purple-400",
    stepIndex: 2,
  },
  finalista: {
    label: "Finalista",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotClass: "bg-emerald-400",
    stepIndex: 3,
  },
  descartada: {
    label: "Descartada",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dotClass: "bg-rose-400",
    stepIndex: -1,
  },
};

const PROCESS_STEPS = ["Postulación recibida", "Revisión técnica", "Entrevista", "Resolución"];

export const Applications = () => {
  const { user } = useAuth();
  const { applications, stats, withdrawApplication } = useApplications();
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState<JobApplication | null>(null);

  const isRecruiter = user?.role === "recruiter";

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Filter by status tab
      if (activeTab === "en_revision") {
        if (app.status !== "en_revision" && app.status !== "recibida") return false;
      } else if (activeTab !== "todas" && app.status !== activeTab) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = app.jobTitle.toLowerCase().includes(query);
        const companyMatch = app.companyName.toLowerCase().includes(query);
        const locationMatch = app.locationName.toLowerCase().includes(query);
        if (!titleMatch && !companyMatch && !locationMatch) return false;
      }

      return true;
    });
  }, [applications, activeTab, searchQuery]);

  if (isRecruiter) {
    return (
      <main className="flex-1 w-full pt-10 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-surface p-8 sm:p-12 text-center flex flex-col items-center gap-5 border border-white/10 rounded-2xl bg-[#0a1e34]">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Sección exclusiva para candidatos
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                Tu cuenta tiene rol de <strong>Reclutador</strong>. Los reclutadores no se postulan a ofertas de trabajo; en su lugar, pueden publicar vacantes y gestionar a los postulantes.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/profile?tab=candidates"
                className="btn-primary h-11 px-6 text-sm flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Ver mis candidatos</span>
              </Link>
              <Link
                to="/profile?tab=jobs"
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Gestionar vacantes</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const handleConfirmWithdraw = () => {
    if (selectedAppToWithdraw) {
      withdrawApplication(selectedAppToWithdraw.jobId);
      setSelectedAppToWithdraw(null);
    }
  };

  return (
    <main className="flex-1 w-full py-8 px-4 max-w-6xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-sky-400 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-medium">Mis candidaturas</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mis Candidaturas
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Monitorea en tiempo real el estado de tus postulaciones y procesos de selección.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 w-fit shrink-0 active:scale-95"
          >
            <Briefcase size={16} />
            <span>Explorar más empleos</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e293b]/70 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm group hover:border-sky-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total enviadas</span>
            <Briefcase size={16} className="text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.total}</p>
          <span className="text-xs text-slate-400 mt-1 block">Postulaciones activas</span>
        </div>

        <div className="bg-[#1e293b]/70 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>En revisión</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.enRevision}</p>
          <span className="text-xs text-amber-400/80 mt-1 block">Esperando respuesta</span>
        </div>

        <div className="bg-[#1e293b]/70 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Entrevistas</span>
            <Calendar size={16} className="text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.entrevista}</p>
          <span className="text-xs text-purple-400/80 mt-1 block">En proceso activo</span>
        </div>

        <div className="bg-[#1e293b]/70 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Finalistas</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.finalista}</p>
          <span className="text-xs text-emerald-400/80 mt-1 block">Etapa decisiva</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("todas")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "todas"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Todas ({applications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("en_revision")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "en_revision"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            En revisión ({stats.enRevision})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("entrevista")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "entrevista"
                ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Entrevista ({stats.entrevista})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("finalista")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "finalista"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Finalista ({stats.finalista})
          </button>

          {stats.descartada > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("descartada")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "descartada"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Descartadas ({stats.descartada})
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por puesto o empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-8 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredApplications.map((app) => {
            const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.recibida;
            return (
              <article
                key={app.id}
                className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col gap-5 relative group"
              >
                {/* Upper block: Job Info & Status Badge */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="text-lg sm:text-xl font-bold text-white hover:text-sky-400 transition-colors no-underline hover:underline"
                      >
                        {app.jobTitle}
                      </Link>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.dotClass} animate-pulse`} />
                        {config.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1.5 font-medium text-sky-400">
                        <Building2 size={15} />
                        {app.companyId ? (
                          <Link
                            to={`/companies/${app.companyId}`}
                            className="hover:underline text-sky-400"
                          >
                            {app.companyName}
                          </Link>
                        ) : (
                          app.companyName
                        )}
                      </span>

                      <span>·</span>

                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} />
                        {app.locationName}
                      </span>

                      <span>·</span>

                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={14} />
                        Postulado el {formatDate(app.appliedAt)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {app.salaryText && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                          💰 {app.salaryText}
                        </span>
                      )}
                      {app.modality && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20 capitalize">
                          {app.modality}
                        </span>
                      )}
                      {app.workSchedule && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 capitalize">
                          {app.workSchedule.replace("-", " ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0 pt-1">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all no-underline"
                    >
                      <span>Ver oferta</span>
                      <ExternalLink size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedAppToWithdraw(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-transparent hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 text-xs font-medium transition-all"
                      title="Retirar postulación"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Retirar</span>
                    </button>
                  </div>
                </div>

                {/* Lower block: Visual Hiring Process Stepper */}
                {app.status !== "descartada" && (
                  <div className="pt-4 border-t border-white/5">
                    <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
                      <span>Progreso del proceso</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 relative">
                      {PROCESS_STEPS.map((stepName, idx) => {
                        const isCompleted = idx <= config.stepIndex;
                        const isCurrent = idx === config.stepIndex;

                        return (
                          <div key={stepName} className="flex flex-col items-start gap-1.5">
                            {/* Step bar */}
                            <div
                              className={`h-1.5 w-full rounded-full transition-all ${
                                isCompleted
                                  ? isCurrent
                                    ? "bg-sky-400 shadow-sm shadow-sky-400/50"
                                    : "bg-emerald-500"
                                  : "bg-slate-700/60"
                              }`}
                            />
                            <span
                              className={`text-[0.7rem] sm:text-xs font-medium transition-colors ${
                                isCurrent
                                  ? "text-sky-300 font-semibold"
                                  : isCompleted
                                  ? "text-slate-300"
                                  : "text-slate-500"
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : applications.length === 0 ? (
        /* Empty State: No applications at all */
        <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto backdrop-blur-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
            <Briefcase size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Aún no tienes candidaturas</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Explora cientos de ofertas laborales diseñadas para profesionales de la tecnología y da el
            siguiente paso en tu carrera profesional.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 no-underline mt-2"
          >
            <span>Buscar ofertas de empleo</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Empty State: Filter produced no matches */
        <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center gap-3 max-w-md mx-auto backdrop-blur-sm my-8">
          <AlertCircle size={28} className="text-amber-400" />
          <h2 className="text-lg font-bold text-white">Sin resultados</h2>
          <p className="text-slate-400 text-sm">
            No se encontraron candidaturas que coincidan con los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("todas");
              setSearchQuery("");
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {/* Confirmation Modal to withdraw application */}
      {selectedAppToWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#1e293b] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg">
                <Trash2 size={20} />
                <span>Retirar candidatura</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppToWithdraw(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              ¿Estás seguro de que deseas retirar tu postulación a{" "}
              <strong className="text-white">{selectedAppToWithdraw.jobTitle}</strong> en{" "}
              <strong className="text-white">{selectedAppToWithdraw.companyName}</strong>?
            </p>

            <p className="text-xs text-slate-400">
              Esta acción eliminará tu candidatura de tu panel. Podrás volver a postularte más adelante
              si la vacante continúa activa.
            </p>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setSelectedAppToWithdraw(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                Sí, retirar candidatura
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Applications;
