import { Constructeur } from '../../constructeurs/constructeur';
import {
  DemandeDevenirAidant,
  EntiteDemande,
  StatutDemande,
} from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { departements } from '../../../src/gestion-demandes/departements';

class ConstructeurDemandeDevenirAidant
  implements Constructeur<DemandeDevenirAidant>
{
  private email: string = fakerFR.internet.email();
  private statut: StatutDemande = StatutDemande.EN_COURS;
  private entite: EntiteDemande = {
    nom: fakerFR.company.name(),
    type: 'Association',
    siret: fakerFR.string.numeric(10),
  };
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private date: Date = fakerFR.date.recent({
    days: 7,
    refDate: FournisseurHorloge.maintenant(),
  });

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

  avecPourIdentifiant(
    identifiantDemande: crypto.UUID
  ): ConstructeurDemandeDevenirAidant {
    this.identifiant = identifiantDemande;
    return this;
  }

  enDate(date: Date): ConstructeurDemandeDevenirAidant {
    this.date = date;
    return this;
  }

  construis(): DemandeDevenirAidant {
    return {
      date: this.date,
      departement:
        departements[
          fakerFR.number.int({ min: 0, max: departements.length - 1 })
        ],
      identifiant: this.identifiant,
      mail: this.email,
      nom: fakerFR.person.lastName(),
      prenom: fakerFR.person.firstName(),
      statut: this.statut,
      entite: this.entite,
    };
  }
}

export const unConstructeurDeDemandeDevenirAidant = () =>
  new ConstructeurDemandeDevenirAidant();
