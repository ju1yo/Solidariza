'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Settings, Camera } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { user, loading, fetchProfile } = useUser();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/profile/photo', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Foto atualizada!');
        fetchProfile();
      } else {
        toast.error('Erro ao enviar foto');
      }
    } catch {
      toast.error('Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-lg">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-8 py-16">
        <div className="flex items-start gap-12 max-w-6xl mx-auto">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <Avatar className="w-80 h-80 border-4 border-transparent bg-gradient-to-br from-blue-500 to-red-500 p-1">
                <AvatarImage
                  src={user?.profileImage || ''}
                  className="rounded-full"
                />
                <AvatarFallback className="text-6xl font-bold bg-gray-200 text-gray-500">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              {/* Photo upload overlay */}
              <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={40} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="flex-1">
            <Card className="shadow-2xl rounded-3xl">
              <CardContent className="p-8 relative">
                {/* Settings / Edit Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-8 right-8 rounded-full"
                  onClick={() => setEditing(!editing)}
                >
                  <Settings size={24} className="text-gray-700" />
                </Button>

                {!editing ? (
                  <>
                    {/* Name & Location */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-gray-900">
                          {user?.name || 'Carregando...'}
                        </h1>
                      </div>
                      <p className="text-xl text-red-700 font-semibold capitalize">
                        {user?.role || 'Usuário'}
                      </p>
                      <p className="text-muted-foreground mt-1">{user?.email}</p>
                      {user?.phoneNumber && (
                        <p className="text-muted-foreground">{user.phoneNumber}</p>
                      )}
                    </div>

                    <Separator />

                    {/* Description Section */}
                    <div className="mt-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Descrição:
                      </h2>
                      <div className="bg-gray-50 rounded-2xl p-6 min-h-[150px]">
                        <p className="text-gray-500 text-lg">
                          {user?.bio || 'Nenhuma descrição adicionada ainda.'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Editar Perfil
                    </h2>
                    <ProfileForm />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setEditing(false);
                        fetchProfile();
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}