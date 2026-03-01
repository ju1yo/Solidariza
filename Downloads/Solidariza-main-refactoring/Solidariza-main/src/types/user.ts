

export interface User {
  id: string;
  email: string;
  nome: string;
  profileImage?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileDTO {
  nome?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface ProfileFormData {
  nome: string;
  bio?: string;
  phoneNumber?: string;
}