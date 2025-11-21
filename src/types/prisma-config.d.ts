// Tipagem mínima para o subpath `prisma/config` usado em `prisma.config.ts`.
// Não é necessário instalar um pacote `prisma/config` — ele é provido
// pelo pacote `prisma` e usado pelo CLI. Esta declaração evita avisos
// do TypeScript/VSCode sobre módulo inexistente.

declare module "prisma/config" {
  // defineConfig é usado pelo arquivo prisma.config.ts
  export function defineConfig(config: any): any;
  // env helper retorna variáveis de ambiente
  export function env(name: string): string;
  const _default: any;
  export default _default;
}
