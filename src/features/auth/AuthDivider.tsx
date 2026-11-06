interface AuthDividerProps {
  text: string;
}

export const AuthDivider = ({ text }: AuthDividerProps) => {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-x-0 h-px bg-slate-700" />
      <span className="relative px-3 bg-[#1e293b] text-slate-400 text-xs">{text}</span>
    </div>
  );
};
