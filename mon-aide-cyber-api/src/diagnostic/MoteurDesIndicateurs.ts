import { ValeursDesIndicesAuDiagnostic } from './MoteurIndice';
import { Indicateurs } from './Diagnostic';
import { Poids, Valeur } from './Indice';

type Indice = { identifiant: string; indice: Valeur; poids: Poids };

const estUnNombre = (valeur: Poids | Valeur): valeur is number =>
  (!!valeur || valeur === 0) && typeof valeur === 'number';

export class MoteurDesIndicateurs {
  static genereLesIndicateurs(
    valeurs: ValeursDesIndicesAuDiagnostic
  ): Indicateurs {
    return Object.entries(valeurs).reduce(
      (indicateurs, [thematique, indices]) => {
        indicateurs[thematique] = {
          moyennePonderee:
            this.calculeLaSommeDesProduitsDesIndices(indices) /
            this.calculeLaSommeDesPoids(indices),
        };
        return indicateurs;
      },
      {} as unknown as Indicateurs
    );
  }

  private static calculeLaSommeDesPoids(indices: Indice[]) {
    return indices.reduce((sommeDesPoids, indiceCourant) => {
      const poids = indiceCourant.poids;
      if (estUnNombre(poids)) {
        return sommeDesPoids + poids;
      }

      return sommeDesPoids;
    }, 0);
  }

  private static calculeLaSommeDesProduitsDesIndices(indices: Indice[]) {
    return indices.reduce((sommeDesProduits, indiceCourant) => {
      const indice = indiceCourant.indice;
      const poids = indiceCourant.poids;
      if (estUnNombre(indice) && estUnNombre(poids)) {
        return sommeDesProduits + indice * poids;
      }

      return sommeDesProduits;
    }, 0);
  }
}
