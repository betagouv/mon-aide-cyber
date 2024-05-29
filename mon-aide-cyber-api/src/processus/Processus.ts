type ParametresProcessus<T> = {
  enSucces: (resultat: T) => void;
  enErreur?: (message: string) => void;
};

export interface Processeur<T, V> {
  execute(
    donnees: V,
    enSucces: (resultat: T) => void,
    enErreur: (message: string) => void,
  ): void;
}

export class GestionnaireProcessus<T, V> {
  constructor(private readonly processeur: Processeur<T, V>) {}

  static initialise<T, V>(processeur: Processeur<T, V>) {
    return new GestionnaireProcessus(processeur);
  }

  async execute(parametres: ParametresProcessus<T>, donnees: V) {
    this.processeur.execute(
      donnees,
      (resultat: T) => parametres.enSucces(resultat),
      (message: string) => parametres.enErreur?.(message),
    );
  }
}
