import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Send,
  Heart,
  Bell,
  EyeOff,
  Settings,
  Power,
  Check,
  Briefcase,
  ExternalLink,
  ChevronDown,
  Building2,
  Users,
  PlusCircle,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useApplications } from "../../hooks/useApplications";
import { useRecruiter } from "../../hooks/useRecruiter";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
  type: "application" | "alert" | "view";
}

interface DropdownPosition {
  style: React.CSSProperties;
  openUpward: boolean;
}

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { applications } = useApplications();
  const { stats: recruiterStats } = useRecruiter();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Position styles for popovers based on screen space
  const [notifDropdownPos, setNotifDropdownPos] = useState<DropdownPosition>({
    style: {},
    openUpward: false,
  });
  const [userDropdownPos, setUserDropdownPos] = useState<DropdownPosition>({
    style: {},
    openUpward: false,
  });

  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  // Mock initial notifications depending on role
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (user?.role === "recruiter" || user?.role === "admin") {
      return [
        {
          id: "notif-rec-1",
          title: "Nueva postulación recibida",
          message: "Laura García ha postulado a Senior Frontend Engineer (React).",
          time: "Hace 20 min",
          isRead: false,
          link: "/profile?tab=candidates",
          type: "application",
        },
        {
          id: "notif-rec-2",
          title: "Entrevista técnica programada",
          message: "Entrevista con Mateo Silva confirmada para mañana a las 11:00 AM.",
          time: "Hace 2 horas",
          isRead: false,
          link: "/profile?tab=candidates",
          type: "view",
        },
        {
          id: "notif-rec-3",
          title: "Vacante con alta demanda",
          message: "Tu oferta 'Full Stack Developer' ha alcanzado 5 nuevos candidatos.",
          time: "Ayer",
          isRead: true,
          link: "/profile?tab=jobs",
          type: "alert",
        },
      ];
    }

    return [
      {
        id: "notif-1",
        title: "Postulación recibida",
        message:
          applications.length > 0
            ? `Tu postulación para "${applications[0].jobTitle}" en ${applications[0].companyName} está en proceso.`
            : "Tu candidatura ha sido enviada exitosamente al equipo de selección.",
        time: "Hace 1 hora",
        isRead: false,
        link: "/candidaturas",
        type: "application",
      },
      {
        id: "notif-2",
        title: "Quién vio tu perfil",
        message: "Reclutadores de Globant y Mercado Libre revisaron tu perfil.",
        time: "Hace 4 horas",
        isRead: false,
        link: "/profile?tab=views",
        type: "view",
      },
      {
        id: "notif-3",
        title: "Nueva oferta recomendada",
        message: "Frontend Engineer (React & TypeScript) - Modalidad Remota.",
        time: "Ayer",
        isRead: true,
        link: "/jobs",
        type: "alert",
      },
    ];
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getRoleTagClass = () => {
    if (user?.role === "admin")
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    if (user?.role === "recruiter")
      return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    return "bg-sky-500/20 text-sky-400 border border-sky-500/30";
  };

  /**
   * Calculates intelligent dropdown placement so it never overflows screen boundaries
   */
  const calculatePosition = useCallback(
    (
      triggerEl: HTMLElement | null,
      preferredWidth: number,
      preferredHeight: number
    ): DropdownPosition => {
      if (!triggerEl) {
        return { style: {}, openUpward: false };
      }

      const rect = triggerEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 12;

      // Ensure width does not exceed viewport
      const width = Math.min(preferredWidth, viewportWidth - margin * 2);

      // Horizontal space calculation:
      let left = rect.right - width;

      // If it would overflow left of screen, push it inward
      if (left < margin) {
        left = Math.max(margin, rect.left);
      }

      // If it would overflow right of screen, push it inward
      if (left + width > viewportWidth - margin) {
        left = viewportWidth - width - margin;
      }

      // Vertical space calculation:
      const spaceBelow = viewportHeight - rect.bottom - margin;
      const spaceAbove = rect.top - margin;

      // If not enough space below and more space above, open upwards
      const openUpward = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
      const maxHeight = Math.min(
        540,
        Math.max(220, openUpward ? spaceAbove - 8 : spaceBelow - 8)
      );

      const style: React.CSSProperties = {
        position: "fixed",
        left: `${Math.round(left)}px`,
        width: `${Math.round(width)}px`,
        maxHeight: `${Math.round(maxHeight)}px`,
        zIndex: 9999,
      };

      if (openUpward) {
        style.bottom = `${Math.round(viewportHeight - rect.top + 8)}px`;
      } else {
        style.top = `${Math.round(rect.bottom + 8)}px`;
      }

      return { style, openUpward };
    },
    []
  );

  // Recalculate positions whenever dropdowns open or viewport changes
  const updatePositions = useCallback(() => {
    if (isNotificationsOpen && bellButtonRef.current) {
      setNotifDropdownPos(calculatePosition(bellButtonRef.current, 360, 380));
    }
    if (isMenuOpen && userButtonRef.current) {
      setUserDropdownPos(calculatePosition(userButtonRef.current, 260, 440));
    }
  }, [isNotificationsOpen, isMenuOpen, calculatePosition]);

  useEffect(() => {
    updatePositions();
  }, [updatePositions]);

  // Handle window resize and scroll
  useEffect(() => {
    if (!isNotificationsOpen && !isMenuOpen) return;

    const handleWindowChange = () => {
      updatePositions();
    };

    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);

    return () => {
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
    };
  }, [isNotificationsOpen, isMenuOpen, updatePositions]);

  // Close menus on click outside or Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideNotif =
        bellButtonRef.current?.contains(target) ||
        notifMenuRef.current?.contains(target);
      const clickedInsideUser =
        userButtonRef.current?.contains(target) ||
        userMenuRef.current?.contains(target);

      if (!clickedInsideNotif) {
        setIsNotificationsOpen(false);
      }
      if (!clickedInsideUser) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!user) return null;

  const handleToggleUserMenu = () => {
    setIsNotificationsOpen(false);
    setIsMenuOpen((prev) => {
      const next = !prev;
      if (next && userButtonRef.current) {
        setUserDropdownPos(calculatePosition(userButtonRef.current, 260, 440));
      }
      return next;
    });
  };

  const handleToggleNotifications = () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen((prev) => {
      const next = !prev;
      if (next && bellButtonRef.current) {
        setNotifDropdownPos(calculatePosition(bellButtonRef.current, 360, 380));
      }
      return next;
    });
  };

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    await logout();
    navigate("/");
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationsOpen(false);
    navigate(notif.link);
  };

  return (
    <div className="flex items-center gap-2.5" ref={containerRef}>
      {/* 1. Campanita - Botón azul con los colores de la página */}
      <button
        ref={bellButtonRef}
        type="button"
        onClick={handleToggleNotifications}
        className={`relative p-2 rounded-full transition-all duration-200 cursor-pointer shadow-md focus:outline-none shrink-0 ${
          isNotificationsOpen
            ? "bg-blue-500 text-white ring-2 ring-blue-400/50 shadow-blue-500/30"
            : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-blue-600/25 hover:shadow-blue-600/40"
        }`}
        title="Notificaciones"
        aria-expanded={isNotificationsOpen}
        aria-label="Ver notificaciones"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#06182a] shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 2. Usuario - Como estaba antes (estilo nativo de la página) */}
      <button
        ref={userButtonRef}
        type="button"
        onClick={handleToggleUserMenu}
        className={`flex items-center gap-2.5 py-1 pr-3 pl-1.5 rounded-full border transition-all duration-200 cursor-pointer group focus:outline-none ${
          isMenuOpen
            ? "bg-white/15 border-white/25 text-white shadow-lg shadow-black/20"
            : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
        }`}
        title="Menú de perfil"
        aria-expanded={isMenuOpen}
        aria-label="Menú de usuario"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-7.5 h-7.5 rounded-full object-cover border border-white/20 shadow-xs shrink-0"
        />
        <span className="text-[0.8125rem] font-semibold text-white truncate max-w-[110px] sm:max-w-[140px] group-hover:text-sky-300 transition-colors select-none">
          {user.name}
        </span>
        <span
          className={`text-[0.6875rem] font-bold uppercase tracking-wider py-0.5 px-1.5 rounded ${getRoleTagClass()}`}
        >
          {user.role}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${
            isMenuOpen ? "rotate-180 text-sky-400" : ""
          }`}
        />
      </button>

      {/* Panel Desplegable de Notificaciones - Con los colores de la página */}
      {isNotificationsOpen && (
        <div
          ref={notifMenuRef}
          style={notifDropdownPos.style}
          className="bg-[#0a1e34]/98 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/80 border border-white/10 p-3.5 text-slate-200 animate-in fade-in duration-150 flex flex-col"
          role="dialog"
          aria-label="Notificaciones"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 px-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-400" />
                Notificaciones
              </span>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>

          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  notif.isRead
                    ? "bg-white/5 hover:bg-white/10 opacity-75 hover:opacity-100"
                    : "bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {notif.type === "application" && (
                      <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    )}
                    {notif.type === "view" && (
                      <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                    {notif.type === "alert" && (
                      <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2.5 mt-2 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleNavigate(
                  isRecruiter ? "/profile?tab=candidates" : "/candidaturas"
                )
              }
              className="w-full py-2 px-3 text-xs font-semibold text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>
                {isRecruiter
                  ? "Ver panel de candidatos"
                  : "Ver todas mis candidaturas"}
              </span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Menú Desplegable de Usuario - Con los colores de la página */}
      {isMenuOpen && (
        <div
          ref={userMenuRef}
          style={userDropdownPos.style}
          className="bg-[#0a1e34]/98 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/80 border border-white/10 py-2.5 text-slate-200 animate-in fade-in duration-150 overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
        >
          {isRecruiter ? (
            /* Menú para Reclutador / Empresa */
            <div className="space-y-0.5 px-1.5">
              <button
                type="button"
                onClick={() => handleNavigate("/profile?tab=profile")}
                className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                role="menuitem"
              >
                <Building2
                  className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                  strokeWidth={1.8}
                />
                <span>Perfil de Empresa</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("/profile?tab=jobs")}
                className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                role="menuitem"
              >
                <Briefcase
                  className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                  strokeWidth={1.8}
                />
                <span className="flex-1">Mis vacantes publicadas</span>
                <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                  {recruiterStats.activeJobs}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("/profile?tab=candidates")}
                className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                role="menuitem"
              >
                <Users
                  className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                  strokeWidth={1.8}
                />
                <span className="flex-1">Candidatos y Seguimiento</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {recruiterStats.totalCandidates}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("/profile?tab=new-job")}
                className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                role="menuitem"
              >
                <PlusCircle
                  className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                  strokeWidth={1.8}
                />
                <span>Publicar nuevo empleo</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("/profile?tab=stats")}
                className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                role="menuitem"
              >
                <BarChart3
                  className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                  strokeWidth={1.8}
                />
                <span>Métricas y Pipeline</span>
              </button>
            </div>
          ) : (
            /* Menú para Desarrollador / Candidato */
            <>
              {/* Section 1: Area & CV */}
              <div className="space-y-0.5 px-1.5">
                <button
                  type="button"
                  onClick={() => handleNavigate("/profile")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <Home
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Mi área</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/profile?tab=cv")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <svg
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="3" />
                    <circle cx="8.5" cy="8.5" r="2" />
                    <path d="M14 8h3" />
                    <path d="M14 12h3" />
                    <path d="M6 16h12" />
                  </svg>
                  <span>Mi CV</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-white/10" />

              {/* Section 2: Jobs, Applications, Saved, Alerts, Views, Hidden */}
              <div className="space-y-0.5 px-1.5">
                <button
                  type="button"
                  onClick={() => handleNavigate("/jobs")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <Search
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Buscar ofertas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/candidaturas")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <Send
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="flex-1">Mis postulaciones</span>
                  {applications.length > 0 && (
                    <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                      {applications.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/profile?tab=favorites")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <Heart
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Mis favoritos</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/profile?tab=alerts")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <Bell
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Mis alertas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/profile?tab=views")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <svg
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 19v-1a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1" />
                    <circle cx="9" cy="7" r="3.5" />
                    <circle cx="17" cy="17" r="2.5" />
                    <path d="m19 19 2.5 2.5" />
                  </svg>
                  <span>Quién vio mi perfil</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/profile?tab=hidden")}
                  className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <EyeOff
                    className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>Ofertas ocultas</span>
                </button>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="my-1.5 border-t border-white/10" />

          {/* Section 3: Settings & Logout */}
          <div className="space-y-0.5 px-1.5">
            <button
              type="button"
              onClick={() => handleNavigate("/profile?tab=settings")}
              className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors cursor-pointer group"
              role="menuitem"
            >
              <Settings
                className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform shrink-0"
                strokeWidth={1.8}
              />
              <span>Configuración</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-3 py-2 text-left text-sm font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 rounded-xl transition-colors cursor-pointer group"
              role="menuitem"
            >
              <Power
                className="w-5 h-5 text-red-400 group-hover:scale-105 transition-transform shrink-0"
                strokeWidth={1.8}
              />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
