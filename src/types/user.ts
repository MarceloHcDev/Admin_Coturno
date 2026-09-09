export type UserRole = 'Administrador' | 'VIP' | 'Cliente';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}