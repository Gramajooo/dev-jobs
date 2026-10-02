import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import type { SocialProvider } from "../types/auth";
import {
  LoginHeader,
  DemoAccounts,
  SocialLoginButtons,
  AuthDivider,
  LoginForm,
  RegisterLinks,
  loginSchema,
  type LoginFormValues,
} from "../components/Login";

export const Login = () => {
  const { login, loginSocial } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittingSocial, setIsSubmittingSocial] = useState<SocialProvider | null>(null);

  // Read destination from search params ?returnTo=... or router state
  const returnTo =
    searchParams.get("returnTo") ||
    (location.state as { from?: { pathname: string; search: string } })?.from?.pathname ||
    "/jobs";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(values.email, values.password);
      navigate(decodeURIComponent(returnTo), { replace: true });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al iniciar sesión. Intenta nuevamente."
      );
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setErrorMessage(null);
    setIsSubmittingSocial(provider);
    try {
      await loginSocial(provider);
      navigate(decodeURIComponent(returnTo), { replace: true });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : `Error al conectar con ${provider}. Intenta nuevamente.`
      );
    } finally {
      setIsSubmittingSocial(null);
    }
  };

  const handleFillDemo = (email: string, pass: string) => {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", pass, { shouldValidate: true });
  };

  return (
    <main className="flex-1 flex justify-center items-center py-12 px-4 min-h-[calc(100vh-160px)]">
      <div className="w-full max-w-md flex flex-col gap-7">
        <LoginHeader />

        <DemoAccounts onSelectAccount={handleFillDemo} />

        <div className="card-surface p-8 shadow-2xl">
          <SocialLoginButtons
            onSocialLogin={handleSocialLogin}
            loadingProvider={isSubmittingSocial}
            disabled={form.formState.isSubmitting}
          />

          <AuthDivider text="o con correo electrónico" />

          {errorMessage && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm mb-5">
              {errorMessage}
            </div>
          )}

          <LoginForm
            form={form}
            onSubmit={onSubmit}
            isSubmittingSocial={Boolean(isSubmittingSocial)}
          />

          <AuthDivider text="¿No tienes una cuenta?" />

          <RegisterLinks />
        </div>
      </div>
    </main>
  );
};

export default Login;
