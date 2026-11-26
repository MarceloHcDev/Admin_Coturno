
import axios from "axios";

const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";
const TOKEN_EXPIRATION_KEY = "admin_token_expires_at";

export interface User {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface BackendAuthResponse {
  status: string;
  message: string;
  data: {
    usuario: User;
    token: string;
    token_type: string;
    abilities: string[];
    expires_at: string | null;
  };
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Adiciona o token automaticamente em todas as requisições.
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de resposta para tratar sessões expiradas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sessão administrativa expirada ou não autenticada (401).");
    }
    return Promise.reject(error);
  }
);

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  save: (auth: AuthResponse, expiresAt?: string | null) => {
    localStorage.setItem(TOKEN_KEY, auth.token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));

    if (expiresAt) {
      localStorage.setItem(TOKEN_EXPIRATION_KEY, expiresAt);
    } else {
      localStorage.removeItem(TOKEN_EXPIRATION_KEY);
    }
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  },
};

export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>(
      "/auth/login",
      { email, password },
    );

    const auth: AuthResponse = {
      user: response.data.data.usuario,
      token: response.data.data.token,
    };

    authStorage.save(auth, response.data.data.expires_at);

    return auth;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      authStorage.clear();
    }
  },
};

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}