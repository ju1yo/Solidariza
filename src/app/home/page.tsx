"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Função de redirecionamento segura
  const handleRedirect = (pathIfLoggedIn: string) => {
    if (status === "authenticated") {
      router.push(pathIfLoggedIn);
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="w-full flex flex-col items-center text-[#1a1a1a]">

      {/* --- AJUDA SECTION --- */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 py-20 px-4 md:px-0 gap-10">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-loose">
            Doe, ajude, compartilhe, <br />
            faça a diferença com o <br />
            <span className="especial-gradient">Solidariza</span>
          </h1>

          <p className="mt-5 text-xl font-semibold text-black max-w-md">
            O Solidariza conecta pessoas que querem ajudar com causas que realmente importam.
            Faça parte dessa corrente do bem.
          </p>

          <div>
            <button
              className="btn-home"
              onClick={() => handleRedirect("/solicitacoes")}
            >
              Quero ajudar!
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img src="/doe-image.png" alt="Doação" className="w-full max-w-md" />
        </div>
      </section>

      {/* --- SEÇÃO PRINCIPAL --- */}
      <section className="w-full max-w-6xl text-center px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          Na Solidariza, você faz a <span className="especial-gradient">Diferença.</span>
        </h2>

        <p className="mt-5 text-black font-semibold max-w-xl mx-auto">
          Se você precisa de ajuda ou quer oferecer um apoio, aqui é o lugar certo.
          Escolha como deseja participar e juntos vamos construir uma rede de
          solidariedade que transforma vidas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          {/* Card Ajuda */}
          <div className="bg-[#114A70] shadow-md rounded-xl overflow-hidden">
            <img src="/ajuda-image.png" alt="Ajudar" className="w-full" />
            <div className="p-6">
              <p className="mt-5 text-sm text-white font-semibold">
                Você pode ser a <span className="especial-gradient">Esperança</span> de alguém! Doe seu tempo,
                alimentos ou um simples gesto de carinho. Ao oferecer ajuda, você constrói um mundo mais
                humano e solidário. Clique e faça parte dessa transformação.
              </p>

              <button
                className="btn-home"
                onClick={() => handleRedirect("/solicitacoes")}
              >
                Quero ajudar!
              </button>
            </div>
          </div>

          {/* Card Pedir Ajuda */}
          <div className="bg-[#81000B] shadow-md rounded-xl overflow-hidden">
            <img src="/pedir-image.png" alt="Pedir Ajuda" className="w-full" />
            <div className="p-6">
              <p className="mt-5 text-sm text-white font-semibold">
                Está passando por um momento difícil? Você não está sozinho.
                Aqui, você encontra pessoas dispostas a te apoiar com respeito,
                cuidado e <span className="especial-gradient">Solidariedade.</span>
                Clique e encontre a ajuda que você precisa.
              </p>

              <button
                className="btn-home"
                onClick={() => handleRedirect("/solicitacoes")}
              >
                Preciso de ajuda!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- PEDIDOS DE AJUDA --- */}
      <section className="w-full max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Seja a mudança. Veja os pedidos e espalhe <br />
          <span className="especial-gradient">Solidariedade!</span>
        </h2>

        <div className="text-right w-full max-w-6xl">
          <button
            className="font-bold flex items-center gap-1 ml-auto"
            onClick={() => handleRedirect("/solicitacoes")}
          >
            Veja todos os Pedidos de ajuda <img src="/arrow-circle-icon.png" alt="icone-seta" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`shadow-md rounded-xl overflow-hidden ${
                i % 2 === 0 ? "bg-[#FF4C5B]" : "bg-[#5DADE2]"
              }`}
            >
              <img src="/pedido-image.png" alt="Pedido" className="w-full h-60 object-cover" />

              <div className="p-5 text-left text-white">
                <h4 className="font-bold text-lg">Ajudar Hospital João Lúcio</h4>

                <p className="mt-2 text-white">
                  Dona Maria, mãe de 3 crianças, está precisando de apoio para
                  alimentação básica neste mês.
                </p>

                <p className="mt-3 font-bold text-lg">Itens Necessários:</p>
                <ul className="text-white ml-2">
                  <li className="list-icon">Arroz</li>
                  <li className="list-icon">Feijão</li>
                  <li className="list-icon">Leite</li>
                </ul>

                <p className="mt-3 font-bold text-lg">Localização:</p>
                <p className="text-white">
                  Comunidade Nova Esperança, Rua das Flores, nº 120
                </p>

                <p className="mt-3 font-bold text-lg">Tipo de ajuda:</p>
                <p className="text-black font-bold">Doação de alimentos</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#7A000A] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 items-center">
          <div className="flex flex-col gap-5 items-start">
            <div className="flex items-start gap-3">
              <img src="/icon-footer.png" alt="Logo Solidariza" className="w-8 h-8" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl">SOLIDARIZA</span>
                <span className="text-[10px] font-semibold">APOIO SOLIDÁRIO</span>
              </div>
            </div>

            <p className="text-[10px] text-[#5DADE2] leading-tight mt-1 max-w-[170px]">
              Aqui você não está só!
              <br />
              No Solidariza conectamos você com doadores
              <br />
              e possibilitamos você ajudar pessoas.
            </p>
          </div>

          <div className="flex flex-col items-center mt-6 md:mt-0 md:col-span-2">
            <div className="w-full max-w-[300px] h-px bg-white opacity-40 mb-4" />
            <p className="text-[10px] font-semibold tracking-wide text-center">
              © SOLIDARIZA | TODOS OS DIREITOS RESERVADOS
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
