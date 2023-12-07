import { ValeursDesReponsesAuDiagnostic } from './MoteurDeValeur';
import { Indicateurs } from './Diagnostic';

export class MoteurDesIndicateurs {
  static genereLesIndicateurs(
    valeurs: ValeursDesReponsesAuDiagnostic,
  ): Indicateurs {
    return Object.entries(valeurs).reduce(
      (indicateurs, [thematique, valeurs]) => {
        indicateurs[thematique] = {
          moyennePonderee:
            valeurs.reduce((valeurPrecedente, valeurCourante) => {
              if (valeurCourante.valeur?.theorique) {
                return valeurPrecedente + valeurCourante.valeur.theorique || 0;
              }
              return valeurPrecedente;
            }, 0) /
            valeurs.filter(
              (valeur) => valeur && valeur.valeur && valeur.valeur.theorique,
            ).length,
        };
        return indicateurs;
      },
      {} as unknown as Indicateurs,
    );
  }
}
