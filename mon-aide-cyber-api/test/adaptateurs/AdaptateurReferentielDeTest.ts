import { Referentiel } from '../../src/diagnostic/Referentiel';
import { Adaptateur } from '../../src/adaptateurs/Adaptateur';

export class AdaptateurReferentielDeTest implements Adaptateur<Referentiel> {
  private referentiel: Referentiel | undefined = undefined;

  lis(): Promise<Referentiel> {
    return this.referentiel !== undefined
      ? Promise.resolve(this.referentiel)
      : Promise.reject(new Error('Referentiel non connu'));
  }

  ajoute(referentiel: Referentiel) {
    this.referentiel = referentiel;
  }

  reInitialise() {
    this.referentiel = undefined;
  }
}
