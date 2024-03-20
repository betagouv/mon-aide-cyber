export interface Constructeur<T> {
  construis(): T;
}

export abstract class ConstructeurDeTableau<T extends { [q: string]: any }> implements Constructeur<T> {
  protected tableau: T[] = [];

  construis(): T {
    let accumulateur = {};
    this.tableau.forEach((element) => {
      accumulateur = {
        ...accumulateur,
        ...Object.entries(element).reduce((accumulateur, [identifiant, valeur]) => {
          return { ...accumulateur, [identifiant]: valeur };
        }, {}),
      };
    });
    return accumulateur as T;
  }
}
