import { Constructeur } from './constructeur';
import {
  DemandeDevenirAidant,
  EntiteDemande,
  StatutDemande,
} from '../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { Departement, gironde } from '../../src/gestion-demandes/departements';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';

class ConstructeurDemandeDevenirAidant
  implements Constructeur<DemandeDevenirAidant>
{
  private date: Date = FournisseurHorloge.maintenant();
  private departement: Departement = gironde;
  private identifiant: crypto.UUID = crypto.randomUUID();
  private mail: string = fakerFR.internet.email();
  private nom: string = fakerFR.person.lastName();
  private prenom: string = fakerFR.person.firstName();
  private statut: StatutDemande = StatutDemande.EN_COURS;
  private entite?: EntiteDemande = undefined;

  traitee(): ConstructeurDemandeDevenirAidant {
    this.statut = StatutDemande.TRAITEE;
    return this;
  }

  construis(): DemandeDevenirAidant {
    return {
      date: this.date,
      departement: this.departement,
      identifiant: this.identifiant,
      mail: this.mail,
      nom: this.nom,
      prenom: this.prenom,
      statut: this.statut,
      ...(this.entite && { entite: this.entite }),
    };
  }
}

export const uneDemandeDevenirAidant = () =>
  new ConstructeurDemandeDevenirAidant();
