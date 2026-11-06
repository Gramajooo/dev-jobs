import { Link } from 'react-router-dom';
import { Unlink } from 'lucide-react';

export const NotFound = () => {
  return (
    <main className="flex-1 flex justify-center items-center py-16 px-4 min-h-[calc(100vh-160px)]">
      <div className="flex flex-col items-center text-center gap-7 max-w-[34rem] mx-auto">
        <div className="text-sky-400 flex items-center justify-center [&_svg]:w-24 [&_svg]:h-24 [&_svg]:drop-shadow-[0_0_16px_rgba(17,115,212,0.4)]">
          <Unlink size={96} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight text-white">404</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Página no encontrada</h1>
          <p className="text-base text-slate-400 leading-relaxed mt-2 [&_code]:bg-slate-800 [&_code]:text-sky-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm [&_code]:border [&_code]:border-white/10">
            Oops! Parece que has hecho un <code>git push --force</code> a la URL equivocada.
          </p>
        </div>

        <Link to="/" className="btn-primary h-11 px-7 text-sm shadow-blue-600/35 hover:shadow-blue-600/45">
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
