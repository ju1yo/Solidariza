"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "usuario",
  });

  async function submit(e: any) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
  }

  return (
    <div className="w-full h-screen flex">
      
      {/* LADO ESQUERDO */}
      <div className="w-1/2 bg-gradient-to-b from-red-400 to-red-600 text-white flex flex-col justify-center p-16">
        <h1 className="text-5xl font-bold mb-6">Seja Bem Vindo</h1>

        <p className="text-lg max-w-md mb-10">
          Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.
          Faça login ou cadastre-se para começar a ajudar!
        </p>

        <a
          href="/login"
          className="border-white border px-10 py-3 rounded-xl text-lg hover:bg-white hover:text-red-600 transition w-fit"
        >
          Fazer Login
        </a>
      </div>

      {/* LADO DIREITO — FORM */}
      <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-12">
        <h2 className="text-3xl font-bold text-red-500 mb-6">Criação de Conta</h2>

        {/* Ícones de login social */}
        <div className="flex gap-6 mb-6">
          <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
            <Image src="/google.svg" alt="Google" width={24} height={24} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
            <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
          </button>
        </div>

        <span className="text-gray-400 mb-4">Ou</span>

        {/* FORM */}
        <form 
          onSubmit={submit}
          className="w-full max-w-md flex flex-col gap-4"
        >
          <input
            className="w-full p-4 bg-white shadow rounded-xl"
            placeholder="Nome"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full p-4 bg-white shadow rounded-xl"
            placeholder="E-mail"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full p-4 bg-white shadow rounded-xl"
            placeholder="Senha"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            className="w-full p-4 bg-white shadow rounded-xl"
            placeholder="Confirmar Senha"
            type="password"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          {/* ROLE */}
          <select
            className="w-full p-4 bg-white shadow rounded-xl"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="usuario">Usuário</option>
            <option value="doador">Doador</option>
            <option value="receptor">Receptor</option>
            <option value="instituicao">Instituição</option>
          </select>

          {/* TERMOS */}
          <label className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" required />
            Termos e Condições do{" "}
            <span className="text-red-500 font-medium">Solidariza</span>
          </label>

          <button className="mt-4 bg-red-500 text-white p-4 rounded-xl text-lg hover:bg-red-600 transition">
            Próxima etapa
          </button>
        </form>
      </div>
    </div>
  );
}
