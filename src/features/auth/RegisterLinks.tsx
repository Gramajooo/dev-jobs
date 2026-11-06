import { Link } from "react-router-dom";

export const RegisterLinks = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Link
        to="/registro-dev"
        className="inline-flex items-center justify-center border border-white/15 rounded-lg text-white transition-colors hover:bg-white/5 py-2.5 px-3 text-xs font-medium text-center no-underline"
      >
        Regístrate como desarrollador
      </Link>
      <Link
        to="/registro-empresa"
        className="inline-flex items-center justify-center border border-white/15 rounded-lg text-white transition-colors hover:bg-white/5 py-2.5 px-3 text-xs font-medium text-center no-underline"
      >
        Regístrate como empresa
      </Link>
    </div>
  );
};
