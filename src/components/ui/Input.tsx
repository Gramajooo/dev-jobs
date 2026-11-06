import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-11 px-4 rounded-xl bg-slate-900/60 border ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-white/10 focus:border-sky-500 focus:ring-sky-500/20"
          } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
