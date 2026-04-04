import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { User, UpdateProfileDTO } from '@/types/user';
import toast from 'react-hot-toast';

export function useUser() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileDTO) => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        await update({ name: updatedUser.name });
        toast.success('Perfil atualizado com sucesso!');
        return updatedUser;
      } else {
        toast.error('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  }, [update]);

  return {
    user,
    loading,
    fetchProfile,
    updateProfile,
  };
}