// src/services/api.ts


//>>ignorar erro da env
const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8001/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  user: User;
  token: string;
}

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

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },
  save: ({ token, user }: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = authStorage.getToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      // Com FormData (upload de arquivos) o navegador define o Content-Type
      // (multipart + boundary) sozinho; forçar JSON quebraria o envio.
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      // Obrigatório para o Laravel responder JSON (e não redirecionar) em erros
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message ?? 'Erro ao comunicar com o servidor.',
      response.status,
      data.errors ?? {},
    );
  }

  return data as T;
}

export const authService = {
  login: (email: string, password: string) =>
    api<AuthResponse>('/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: async () => {
    try {
      await api<{ message: string }>('/v1/admin/auth/logout', { method: 'POST' });
    } finally {
      authStorage.clear();
    }
  },
};