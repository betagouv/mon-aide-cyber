import { Constructeur } from '../../constructeurs/constructeur';
import {
  DemandeDevenirAidant,
  EntiteDemande,
  StatutDemande,
} from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { UUID } from 'crypto';
import { departements } from '../../../src/gestion-demandes/departements';

class ConstructeurDemandeDevenirAidant
  implements Constructeur<DemandeDevenirAidant>
{
  private email: string = fakerFR.internet.email();
  private statut: StatutDemande = StatutDemande.EN_COURS;
  private entite: EntiteDemande | undefined = undefined;

  avecUnMail(email: string): ConstructeurDemandeDevenirAidant {
    this.email = email;
    return this;
  }

  traitee(): ConstructeurDemandeDevenirAidant {
    this.statut = StatutDemande.TRAITEE;
    return this;
  }

  avecUneEntite(
    type: 'ServicePublic' | 'ServiceEtat' | 'Association'
  ): ConstructeurDemandeDevenirAidant {
    this.entite = {
      nom: fakerFR.company.name(),
      siret: fakerFR.string.alpha(10),
      type: type,
    };
    return this;
  }

  pourUneDemandeEnAttenteAdhesion(): ConstructeurDemandeDevenirAidant {
    this.entite = {
      type: 'Association',
    };
    return this;
  }

  construis(): DemandeDevenirAidant {
    return {
      date: fakerFR.date.recent({
        days: 7,
        refDate: FournisseurHorloge.maintenant(),
      }),
      departement:
        departements[
          fakerFR.number.int({ min: 0, max: departements.length - 1 })
        ],
      identifiant: fakerFR.string.uuid() as UUID,
      mail: this.email,
      nom: fakerFR.person.lastName(),
      prenom: fakerFR.person.firstName(),
      statut: this.statut,
      ...(this.entite && { entite: this.entite }),
    };
  }
}

export const unConstructeurDeDemandeDevenirAidant = () =>
  new ConstructeurDemandeDevenirAidant();
