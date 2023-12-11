import { ValeursDesIndicesAuDiagnostic } from './MoteurIndice';
import { Indicateurs } from './Diagnostic';
import { Indice, Poids, Valeur } from './Indice';

const estUnNombre = (valeur: Poids | Valeur): valeur is number =>
  !!valeur && typeof valeur === 'number';

export class MoteurDesIndicateurs {
  static genereLesIndicateurs(
    valeurs: ValeursDesIndicesAuDiagnostic,
  ): Indicateurs {
    return Object.entries(valeurs).reduce(
      (indicateurs, [thematique, valeurs]) => {
        indicateurs[thematique] = {
          moyennePonderee:
            this.calculeLaSommeDesProduitsDesValeurs(valeurs) /
            this.calculeLaSommeDesPoids(valeurs),
        };
        return indicateurs;
      },
      {} as unknown as Indicateurs,
    );
  }

  private static calculeLaSommeDesPoids(
    valeurs: { identifiant: string; indice: Indice }[],
  ) {
    return valeurs.reduce((sommeDesPoids, poidsCourant) => {
      const poids = poidsCourant.indice.poids;
      if (estUnNombre(poids)) {
        return sommeDesPoids + poids;
      }

      if (estUnNombre(poidsCourant.indice.theorique)) {
        return sommeDesPoids + 1;
      }
      return sommeDesPoids;
    }, 0);
  }

  private static calculeLaSommeDesProduitsDesValeurs(
    valeurs: { identifiant: string; indice: Indice }[],
  ) {
    return valeurs.reduce((sommeDesProduits, valeurCourante) => {
      const valeurTheorique = valeurCourante.indice.theorique;
      const poids = valeurCourante.indice.poids;
      if (estUnNombre(valeurTheorique) && estUnNombre(poids)) {
        return sommeDesProduits + valeurTheorique * poids;
      }

      if (estUnNombre(valeurTheorique)) {
        return sommeDesProduits + valeurTheorique;
      }
      return sommeDesProduits;
    }, 0);
  }
}
