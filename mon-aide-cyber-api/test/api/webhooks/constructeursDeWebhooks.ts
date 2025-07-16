import { Constructeur } from '../../constructeurs/constructeur';
import {
  CorpsFinAtelierLivestorm,
  Field,
  ReponseTally,
} from '../../../src/api/webhooks/routesAPIWebhooks';
import { fakerFR } from '@faker-js/faker';

type Reponse = { label: string; value: string };

class ConstructeurDeReponseTally implements Constructeur<ReponseTally> {
  private dateCreation: Date = fakerFR.date.anytime();
  private nomFormulaire: string = fakerFR.lorem.word();
  private reponses: Field[] = [];

  creeLe(dateCreation: Date): ConstructeurDeReponseTally {
    this.dateCreation = dateCreation;
    return this;
  }

  avecUnNom(nomFormulaire: string): ConstructeurDeReponseTally {
    this.nomFormulaire = nomFormulaire;
    return this;
  }

  ajouteUneReponse(reponse: Reponse): ConstructeurDeReponseTally {
    this.reponses.push({ ...reponse, type: 'NUMBER' });
    return this;
  }

  ajouteUneReponseZoneDeTexteLibre(
    reponse: Reponse
  ): ConstructeurDeReponseTally {
    this.reponses.push({ ...reponse, type: 'TEXTAREA' });
    return this;
  }

  construis(): ReponseTally {
    return {
      createdAt: this.dateCreation.toISOString(),
      data: { fields: this.reponses, formName: this.nomFormulaire },
    };
  }
}

class ConstructeurDeFinAtelierLivestorm
  implements Constructeur<CorpsFinAtelierLivestorm>
{
  private participants: { email: string }[] = [];
  private dateDeCreation: Date = fakerFR.date.anytime();
  private titre: string = fakerFR.lorem.words(5);

  ajouteUnParticipant(email: string): ConstructeurDeFinAtelierLivestorm {
    this.participants.push({ email });
    return this;
  }
  creeLe(dateDeCreation: Date): ConstructeurDeFinAtelierLivestorm {
    this.dateDeCreation = dateDeCreation;
    return this;
  }

  avecUnTitre(titreAtelier: string): ConstructeurDeFinAtelierLivestorm {
    this.titre = titreAtelier;
    return this;
  }

  construis(): CorpsFinAtelierLivestorm {
    return {
      webinar: {
        attendees: this.participants,
        created_at: this.dateDeCreation.toISOString(),
        title: this.titre,
      },
    };
  }
}

export const unConstructeurDeReponseTally = (): ConstructeurDeReponseTally =>
  new ConstructeurDeReponseTally();

export const unConstructeurDeFinAtelierLivestorm =
  (): ConstructeurDeFinAtelierLivestorm =>
    new ConstructeurDeFinAtelierLivestorm();
