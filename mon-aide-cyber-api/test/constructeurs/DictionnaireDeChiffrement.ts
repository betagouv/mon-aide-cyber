export type Dictionnaire = Map<string, string>;

export interface DictionnaireDeChiffrement<T> {
  avec(objet: T): DictionnaireDeChiffrement<T>;

  construis(): Dictionnaire;
}
