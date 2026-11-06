import { type HTMLAttributes } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-800 text-slate-300 border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  info: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  outline: "bg-transparent text-slate-300 border-white/20",
};

export const Badge = ({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
