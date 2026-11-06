import { Link } from "react-router-dom";
import {
  Home,
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  BarChart3,
  Settings,
  Search,
  Send,
  Heart,
  Bell,
  Eye,
  EyeOff,
} from "lucide-react";

interface ProfileSidebarProps {
  isRecruiter: boolean;
  currentTab: string;
  formData: { name: string; role: string; company: string };
  avatarUrl: string;
  recruiterStats: { activeJobs: number; totalCandidates: number };
  onTabChange: (tab: string) => void;
}

export const ProfileSidebar = ({
  isRecruiter,
  currentTab,
  formData,
  avatarUrl,
  recruiterStats,
  onTabChange,
}: ProfileSidebarProps) => {
  const navItemClass = (tabKey: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      currentTab === tabKey
        ? "bg-blue-600/20 text-sky-400 font-semibold border border-blue-500/30"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
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
          <>
            <button
              type="button"
              onClick={() => onTabChange("profile")}
              className={navItemClass("profile")}
            >
              <Building2 className="w-4 h-4" />
              <span>Perfil de Empresa</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("jobs")}
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
              onClick={() => onTabChange("candidates")}
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
              onClick={() => onTabChange("new-job")}
              className={navItemClass("new-job")}
            >
              <PlusCircle className="w-4 h-4 text-sky-400" />
              <span>Publicar empleo</span>
            </button>

            <div className="hidden lg:block my-2 border-t border-white/10" />

            <button
              type="button"
              onClick={() => onTabChange("stats")}
              className={navItemClass("stats")}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Métricas y Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("settings")}
              className={navItemClass("settings")}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onTabChange("profile")}
              className={navItemClass("profile")}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z" />
              </svg>
              <span>Mi área</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("cv")}
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
              onClick={() => onTabChange("favorites")}
              className={navItemClass("favorites")}
            >
              <Heart className="w-4 h-4" />
              <span>Mis favoritos</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("alerts")}
              className={navItemClass("alerts")}
            >
              <Bell className="w-4 h-4" />
              <span>Mis alertas</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("views")}
              className={navItemClass("views")}
            >
              <Eye className="w-4 h-4" />
              <span>Quién vio mi perfil</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("hidden")}
              className={navItemClass("hidden")}
            >
              <EyeOff className="w-4 h-4" />
              <span>Ofertas ocultas</span>
            </button>

            <div className="hidden lg:block my-2 border-t border-white/10" />

            <button
              type="button"
              onClick={() => onTabChange("settings")}
              className={navItemClass("settings")}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </>
        )}
      </nav>
    </aside>
  );
};
