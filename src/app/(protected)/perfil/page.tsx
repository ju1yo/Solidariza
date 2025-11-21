'use client';

import React, { useState } from 'react';
import { MapPin, Settings } from 'lucide-react';

interface UserProfile {
  name: string;
  role: string;
  location: string;
  description: string;
  avatar: string;
}

export default function ProfilePage() {
  const [profile] = useState<UserProfile>({
    name: 'Bruno Marinho Souza',
    role: 'Colaborador (A)',
    location: 'Manaus',
    description: 'Descrição do Perfil',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-8 py-16">
        <div className="flex items-start gap-12 max-w-6xl mx-auto">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-96 h-96 rounded-full overflow-hidden border-8 border-gradient shadow-2xl">
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(239, 68, 68, 0.3) 100%)',
                  padding: '4px'
                }}></div>
                <img 
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #ef4444 100%)',
                padding: '4px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                zIndex: -1
              }}></div>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative">
              {/* Settings Button */}
              <button className="absolute top-8 right-8 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                <Settings size={24} className="text-gray-700" />
              </button>

              {/* Name and Location */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
                  <div className="flex items-center gap-2 text-blue-600">
                    <MapPin size={24} className="fill-blue-600" />
                    <span className="text-xl font-semibold">{profile.location}</span>
                  </div>
                </div>
                <p className="text-xl text-red-700 font-semibold">{profile.role}</p>
              </div>

              {/* Description Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição:</h2>
                <div className="bg-gray-50 rounded-2xl p-6 min-h-[200px]">
                  <p className="text-gray-500 text-lg">{profile.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}