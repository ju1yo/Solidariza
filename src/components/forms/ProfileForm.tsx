'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@/hooks/useUser';
import type { ProfileFormData } from '@/types/user';

export function ProfileForm() {
  const { user, loading, fetchProfile, updateProfile } = useUser();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setValue('nome', user.nome);
      setValue('bio', user.bio || '');
      setValue('telefone', user.telefone || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  if (loading && !user) {
    return <div className="animate-pulse">Carregando perfil...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full p-2 border rounded-md"
          placeholder="Seu nome"
        />
        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          {...register('bio')}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Conte um pouco sobre você..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Telefone</label>
        <input
          {...register('telefone')}
          className="w-full p-2 border rounded-md"
          placeholder="(11) 99999-9999"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
}