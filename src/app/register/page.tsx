"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        <div className="text-sm font-medium text-gray-600">Etapa {step} de 3</div>
        <div className="text-sm text-gray-400">{step === 1 ? "Dados" : step === 2 ? "Detalhes & Termos" : "Confirmação"}</div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="h-2 bg-red-500 rounded-full" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
    </div>
  );
}

function TermsModal({ open, accept, onClose, onAccept }: { open: boolean; accept: boolean; onClose: () => void; onAccept: () => void; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto relative">
        <h3 className="text-xl font-bold mb-4">Termos e Condições de Uso – Solidariza</h3>
        <div className="text-sm text-gray-700 space-y-3 mb-4">
          <p>Bem-vindo(a) ao Solidariza! Ao acessar e utilizar nosso site e serviços, você concorda com os termos abaixo...</p>
          <p>1. Sobre o Solidariza: ...</p>
          <p>2. Cadastro e conta: ...</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={accept} readOnly />
            <span className="text-sm">Aceito os termos</span>
          </label>

          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded border">Fechar</button>
            <button onClick={onAccept} className="px-4 py-2 rounded bg-red-500 text-white">Aceitar</button>
          </div>
        </div>
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
    // ao editar, limpar mensagens globais de erro para não mostrar mensagens
    // antigas enquanto o usuário corrige os campos
    setError(null);
    setForm((s) => ({ ...s, ...partial }));
  }, []);

  const validateStep = useCallback((currentStep = step) => {
    setError(null);
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (currentStep === 1) {
      if (!form.name.trim()) return setError("Informe seu nome.");
      if (!form.email.trim()) return setError("Informe um e-mail válido.");
      if (!emailRe.test(form.email)) return setError("E-mail inválido.");
      if (!form.password || form.password.length < 6) return setError("Senha deve ter pelo menos 6 caracteres.");
      if (form.password !== form.confirmPassword) return setError("Senhas não coincidem.");
    }

    if (currentStep === 2) {
      if ((form.role === "receptor" || form.role === "instituicao") && !form.category) return setError("Escolha uma categoria de ajuda.");
      if (!form.acceptTerms) return setError("Você precisa aceitar os termos.");
    }

    return true;
  }, [form, step]);

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
        // read message (server uses `message`) or `error` if present
        const message = data?.message || data?.error || "Erro ao criar conta.";
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
      <div className="w-1/2 hidden md:flex bg-gradient-to-b from-red-400 to-red-600 text-white flex-col justify-center p-16">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-6">Seja Bem Vindo</h1>
          <p className="text-lg mb-10">Junte-se ao Solidariza e faça parte de uma rede que espalha cuidado e esperança.</p>
          <a href="/login" className="inline-block border-white border px-8 py-3 rounded-xl text-lg hover:bg-white hover:text-red-600 transition">Fazer Login</a>
          <div className="mt-12 opacity-90">
            <Image src="/illustration-register.png" alt="illustration" width={300} height={200} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 relative">
          <ProgressBar step={step} />

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Criação de Conta</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="sr-only" htmlFor="name">Nome</label>
                  <input id="name" value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Nome" className="p-4 bg-gray-50 rounded-lg shadow-sm border w-full" />
                </div>

                <div>
                  <label className="sr-only" htmlFor="email">E-mail</label>
                  <input id="email" value={form.email} onChange={(e) => update({ email: e.target.value })} placeholder="E-mail" className="p-4 bg-gray-50 rounded-lg shadow-sm border w-full" />
                </div>

                <div>
                  <label className="sr-only" htmlFor="password">Senha</label>
                  <input id="password" value={form.password} onChange={(e) => update({ password: e.target.value })} placeholder="Senha" type="password" className="p-4 bg-gray-50 rounded-lg shadow-sm border w-full" />
                </div>

                <div>
                  <label className="sr-only" htmlFor="confirmPassword">Confirmar Senha</label>
                  <input id="confirmPassword" value={form.confirmPassword} onChange={(e) => update({ confirmPassword: e.target.value })} placeholder="Confirmar Senha" type="password" className="p-4 bg-gray-50 rounded-lg shadow-sm border w-full" />
                </div>

                <div>
                  <label className="text-sm text-gray-600" htmlFor="role">Tipo de perfil</label>
                  <select id="role" value={form.role} onChange={(e) => update({ role: e.target.value as FormState["role"] })} className="w-full p-3 bg-gray-50 rounded-lg mt-2 border">
                    <option value="usuario">Usuário</option>
                    <option value="doador">Doador</option>
                    <option value="receptor">Receptor</option>
                    <option value="instituicao">Instituição</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Detalhes</h2>
              <div className="flex flex-col gap-4 mb-2">
                <label className="text-sm text-gray-600">O que você está procurando?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="action" checked readOnly />
                    <span className="text-sm">Ajudar</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="action" disabled />
                    <span className="text-sm text-gray-400">Doar (em breve)</span>
                  </label>
                </div>

                <div>
                  <label className="text-sm text-gray-600" htmlFor="category">Que tipo de ajuda?</label>
                  <select id="category" value={form.category || ""} onChange={(e) => update({ category: e.target.value })} className="w-full p-3 bg-gray-50 rounded-lg mt-2 border shadow-sm">
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-start gap-3">
                  <input id="acceptTerms" type="checkbox" checked={form.acceptTerms} onChange={(e) => update({ acceptTerms: e.target.checked })} className="mt-1" />
                  <div className="text-sm">Eu aceito os termos e condições do <button type="button" onClick={() => setShowTermsModal(true)} className="underline text-red-500">Leia os Termos</button></div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Revise e confirme</h2>
              <div className="space-y-3 mb-6">
                <div><strong>Nome:</strong> {form.name}</div>
                <div><strong>E-mail:</strong> {form.email}</div>
                <div><strong>Perfil:</strong> {form.role}</div>
                <div><strong>Categoria:</strong> {form.category || "—"}</div>
                <div><strong>Termos aceitos:</strong> {form.acceptTerms ? "Sim" : "Não"}</div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Ao confirmar, sua conta será criada e você será redirecionado para a tela de login.</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button onClick={handleBack} disabled={step === 1 || loading} type="button" className="px-4 py-2 rounded-md border text-gray-700 disabled:opacity-50">Voltar</button>

            <div className="flex items-center gap-3">
              {step < 3 && (
                <button onClick={() => setShowTermsModal(true)} type="button" className="px-4 py-2 rounded-md text-sm text-gray-500">Visualizar Termos</button>
              )}

              <button onClick={handleNext} type="button" disabled={loading} className="px-6 py-3 rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50">
                {loading ? "Processando..." : step < 3 ? "Próxima etapa" : "Finalizar Cadastro"}
              </button>
            </div>
          </div>

          <TermsModal open={showTermsModal} accept={form.acceptTerms} onClose={() => setShowTermsModal(false)} onAccept={() => { update({ acceptTerms: true }); setShowTermsModal(false); }} />
        </div>
      </div>
    </div>
  );
}
