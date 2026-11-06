import type { UseFormReturn } from "react-hook-form";
import { Lock, Mail } from "lucide-react";
import type { LoginFormValues } from "./loginSchema";

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  isSubmittingSocial?: boolean;
}

export const LoginForm = ({
  form,
  onSubmit,
  isSubmittingSocial = false,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const isDisabled = isSubmitting || isSubmittingSocial;

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Email Field */}
      <div className="flex flex-col w-full gap-1.5">
        <label htmlFor="email" className="sr-only">
          Correo electrónico
        </label>
        <div className="relative flex items-center w-full">
          <Mail
            className="absolute left-3.5 text-slate-500 pointer-events-none z-10"
            size={18}
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Correo electrónico"
            className={`w-full bg-[#1e293b] border border-white/15 rounded-lg text-white outline-none focus:border-blue-500 transition-colors h-12 py-3 px-4 pl-11 text-[0.95rem] ${
              errors.email ? "border-red-500" : ""
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <span className="text-red-400 text-xs font-medium pl-1">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col w-full gap-1.5">
        <label htmlFor="password" className="sr-only">
          Contraseña
        </label>
        <div className="relative flex items-center w-full">
          <Lock
            className="absolute left-3.5 text-slate-500 pointer-events-none z-10"
            size={18}
          />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            className={`w-full bg-[#1e293b] border border-white/15 rounded-lg text-white outline-none focus:border-blue-500 transition-colors h-12 py-3 px-4 pl-11 text-[0.95rem] ${
              errors.password ? "border-red-500" : ""
            }`}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <span className="text-red-400 text-xs font-medium pl-1">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Checkbox & Forgot link */}
      <div className="flex items-center justify-between text-sm gap-2 flex-wrap">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            id="remember-me"
            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            {...register("rememberMe")}
          />
          <span>Recordarme</span>
        </label>

        <a
          href="#"
          className="text-sky-400 no-underline font-medium transition-colors hover:text-sky-300 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="inline-flex items-center justify-center bg-blue-600 text-white rounded-lg font-bold transition-colors hover:bg-blue-700 w-full h-11 text-[0.95rem] shadow-lg shadow-blue-600/20 gap-2 cursor-pointer disabled:cursor-not-allowed"
        disabled={isDisabled}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </button>
    </form>
  );
};
