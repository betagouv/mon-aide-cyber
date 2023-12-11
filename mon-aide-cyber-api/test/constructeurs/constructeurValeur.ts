import { Constructeur } from './constructeur';
import { ValeursDesIndicesAuDiagnostic } from '../../src/diagnostic/MoteurIndice';
import { Poids, Indice, Valeur } from '../../src/diagnostic/Indice';
import { fakerFR } from '@faker-js/faker';

class ConstructeurDesValeursDesReponsesAuDiagnostic
  implements Constructeur<ValeursDesIndicesAuDiagnostic>
{
  private thematiques: {
    [thematique: string]: { identifiant: string; indice: Indice }[];
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
      indice,
    });
    return this;
  }

  construis(): ValeursDesIndicesAuDiagnostic {
    return this.thematiques;
  }
}

class ConstructeurDeValeur implements Constructeur<Indice> {
  private indice: Indice = { theorique: 0, poids: 0 };

  de(valeur: Valeur): ConstructeurDeValeur {
    this.indice = {
      ...((this.indice &&
        this.indice.poids && { poids: this.indice.poids }) || { poids: 1 }),
      theorique: valeur,
    };
    return this;
  }

  avecUnPoidsDe(poids: Poids): ConstructeurDeValeur {
    this.indice = {
      ...((this.indice && { theorique: this.indice.theorique }) || {
        theorique: 0,
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

export const uneValeur = () => new ConstructeurDeValeur();
