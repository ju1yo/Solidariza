# Solidariza: Uma Plataforma PWA para Conexão Social e Mitigação de Carências Coletivas em Manaus

**Resumo.** Este artigo apresenta o desenvolvimento da plataforma Solidariza, um Progressive Web App (PWA) projetado para otimizar o fluxo de doações e pedidos de ajuda humanitária na cidade de Manaus-AM. Utilizando tecnologias modernas como Next.js 14, Prisma e geolocalização em tempo real, o sistema resolve o problema da falta de visibilidade entre doadores e receptores. A arquitetura baseada em serviços e a gamificação por selos garantem uma rede escalável e engajada.

---

## 1. Introdução
A desigualdade social em grandes centros urbanos, como Manaus, gera bolsões de carência que muitas vezes não são alcançados por políticas públicas imediatas. A solidariedade orgânica, embora presente, carece de ferramentas tecnológicas que facilitem a logística e a confiança nas transações de ajuda. O **Solidariza** surge como uma ponte digital, permitindo que necessidades básicas sejam mapeadas e atendidas por voluntários e doadores locais.

## 2. Fundamentação Tecnológica e Arquitetura

### 2.1. Stack de Desenvolvimento
A escolha do triângulo **Next.js 14, Tailwind CSS e Prisma** permitiu um desenvolvimento ágil com tipagem estática (TypeScript) em todo o fluxo de dados. A utilização do App Router do Next.js possibilitou a implementação de Server Components para SEO e Client Components para interatividade avançada no Feed e Mapas.

### 2.2. Arquitetura de Software
O Solidariza adota uma infraestrutura de **Service Layer**, onde a lógica de persistência e regras de negócio são isoladas dos controladores de API. Isso facilita a manutenção e a possível migração para microserviços no futuro. Além disso, um **Contrato de Erro Global** foi implementado para garantir que falhas de validação ou segurança sejam reportadas de forma consistente ao usuário via Toasts automáticos.

---

## 3. Implementação e Funcionalidades Core

### 3.1. Geolocalização e Feed Interativo
O sistema utiliza **OpenStreetMap** para renderizar pedidos de ajuda em um mapa interativo. Isso permite que doadores visualizem urgências em seus bairros próximos, reduzindo custos de logística e aumentando a velocidade do atendimento.

### 3.2. Dashboard de Impacto e Gamificação
Para combater o desengajamento em redes de caridade, o Solidariza introduz:
- **Painéis de Métricas**: Visualização em tempo real das doações confirmadas.
- **Sistema de Badges**: Algoritmo que atribui selos de reputação a doadores frequentes, aumentando a confiabilidade da rede.

---

## 4. Resultados e Discussão
Testes preliminares demonstraram que a interface baseada em **Design Premium (Shadcn/UI)** e o suporte a **PWA** reduziram a fricção de entrada do usuário. A capacidade de instalação nativa no mobile, sem a necessidade de lojas de aplicativos, democratiza o acesso a usuários com conexões de internet limitadas.

## 5. Conclusão e Trabalhos Futuros
O Solidariza cumpre o papel de facilitador social tecnológico. Como passos futuros, planeja-se a integração com APIs de logística reversa e a implementação de Inteligência Artificial para sugestão proativa de doações baseada no perfil e localização do doador.

---

### Referências Sugeridas (Para preencher)
- Pressman, R. S. (2014). Engenharia de Software: Uma Abordagem Profissional.
- Next.js Documentation. (2024). Vercel.
- SBC (2024). Modelos de Publicação da Sociedade Brasileira de Computação.
