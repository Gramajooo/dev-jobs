import type { AuthResponse, SocialProvider, User, UserRole } from "../types/auth";

/**
 * Pre-configured mock users for testing different RBAC roles
 */
export const DEMO_USERS: Record<string, { user: User; passwordHash: string }> = {
  "admin@devjobs.com": {
    user: {
      id: "usr-admin-01",
      name: "Carlos Méndez (Admin)",
      email: "admin@devjobs.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      title: "Administrador de Plataforma",
      company: "DevJobs Inc.",
    },
    passwordHash: "Admin123!",
  },
  "recruiter@techsolutions.com": {
    user: {
      id: "usr-recruiter-02",
      name: "Sofia R. (Reclutadora)",
      email: "recruiter@techsolutions.com",
      role: "recruiter",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
      title: "Talent Acquisition Lead",
      company: "Tech Solutions",
    },
    passwordHash: "Recruiter123!",
  },
  "laura.garcia@example.com": {
    user: {
      id: "usr-dev-03",
      name: "Laura G.",
      email: "laura.garcia@example.com",
      role: "developer",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomCyY_G2z6S7PJLGHlOHkL0ATioq0bbrqR0Mk7mKxmE68MhmrqsldCIgZRsnIG6PORPrG4cLuQl2kEJv7t1Nn4C7eQWJB2JjPbdUEyo6D65gIE1seQJoz2xRdBM_734KDc1u8BPK3uYvL5XrjfjmSjC0gO5tUTxMcWq-CMcj69c7gAkEGNrpIfCzgFBn8fr2ZhDy9LTw73fHseGpFklr-2E-2mx1B0OeMcmJWoFWtKLpxSHAFQRti6HnZz9l9o3G97KZBNTUpx5k",
      title: "Programadora Full Stack",
      company: "Open for Opportunities",
    },
    passwordHash: "Dev12345!",
  },
};

const REFRESH_TOKEN_KEY = "devjobs_rt_rotation_session";

// Helper to create simulated short-lived JWTs (base64 encoded JSON)
const generateMockJWT = (user: User, expiresInMinutes: number = 10): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp,
      iat: Math.floor(Date.now() / 1000),
    })
  );
  const signature = btoa(`sig_${Date.now()}_${Math.random().toString(36).substring(2)}`);
  return `${header}.${payload}.${signature}`;
};

// Generates a random cryptographic refresh token
const generateRefreshToken = (): string => {
  return `rt_${Date.now()}_${Math.random().toString(36).substring(2)}_${Math.random().toString(36).substring(2)}`;
};

/**
 * Auth Service simulating backend token rotation & HTTP-only cookies
 */
export const authService = {
  /**
   * Traditional Email & Password Login
   */
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    // Artificial latency for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const account = DEMO_USERS[normalizedEmail];

    if (!account || account.passwordHash !== password) {
      // Default fallback for arbitrary credentials
      if (password.length < 6) {
        throw new Error("Credenciales inválidas. Comprueba tu correo y contraseña.");
      }
    }

    const user: User = account
      ? account.user
      : {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0],
          email: normalizedEmail,
          role: "developer" as UserRole,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        };

    const accessToken = generateMockJWT(user, 10); // 10 minutes lifetime
    const refreshToken = generateRefreshToken();

    // Store refresh token (simulating HttpOnly Secure Cookie on server)
    sessionStorage.setItem(
      REFRESH_TOKEN_KEY,
      JSON.stringify({ refreshToken, userId: user.id, user, issuedAt: Date.now() })
    );

    return {
      user,
      tokens: {
        accessToken,
        expiresIn: 600,
      },
    };
  },

  /**
   * Social OAuth Login (Google / GitHub)
   */
  async loginWithSocial(provider: SocialProvider): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: User = {
      id: `usr_social_${provider}_${Date.now()}`,
      name: provider === "google" ? "Laura G. (Google)" : "Laura G. (GitHub)",
      email: provider === "google" ? "laura.google@example.com" : "laura.github@example.com",
      role: "developer",
      avatar:
        provider === "google"
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDomCyY_G2z6S7PJLGHlOHkL0ATioq0bbrqR0Mk7mKxmE68MhmrqsldCIgZRsnIG6PORPrG4cLuQl2kEJv7t1Nn4C7eQWJB2JjPbdUEyo6D65gIE1seQJoz2xRdBM_734KDc1u8BPK3uYvL5XrjfjmSjC0gO5tUTxMcWq-CMcj69c7gAkEGNrpIfCzgFBn8fr2ZhDy9LTw73fHseGpFklr-2E-2mx1B0OeMcmJWoFWtKLpxSHAFQRti6HnZz9l9o3G97KZBNTUpx5k"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      title: "Desarrolladora Full Stack",
      company: "Open for Opportunities",
    };

    const accessToken = generateMockJWT(user, 10);
    const refreshToken = generateRefreshToken();

    sessionStorage.setItem(
      REFRESH_TOKEN_KEY,
      JSON.stringify({ refreshToken, userId: user.id, user, issuedAt: Date.now() })
    );

    return {
      user,
      tokens: {
        accessToken,
        expiresIn: 600,
      },
    };
  },

  /**
   * Silent Refresh with Token Rotation
   */
  async refreshAccessToken(): Promise<AuthResponse> {
    const sessionRaw = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    if (!sessionRaw) {
      throw new Error("No refresh session found");
    }

    let sessionData: { refreshToken: string; userId: string; user: User };
    try {
      sessionData = JSON.parse(sessionRaw);
    } catch {
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      throw new Error("Invalid session token structure");
    }

    // Artificial short delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Rotate refresh token
    const newRefreshToken = generateRefreshToken();
    const newAccessToken = generateMockJWT(sessionData.user, 10);

    sessionStorage.setItem(
      REFRESH_TOKEN_KEY,
      JSON.stringify({
        refreshToken: newRefreshToken,
        userId: sessionData.userId,
        user: sessionData.user,
        issuedAt: Date.now(),
      })
    );

    return {
      user: sessionData.user,
      tokens: {
        accessToken: newAccessToken,
        expiresIn: 600,
      },
    };
  },

  /**
   * Log out and invalidate refresh tokens
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if an active session exists
   */
  hasActiveSession(): boolean {
    return Boolean(sessionStorage.getItem(REFRESH_TOKEN_KEY));
  },
};
