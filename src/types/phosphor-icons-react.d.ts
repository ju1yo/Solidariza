// Declarações para `@phosphor-icons/react` permitindo props extras
// (útil para permitir `provider`, `onClick` direto no ícone, etc.)
// Nota: isso permite props arbitrárias nos IconProps — é uma solução prática
// para remover o erro de tipagem ao passar props customizadas aos ícones.

import * as React from "react";

declare module "@phosphor-icons/react" {
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    // permite quaisquer props adicionais (ex.: provider)
    [key: string]: any;
  }

  // Declaração genérica para ícones exportados (ex.: GoogleLogo, FacebookLogo)
  export const GoogleLogo: React.FC<IconProps>;
  export const FacebookLogo: React.FC<IconProps>;

  // Caso o pacote exporte outros ícones, o tipo acima cobrirá por Index Signature
  const _default: { [key: string]: React.FC<IconProps> };
  export default _default;
}
