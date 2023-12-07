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
    return valeurs.reduce((valeurPrecedente, valeurCourante) => {
      const poids = valeurCourante.valeur?.poids;
      if (estUnNombre(poids)) {
        return valeurPrecedente + poids;
      }
      if (estUnNombre(valeurCourante.valeur?.theorique)) {
        return valeurPrecedente + 1;
      }
      return valeurPrecedente;
    }, 0);
  }

  private static calculeLaSommeDesProduitsDesValeurs(
    valeurs: { identifiant: string; valeur: Valeur }[],
  ) {
    return valeurs.reduce((valeurPrecedente, valeurCourante) => {
      const valeurTheorique = valeurCourante.valeur?.theorique;
      const poids = valeurCourante.valeur?.poids;
      if (estUnNombre(valeurTheorique) && estUnNombre(poids)) {
        return valeurPrecedente + valeurTheorique * poids;
      }
      if (estUnNombre(valeurTheorique)) {
        return valeurPrecedente + valeurTheorique;
      }
      return valeurPrecedente;
    }, 0);
  }
}
