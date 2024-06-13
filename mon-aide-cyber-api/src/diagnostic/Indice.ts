export type Valeur = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null | undefined;
export type Poids = Omit<Valeur, 'null' | 'undefined'>;

export const laValeurEstDefinie = (
  valeur: number | null | undefined
): valeur is number => {
  return valeur !== null && valeur !== undefined;
};

export type Indice = {
  valeur: Valeur;
};
