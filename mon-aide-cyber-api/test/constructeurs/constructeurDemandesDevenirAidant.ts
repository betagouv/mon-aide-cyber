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
import { TypeEntite } from '../../src/espace-aidant/Aidant';

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
  private entite: EntiteDemande = {
    type: 'Association',
    nom: fakerFR.company.name(),
    siret: fakerFR.string.numeric(10),
  };

  traitee(): ConstructeurDemandeDevenirAidant {
    this.statut = StatutDemande.TRAITEE;
    return this;
  }

  avecEntiteMorale(type: TypeEntite): ConstructeurDemandeDevenirAidant {
    this.entite = {
      type,
      nom: fakerFR.company.name(),
      siret: fakerFR.string.alpha(10),
    };
    return this;
  }

  pour(nom: string, prenom: string): ConstructeurDemandeDevenirAidant {
    this.nom = nom;
    this.prenom = prenom;
    return this;
  }

  ayantPourMail(email: string): ConstructeurDemandeDevenirAidant {
    this.mail = email;
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
