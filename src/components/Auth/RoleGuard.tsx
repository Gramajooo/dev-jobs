import { type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";

interface RoleGuardProps {
  roles: UserRole | UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const RoleGuard = ({
  roles,
  fallback = null,
  children,
}: RoleGuardProps) => {
  const { hasRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <>{fallback}</>;
  }

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
