
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  profileImage?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  createdAt: Date;
}

export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
  phoneNumber?: string;
}