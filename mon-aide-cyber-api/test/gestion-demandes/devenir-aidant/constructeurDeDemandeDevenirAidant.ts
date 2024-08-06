import { Constructeur } from '../../constructeurs/constructeur';
import { DemandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { UUID } from 'crypto';
import { departements } from '../../../src/gestion-demandes/departements';

class ConstructeurDemandeDevenirAidant
  implements Constructeur<DemandeDevenirAidant>
{
  private email: string = fakerFR.internet.email();

  avecUnMail(email: string): ConstructeurDemandeDevenirAidant {
    this.email = email;
    return this;
  }

  construis(): DemandeDevenirAidant {
    return {
      date: FournisseurHorloge.maintenant(),
      departement:
        departements[
          fakerFR.number.int({ min: 0, max: departements.length - 1 })
        ],
      identifiant: fakerFR.string.uuid() as UUID,
      mail: this.email,
      nom: fakerFR.person.lastName(),
      prenom: fakerFR.person.firstName(),
    };
  }
}

export const unConstructeurDeDemandeDevenirAidant = () =>
  new ConstructeurDemandeDevenirAidant();
