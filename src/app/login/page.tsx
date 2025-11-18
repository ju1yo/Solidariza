"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react"; // Usando ícones Lucide para Email/Senha/Botões
import {GoogleLogo, FacebookLogo} from "@phosphor-icons/react";
// Componente para o botão de login social (Google e Facebook)
const SocialLoginButton = ({ icon: Icon, provider, className, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-3 border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition ${className}`}
    aria-label={`Login with ${provider}`}
  >
    <Icon className="w-6 h-6 text-gray-600" />
  </button>
);

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
      return;
    }

    router.push("/dashboard");
  }

  // Função fictícia para login social, você deve implementar a lógica real
  const handleSocialLogin = (provider: string) => {
    // Ex: signIn(provider);
    alert(`Tentativa de Login com ${provider}. Implementar lógica real.`);
  };

  return (
    <div className="w-full h-screen flex">
      {/* ==================================================
        Lado Esquerdo: Formulário de Login (Branco/Cinza)
        ==================================================
      */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md">
          {/* Título de Login */}
          <h2 className="text-3xl font-bold text-gray-700 mb-10 text-center">
            Fazer Login
          </h2>

          {/* Botões de Login Social (Google e Facebook) */}
          <div className="flex justify-center items-center gap-6 mb-8">
            
            <GoogleLogo provider="Google" width={35} height={35} color="#2a65e5" onClick={() => handleSocialLogin("google")} className="bg-white" />
         
            <FacebookLogo provider="Facebook" width={35} height={35} color="#2a65e5" onClick={() => handleSocialLogin("facebook")} className="bg-white" />
          </div>

          {/* Separador "Ou" */}
          <p className="text-gray-500 text-center mb-8">Ou</p>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 text-red-700 p-3 bg-red-100 border border-red-300 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="w-full flex flex-col gap-6">
            {/* Campo Email */}
            <div className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-sm">
              <Mail className="w-5 h-5 text-gray-500 absolute left-4" />
              <input
                className="w-full p-4 pl-12 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Email"
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-sm">
              <Lock className="w-5 h-5 text-gray-500 absolute left-4" />
              <input
                className="w-full p-4 pl-12 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Senha"
                type="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Botão Login */}
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-4 rounded-xl text-lg font-semibold shadow-lg shadow-blue-300/50 hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* ==================================================
        Lado Direito: Seção de Boas-Vindas (Azul Gradiente)
        ==================================================
      */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex flex-col justify-center p-16 relative overflow-hidden">
        {/* Logo/Marca no canto superior direito (Fictício) */}
        <div className="absolute top-8 right-16 flex items-center text-lg font-bold">
          {/* Ajuste o src/alt conforme sua imagem de logo/ícone */}
          <span className="text-white">Solidariza <Image src="/logo_no_bg.png" alt="logo do sistema" width={25} height={25}></Image></span> 
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 center">
          <h1 className="text-5xl font-extrabold mb-6">Seja Bem Vindo</h1>

          <p className="text-lg max-w-sm mb-10 opacity-90 leading-relaxed">
            Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.
            Faça login ou cadastre-se para começar a ajudar!
          </p>

          <a
            href="/register"
            className="border-2 border-white px-10 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-700 transition duration-200 ease-in-out w-fit shadow-md"
          >
            Fazer Registro
          </a>
        </div>
        
     
        <div className="relative h-screen inset-20 w-2/9">
          
          <Image 
            src="/illustration-login.png" 
            alt="Ilustração de boas-vindas" 
            layout="fill"
            objectFit="contain" // Ajuste conforme a necessidade
        
          />
        </div>
      </div>
    </div>
  );
}