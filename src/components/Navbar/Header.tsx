import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { RoleGuard } from "../Auth/RoleGuard";
import { UserMenu } from "./UserMenu";

type HeaderProps = {
  children?: ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="relative py-3 px-4 sm:px-6 border-b border-white/10 bg-[#06182a] flex items-center justify-between sticky top-0 z-30">
        {/* Left: Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-sky-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <h1>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-xl font-bold text-white flex items-center gap-2 no-underline group"
            >
              <svg
                className="w-7 h-7 text-sky-400 group-hover:scale-105 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>DevJobs</span>
            </Link>
          </h1>
        </div>

        {/* Center: Absolute Centered Navigation (Guaranteed 50% screen center) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          {children}
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-10 ml-auto">
          {/* RBAC Action: Only Recruiters and Admins can publish jobs */}
          <RoleGuard roles={["admin", "recruiter"]}>
            <Link
              to="/profile?tab=new-job"
              className="btn-secondary py-2 px-3.5 text-xs sm:text-sm font-semibold no-underline hidden lg:inline-flex"
            >
              Publicar un empleo
            </Link>
          </RoleGuard>

          {isAuthenticated && user ? (
            <UserMenu />
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg py-2 px-4 text-sm font-semibold transition-colors duration-200 shadow-md shadow-blue-600/25 no-underline inline-flex items-center justify-center"
            >
              Únete gratis
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1e34]/98 border-b border-white/10 px-5 py-4 space-y-2 sticky top-[57px] z-20 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
          <nav className="flex flex-col gap-1.5" aria-label="Navegación móvil">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname === "/"
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/jobs"
              onClick={closeMobileMenu}
              className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname.startsWith("/jobs")
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Empleos
            </Link>
            <Link
              to="/companies"
              onClick={closeMobileMenu}
              className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname.startsWith("/companies")
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Empresas
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};
