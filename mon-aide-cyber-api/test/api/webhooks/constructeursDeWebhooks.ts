import { Constructeur } from '../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { CorpsParticipantFinAtelierLivestorm } from '../../../src/api/webhooks/routesAPIWebhooks.livestorm';
import {
  Field,
  ReponseTally,
} from '../../../src/api/webhooks/routesAPIWebhooks.tally';

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

class ConstructeurDeParticipantFinAtelierLivestorm
  implements Constructeur<CorpsParticipantFinAtelierLivestorm>
{
  private type = 'people' as const;
  private fields: { id: string; value: string }[] = [];

  emailParticipant(
    email: string
  ): ConstructeurDeParticipantFinAtelierLivestorm {
    this.fields.push({ id: 'email', value: email });
    return this;
  }

  prenomParticipant(
    prenom: string
  ): ConstructeurDeParticipantFinAtelierLivestorm {
    this.fields.push({ id: 'first_name', value: prenom });
    return this;
  }

  nomParticipant(nom: string) {
    this.fields.push({ id: 'last_name', value: nom });
    return this;
  }

  construis(): CorpsParticipantFinAtelierLivestorm {
    return {
      data: {
        type: this.type,
        attributes: {
          registrant_details: {
            fields: this.fields,
          },
        },
      },
    };
  }
}

export const unConstructeurDeReponseTally = (): ConstructeurDeReponseTally =>
  new ConstructeurDeReponseTally();

export const unConstructeurDeParticipantFinAtelierLivestorm =
  (): ConstructeurDeParticipantFinAtelierLivestorm =>
    new ConstructeurDeParticipantFinAtelierLivestorm();
