import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SocialProvider, User, UserRole } from "../types/auth";
import { authService } from "../services/authService";
import {
  setApiAccessToken,
  subscribeToTokenUpdates,
  subscribeToUnauthorized,
} from "../services/apiClient";

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginSocial: (provider: SocialProvider) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token with API Client
  const updateAccessToken = useCallback((token: string | null) => {
    setAccessToken(token);
    setApiAccessToken(token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      updateAccessToken(null);
    }
  }, [updateAccessToken]);

  // Initial session restoration with Silent Refresh
  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      if (!authService.hasActiveSession()) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await authService.refreshAccessToken();
        if (isMounted) {
          setUser(response.user);
          updateAccessToken(response.tokens.accessToken);
        }
      } catch (err) {
        console.warn("Silent session restore failed:", err);
        if (isMounted) {
          setUser(null);
          updateAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    // Subscribe to background interceptor updates
    subscribeToTokenUpdates((token) => {
      if (isMounted) setAccessToken(token);
    });

    subscribeToUnauthorized(() => {
      if (isMounted) {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [updateAccessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await authService.loginWithEmail(email, password);
        setUser(response.user);
        updateAccessToken(response.tokens.accessToken);
      } finally {
        setIsLoading(false);
      }
    },
    [updateAccessToken]
  );

  const loginSocial = useCallback(
    async (provider: SocialProvider) => {
      setIsLoading(true);
      try {
        const response = await authService.loginWithSocial(provider);
        setUser(response.user);
        updateAccessToken(response.tokens.accessToken);
      } finally {
        setIsLoading(false);
      }
    },
    [updateAccessToken]
  );

  const refreshToken = useCallback(async () => {
    const response = await authService.refreshAccessToken();
    setUser(response.user);
    updateAccessToken(response.tokens.accessToken);
  }, [updateAccessToken]);

  const hasRole = useCallback(
    (requiredRoles: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      return roles.includes(user.role);
    },
    [user]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role: user?.role || null,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      login,
      loginSocial,
      logout,
      hasRole,
      refreshToken,
    }),
    [user, accessToken, isLoading, login, loginSocial, logout, hasRole, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
