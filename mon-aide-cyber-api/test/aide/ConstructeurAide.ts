import { Constructeur } from '../constructeurs/constructeur';
import { Aide } from '../../src/aide/Aide';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { fakerFR } from '@faker-js/faker';

class ConstructeurAide implements Constructeur<Aide> {
  private dateSignatureCGU: Date = FournisseurHorloge.maintenant();
  construis(): Aide {
    return {
      identifiant: crypto.randomUUID(),
      dateSignatureCGU: this.dateSignatureCGU,
      email: fakerFR.internet.email(),
      raisonSociale: fakerFR.company.name(),
      departement: fakerFR.string.alpha({ length: { min: 1, max: 99 } }),
    };
  }

  avecUneDateDeSignatureDesCGU(dateSignatureCGU: Date): ConstructeurAide {
    this.dateSignatureCGU = dateSignatureCGU;
    return this;
  }
}

export const unAide = () => new ConstructeurAide();
