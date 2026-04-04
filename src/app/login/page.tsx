"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
    }

    setLoading(false);
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Login Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-700 mb-10 text-center">
            Fazer Login
          </h2>

          {/* Social Login Buttons */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <button
              type="button"
              disabled
              className="p-3 border border-gray-200 rounded-full opacity-50 cursor-not-allowed"
              title="Em breve"
            >
              <GoogleLogo width={28} height={28} color="#2a65e5" />
            </button>
            <button
              type="button"
              disabled
              className="p-3 border border-gray-200 rounded-full opacity-50 cursor-not-allowed"
              title="Em breve"
            >
              <FacebookLogo width={28} height={28} color="#2a65e5" />
            </button>
          </div>

          <p className="text-gray-500 text-center mb-8">Ou</p>

          {/* Error */}
          {error && (
            <div className="mb-6 text-red-700 p-3 bg-red-100 border border-red-300 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="w-full flex flex-col gap-6">
            <div className="relative">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <Input
                id="email"
                className="pl-12 py-6 rounded-xl"
                placeholder="Email"
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="sr-only">Senha</Label>
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <Input
                id="password"
                className="pl-12 py-6 rounded-xl"
                placeholder="Senha"
                type="password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 py-6 rounded-xl text-lg font-semibold bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-300/50"
            >
              {loading ? "Entrando..." : "Login"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side: Welcome (Blue Gradient) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex flex-col justify-center p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-8 right-16 flex items-center text-lg font-bold">
          <span className="text-white flex items-center gap-2">
            Solidariza
            <Image
              src="/logo_no_bg.png"
              alt="logo do sistema"
              width={25}
              height={25}
            />
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Seja Bem Vindo
          </h1>

          <p className="text-lg max-w-sm mb-10 opacity-90 leading-relaxed">
            Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado
            e esperança. Faça login ou cadastre-se para começar a ajudar!
          </p>

          <Button
            variant="outline"
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-700 px-10 py-6 rounded-xl text-lg font-semibold"
            onClick={() => router.push("/register")}
          >
            Fazer Registro
          </Button>
        </div>

        <div className="relative h-64 md:h-96 mt-8">
          <Image
            src="/illustration-login.png"
            alt="Ilustração de boas-vindas"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}