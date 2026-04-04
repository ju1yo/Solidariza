"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "usuario" | "doador" | "receptor" | "instituicao";
  category?: string;
  acceptTerms: boolean;
};

const CATEGORIES = [
  "Leite",
  "Alimentos",
  "Roupas",
  "Remédios",
  "Transporte",
  "Outros",
];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-600">
          Etapa {step} de 3
        </div>
        <div className="text-sm text-gray-400">
          {step === 1
            ? "Dados"
            : step === 2
            ? "Detalhes & Termos"
            : "Confirmação"}
        </div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-red-500 rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function RegisterWizard() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "usuario",
    category: undefined,
    acceptTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const update = useCallback((partial: Partial<FormState>) => {
    setError(null);
    setForm((s) => ({ ...s, ...partial }));
  }, []);

  const validateStep = useCallback(
    (currentStep = step) => {
      setError(null);
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (currentStep === 1) {
        if (!form.name.trim()) return setError("Informe seu nome.");
        if (!form.email.trim()) return setError("Informe um e-mail válido.");
        if (!emailRe.test(form.email)) return setError("E-mail inválido.");
        if (!form.password || form.password.length < 6)
          return setError("Senha deve ter pelo menos 6 caracteres.");
        if (form.password !== form.confirmPassword)
          return setError("Senhas não coincidem.");
      }

      if (currentStep === 2) {
        if (
          (form.role === "receptor" || form.role === "instituicao") &&
          !form.category
        )
          return setError("Escolha uma categoria de ajuda.");
        if (!form.acceptTerms)
          return setError("Você precisa aceitar os termos.");
      }

      return true;
    },
    [form, step]
  );

  const handleNext = useCallback(async () => {
    const ok = validateStep(step);
    if (ok !== true) return;
    setError(null);
    if (step < 3) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, validateStep, form]);

  const handleBack = useCallback(() => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        category: form.category,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.message || data?.error || "Erro ao criar conta.";
        setError(message);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/login");
    } catch (err) {
      setError("Erro de rede. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      {/* Left panel (Red) */}
      <div className="w-1/2 hidden md:flex bg-gradient-to-b from-red-400 to-red-600 text-white flex-col justify-center p-16">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-6">Seja Bem Vindo</h1>
          <p className="text-lg mb-10">
            Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado
            e esperança.
          </p>
          <Button
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white hover:text-red-600 px-8 py-6 rounded-xl text-lg"
            onClick={() => router.push("/login")}
          >
            Fazer Login
          </Button>
          <div className="mt-12 opacity-90">
            <Image
              src="/illustration-register.png"
              alt="illustration"
              width={300}
              height={200}
            />
          </div>
        </div>
      </div>

      {/* Right panel (Form) */}
      <div className="flex-1 flex items-start justify-center p-8 md:p-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 relative">
          <ProgressBar step={step} />

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Criação de Conta</h2>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="E-mail"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    value={form.password}
                    onChange={(e) => update({ password: e.target.value })}
                    placeholder="Senha"
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      update({ confirmPassword: e.target.value })
                    }
                    placeholder="Confirmar Senha"
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de perfil</Label>
                  <Select
                    value={form.role}
                    onValueChange={(val) =>
                      update({ role: val as FormState["role"] })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario">Usuário</SelectItem>
                      <SelectItem value="doador">Doador</SelectItem>
                      <SelectItem value="receptor">Receptor</SelectItem>
                      <SelectItem value="instituicao">Instituição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Detalhes</h2>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label>O que você está procurando?</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="action"
                        checked
                        readOnly
                        className="accent-red-500"
                      />
                      <span className="text-sm">Ajudar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="action" disabled />
                      <span className="text-sm text-gray-400">
                        Doar (em breve)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Que tipo de ajuda?</Label>
                  <Select
                    value={form.category || ""}
                    onValueChange={(val) => update({ category: val })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={form.acceptTerms}
                    onCheckedChange={(checked) =>
                      update({ acceptTerms: checked === true })
                    }
                    className="mt-1"
                  />
                  <div className="text-sm">
                    Eu aceito os termos e condições do{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="underline text-red-500"
                    >
                      Leia os Termos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Revise e confirme
              </h2>
              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <strong>Nome:</strong> {form.name}
                </div>
                <div>
                  <strong>E-mail:</strong> {form.email}
                </div>
                <div>
                  <strong>Perfil:</strong> {form.role}
                </div>
                <div>
                  <strong>Categoria:</strong> {form.category || "—"}
                </div>
                <div>
                  <strong>Termos aceitos:</strong>{" "}
                  {form.acceptTerms ? "Sim" : "Não"}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Ao confirmar, sua conta será criada e você será redirecionado
                para a tela de login.
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || loading}
            >
              Voltar
            </Button>

            <div className="flex items-center gap-3">
              {step < 3 && (
                <Button
                  variant="ghost"
                  className="text-sm text-gray-500"
                  onClick={() => setShowTermsModal(true)}
                >
                  Visualizar Termos
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow"
              >
                {loading
                  ? "Processando..."
                  : step < 3
                  ? "Próxima etapa"
                  : "Finalizar Cadastro"}
              </Button>
            </div>
          </div>

          {/* Terms Dialog */}
          <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>
                  Termos e Condições de Uso — Solidariza
                </DialogTitle>
              </DialogHeader>
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  Bem-vindo(a) ao Solidariza! Ao acessar e utilizar nosso site e
                  serviços, você concorda com os termos abaixo...
                </p>
                <p>1. Sobre o Solidariza: ...</p>
                <p>2. Cadastro e conta: ...</p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowTermsModal(false)}
                >
                  Fechar
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    update({ acceptTerms: true });
                    setShowTermsModal(false);
                  }}
                >
                  Aceitar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
