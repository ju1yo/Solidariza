export const HELP_TYPES = [
  "Cesta Básica",
  "Kit Higiene",
  "Kit Limpeza",
  "Roupas e Agasalhos",
  "Cobertores e Colchões",
  "Maternidade e Bebês",
  "Ração e Itens para Animais",
  "Móveis e Eletrodomésticos",
  "Apoio como Voluntário",
  "Outros",
] as const;

export type HelpType = (typeof HELP_TYPES)[number];
