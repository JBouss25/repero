export type Role = 'student' | 'parent' | 'tutor' | 'school_admin';

export interface SessionUser {
  sub: string;
  tenantId: string;
  email: string;
  roles: Role[];
}

export interface SessionTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

export interface Session {
  user: SessionUser;
  tokens: SessionTokens;
  createdAt: number;
  expiresAt: number;
}