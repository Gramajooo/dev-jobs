interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export const LoginHeader = ({
  title = "Bienvenido de nuevo",
  subtitle = "Inicia sesión para acceder a tu perfil y oportunidades.",
}: LoginHeaderProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-white tracking-tight">{title}</h2>
      <p className="mt-2 text-[0.925rem] text-slate-400">{subtitle}</p>
    </div>
  );
};
