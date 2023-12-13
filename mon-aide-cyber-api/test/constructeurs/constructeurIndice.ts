import { Constructeur } from './constructeur';
import { ValeursDesIndicesAuDiagnostic } from '../../src/diagnostic/MoteurIndice';
import { Poids, Valeur } from '../../src/diagnostic/Indice';
import { fakerFR } from '@faker-js/faker';

type Indice = { identifiant: string; indice: Valeur; poids: Poids };

class ConstructeurDesValeursDesReponsesAuDiagnostic
  implements Constructeur<ValeursDesIndicesAuDiagnostic>
{
  private thematiques: {
    [thematique: string]: Indice[];
  } = {};
  private thematiqueChoisie = '';

  pourLaThematique(
    thematique: string,
  ): ConstructeurDesValeursDesReponsesAuDiagnostic {
    if (!this.thematiques[thematique]) {
      this.thematiques[thematique] = [];
    }
    this.thematiqueChoisie = thematique;
    return this;
  }

  ajoute(indice: Indice): ConstructeurDesValeursDesReponsesAuDiagnostic {
    this.thematiques[this.thematiqueChoisie].push({
      identifiant: fakerFR.string.alpha(10),
      indice: indice.indice,
      poids: indice.poids,
    });
    return this;
  }

  construis(): ValeursDesIndicesAuDiagnostic {
    return this.thematiques;
  }
}

class ConstructeurIndice implements Constructeur<Indice> {
  private indice: Indice = {
    identifiant: fakerFR.string.alpha(10),
    indice: 0,
    poids: 0,
  };

  de(valeur: Valeur): ConstructeurIndice {
    this.indice = {
      ...((this.indice &&
        this.indice.poids && {
          poids: this.indice.poids,
          identifiant: this.indice.identifiant,
        }) || { poids: 1, identifiant: this.indice.identifiant }),
      indice: valeur,
    };
    return this;
  }

  avecUnPoidsDe(poids: Poids): ConstructeurIndice {
    this.indice = {
      ...((this.indice && {
        indice: this.indice.indice,
        identifiant: this.indice.identifiant,
      }) || {
        indice: 0,
        identifiant: this.indice.identifiant,
      }),
      poids,
    };
    return this;
  }

  construis(): Indice {
    return this.indice;
  }
}

export const desValeursDesReponsesAuDiagnostic = () =>
  new ConstructeurDesValeursDesReponsesAuDiagnostic();

export const uneValeur = () => new ConstructeurIndice();
