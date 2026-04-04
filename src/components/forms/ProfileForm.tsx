'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@/hooks/useUser';
import type { ProfileFormData } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ProfileForm() {
  const { user, loading, fetchProfile, updateProfile } = useUser();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('bio', user.bio || '');
      setValue('phoneNumber', user.phoneNumber || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  if (loading && !user) {
    return <div className="animate-pulse text-muted-foreground">Carregando perfil...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          {...register('name', { required: 'Nome é obrigatório' })}
          placeholder="Seu nome"
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          rows={3}
          placeholder="Conte um pouco sobre você..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Telefone</Label>
        <Input
          id="phoneNumber"
          {...register('phoneNumber')}
          placeholder="(11) 99999-9999"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
}