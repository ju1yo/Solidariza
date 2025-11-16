"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
  }

  return (
    <div className="w-full h-screen flex">

      {/* ESQUERDA — LOGIN */}
      <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-12">
        <h2 className="text-3xl font-bold text-blue-500 mb-6">Fazer Login</h2>

        <div className="flex gap-6 mb-6">
          <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
            <Image src="/google.svg" alt="Google" width={24} height={24} />
          </button>

          <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
            <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
          </button>
        </div>

        <span className="text-gray-400 mb-4">Ou</span>

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

          <button className="mt-4 bg-blue-500 text-white p-4 rounded-xl text-lg hover:bg-blue-600 transition">
            Login
          </button>
        </form>
      </div>

      {/* DIREITA — TELA AZUL */}
      <div className="w-1/2 bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col justify-center p-16">
        <h1 className="text-5xl font-bold mb-6">Seja Bem Vindo</h1>

        <p className="text-lg max-w-md mb-10">
          Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.
          Faça login ou registre-se para começar a ajudar!
        </p>

        <a
          href="/register"
          className="border-white border px-10 py-3 rounded-xl text-lg hover:bg-white hover:text-blue-600 transition w-fit"
        >
          Fazer Registro
        </a>
      </div>
    </div>
  );
}
