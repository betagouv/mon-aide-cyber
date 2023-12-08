import { ValeursDesReponsesAuDiagnostic } from './MoteurDeValeur';
import { Indicateurs } from './Diagnostic';
import { PoidsPossible, Valeur, ValeurPossible } from './Valeur';

const estUnNombre = (
  valeur: PoidsPossible | ValeurPossible,
): valeur is number => !!valeur && typeof valeur === 'number';

export class MoteurDesIndicateurs {
  static genereLesIndicateurs(
    valeurs: ValeursDesReponsesAuDiagnostic,
  ): Indicateurs {
    return Object.entries(valeurs).reduce(
      (indicateurs, [thematique, valeurs]) => {
        indicateurs[thematique] = {
          moyennePonderee:
            this.calculeLaSommeDesProduitsDesValeurs(valeurs) /
            this.caluleLaSommeDesPoids(valeurs),
        };
        return indicateurs;
      },
      {} as unknown as Indicateurs,
    );
  }

  private static caluleLaSommeDesPoids(
    valeurs: { identifiant: string; valeur: Valeur }[],
  ) {
    return valeurs.reduce((sommeDesPoids, poidsCourant) => {
      const poids = poidsCourant.valeur.poids;
      if (estUnNombre(poids)) {
        return sommeDesPoids + poids;
      }
      return sommeDesPoids;
    }, 0);
  }

  private static calculeLaSommeDesProduitsDesValeurs(
    valeurs: { identifiant: string; valeur: Valeur }[],
  ) {
    return valeurs.reduce((sommeDesProduits, valeurCourante) => {
      const valeurTheorique = valeurCourante.valeur.theorique;
      const poids = valeurCourante.valeur.poids;
      if (estUnNombre(valeurTheorique) && estUnNombre(poids)) {
        return sommeDesProduits + valeurTheorique * poids;
      }
      return sommeDesProduits;
    }, 0);
  }
}
