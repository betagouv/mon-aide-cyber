import { Constructeur } from '../constructeurs/constructeur';
import { Aide } from '../../src/aide/Aide';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { fakerFR } from '@faker-js/faker';

class ConstructeurAide implements Constructeur<Aide> {
  construis(): Aide {
    return {
      identifiant: crypto.randomUUID(),
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      email: fakerFR.internet.email(),
      raisonSociale: fakerFR.company.name(),
      departement: fakerFR.string.alpha({ length: { min: 1, max: 99 } }),
    };
  }
}

export const unAide = () => new ConstructeurAide();
