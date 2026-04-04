# Documentação Técnica: Plataforma Solidariza

## 1. Visão Geral
O **Solidariza** é uma plataforma de impacto social desenvolvida para conectar doadores e pessoas em situação de necessidade, com foco inicial na cidade de Manaus, AM. A plataforma facilita o pedido de ajuda (alimentos, roupas, serviços) e permite que a comunidade responda de forma rápida e segura.

## 2. Stack Tecnológica
A aplicação utiliza tecnologias modernas para garantir performance, SEO e escalabilidade:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) com [Prisma ORM](https://www.prisma.io/)
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
- **E-mails Transacionais**: [Resend API](https://resend.com/)
- **Mapas**: [React-Leaflet](https://react-leaflet.js.org/) & [OpenStreetMap](https://www.openstreetmap.org/)
- **Notificações**: [React Hot Toast](https://react-hot-toast.com/) & Polling System
- **Mobilidade**: Configuração [PWA (Progressive Web App)](https://nextjs.org/docs/app/building-your-application/optimizing/pwa) para instalação nativa.

---

## 3. Arquitetura do Sistema

A aplicação segue princípios de **Clean Architecture** e **Separation of Concerns**:

### Camada de Serviços (Core/Services)
Toda a lógica de negócio está encapsulada em serviços (ex: `HelpRequestService`, `AdminService`), garantindo que as rotas da API apenas deleguem a execução e tratem a resposta.

### Contrato de Erro e Resposta
Implementamos um padrão global para todas as APIs:
- **ApiResponse<T>**: Estrutura fixa `{ success, data, error }`.
- **AppError**: Classe customizada que captura o código HTTP e o tipo do erro (ex: `UNAUTHORIZED`).
- **createHandler**: Wrapper que intercepta exceções e erros de validação (Zod) automaticamente.

### Frontend: useApi Hook
Um wrapper customizado do `fetch` que intercepta falhas e exibe automaticamente um **Toast de Erro**, simplificando a lógica nas páginas e melhorando a UX.

---

## 4. Modelagem de Dados (Schema Prisma)

Principais modelos do banco de dados:

- **User**: Gerenciamento de perfis (doadores, receptores e administradores).
- **HelpRequest**: Pedidos de ajuda com geolocalização (latitude/longitude), filtros por categoria e status.
- **Donation**: Registro de ofertas de ajuda vinculadas a um pedido.
- **Notification**: Sistema de alertas em tempo real.
- **Rating & Comment**: Sistema de reputação e interação social.
- **Conversation & Message**: Chat integrado para combinar detalhes da entrega.

---

## 5. Funcionalidades de Destaque

### Dashboard de Impacto
Visualização de métricas (doações realizadas, vidas impactadas) utilizando **Recharts**, permitindo que administradores e usuários vejam o progresso da rede.

### Geolocalização em Tempo Real
Integração com mapas para que doadores encontrem pedidos próximos à sua localização em Manaus, utilizando pins interativos.

### Gamificação (Badges)
Usuários ganham selos (ex: "Doador Prata", "Iniciante Solidário") baseados no número de doações confirmadas, incentivando a participação contínua.

### Sistema de Moderação
Painel administrativo completo para aprovação de usuários, gestão de pedidos e monitoramento de atividades suspeitas.

---

## 6. Guia de Manutenção e Extensão

### Adicionando Nova Rota de API
Utilize o `createHandler`:
```typescript
export const POST = createHandler(async (req) => {
  // Lógica aqui
  return { status: "success" };
});
```

### Adicionando Novo Componente UI
Sempre utilize o diretório `@/components/ui/` e siga o padrão do Shadcn/UI para manter a consistência do Design System.

---
**© 2026 Solidariza Team. Todos os direitos reservados.**
