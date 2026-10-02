import { Link, useLocation } from "react-router-dom";

export const MenuPages = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="flex items-center gap-7 sm:gap-8" aria-label="Navegación principal">
      <Link
        to="/"
        className={`text-[0.9375rem] transition-colors duration-200 no-underline ${
          isActive("/")
            ? "text-white font-bold"
            : "text-slate-300 hover:text-white font-medium"
        }`}
      >
        Inicio
      </Link>
      <Link
        to="/jobs"
        className={`text-[0.9375rem] transition-colors duration-200 no-underline ${
          isActive("/jobs")
            ? "text-white font-bold"
            : "text-slate-300 hover:text-white font-medium"
        }`}
      >
        Empleos
      </Link>
      <Link
        to="/companies"
        className={`text-[0.9375rem] transition-colors duration-200 no-underline ${
          isActive("/companies")
            ? "text-white font-bold"
            : "text-slate-300 hover:text-white font-medium"
        }`}
      >
        Empresas
      </Link>
    </nav>
  );
};

