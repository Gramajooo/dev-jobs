export const PageLoader = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full gap-5 p-8"
      role="status"
      aria-live="polite"
      aria-label="Cargando contenido"
    >
      <div className="spinner" />
      <span className="text-slate-400 text-sm font-medium tracking-wide">Cargando...</span>
    </div>
  );
};

export default PageLoader;
