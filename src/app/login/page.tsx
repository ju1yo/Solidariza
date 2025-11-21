"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      setError("Credenciais inválidas");
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

      <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-12">

        <h2 className="text-3xl font-bold text-blue-500 mb-6">Fazer Login</h2>

        {error && (
          <div className="mb-4 text-red-600 p-2 bg-red-100 rounded-lg w-full max-w-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="w-full max-w-md flex flex-col gap-4">
          <input
            className="w-full p-4 bg-white shadow rounded-xl"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full p-4 bg-white shadow rounded-xl"
            placeholder="Senha"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            className="mt-4 bg-blue-500 text-white p-4 rounded-xl text-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col justify-center p-16">
        <h1 className="text-5xl font-bold mb-6">Seja Bem Vindo</h1>

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