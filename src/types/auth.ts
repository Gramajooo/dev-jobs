export type UserRole = "admin" | "recruiter" | "developer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  company?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number; // in seconds
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export type SocialProvider = "google" | "github";
