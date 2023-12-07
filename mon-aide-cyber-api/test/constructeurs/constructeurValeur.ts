import { Constructeur } from './constructeur';
import { ValeursDesReponsesAuDiagnostic } from '../../src/diagnostic/MoteurDeValeur';
import { Valeur, ValeurPossible } from '../../src/diagnostic/Valeur';
import { fakerFR } from '@faker-js/faker';

class ConstructeurDesValeursDesReponsesAuDiagnostic
  implements Constructeur<ValeursDesReponsesAuDiagnostic>
{
  private thematiques: {
    [thematique: string]: { identifiant: string; valeur: Valeur }[];
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

  ajoute(
    valeur: Valeur | undefined,
  ): ConstructeurDesValeursDesReponsesAuDiagnostic {
    this.thematiques[this.thematiqueChoisie].push({
      identifiant: fakerFR.string.alpha(10),
      valeur,
    });
    return this;
  }

  construis(): ValeursDesReponsesAuDiagnostic {
    return this.thematiques;
  }
}

class ConstructeurDeValeur implements Constructeur<Valeur> {
  private valeur: Valeur = undefined;
  de(valeur: ValeurPossible): ConstructeurDeValeur {
    this.valeur = { theorique: valeur };
    return this;
  }

  construis(): Valeur {
    return this.valeur;
  }
}

export const desValeursDesReponsesAuDiagnostic = () =>
  new ConstructeurDesValeursDesReponsesAuDiagnostic();

export const uneValeur = () => new ConstructeurDeValeur();
