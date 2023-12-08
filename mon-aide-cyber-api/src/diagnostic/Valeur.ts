export type ValeurPossible = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null | undefined;
export type PoidsPossible = Omit<ValeurPossible, 'null' | 'undefined'>;

export type Valeur = {
  theorique: ValeurPossible;
  poids?: PoidsPossible;
};
