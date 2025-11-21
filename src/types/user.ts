

export interface User {
  id: string;
  email: string;
  nome: string;
  foto_perfil?: string | null;
  bio?: string | null;
  telefone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileDTO {
  nome?: string;
  bio?: string;
  telefone?: string;
}

export interface ProfileFormData {
  nome: string;
  bio?: string;
  telefone?: string;
}