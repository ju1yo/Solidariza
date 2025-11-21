"use client";

import { useState } from "react";
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

  return (
    <div className="w-full h-screen flex">
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

        <p className="text-lg max-w-md mb-10">
          Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.
          Faça login ou registre-se para começar a ajudar!
        </p>

        <a
          href="/resgister"
          className="border-white border px-10 py-3 rounded-xl text-lg hover:bg-white hover:text-blue-600 transition w-fit"
        >
          Fazer Registro
        </a>
      </div>
    </div>
  );
}