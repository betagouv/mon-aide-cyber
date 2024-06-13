import { Constructeur } from './constructeur';
import {
  InformationsRestitution,
  Restitution,
} from '../../src/restitution/Restitution';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import { MesurePriorisee } from '../../src/diagnostic/Diagnostic';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { add } from 'date-fns';

class ConstructeurRestitution implements Constructeur<Restitution> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private dateCreation: Date = fakerFR.date.anytime();
  private mesures: MesurePriorisee[] = [];
  private indicateurs = {};
  private informationsRestitution: InformationsRestitution = {
    dateCreation: this.dateCreation,
    dateDerniereModification: fakerFR.date.soon({
      days: 1,
      refDate: this.dateCreation,
    }),
    secteurActivite: fakerFR.commerce.department(),
    secteurGeographique: fakerFR.location.city(),
  };

  construis(): Restitution {
    return {
      identifiant: this.identifiant,
      informations: this.informationsRestitution,
      indicateurs: this.indicateurs,
      mesures: {
        autresMesures: this.mesures.slice(6),
        mesuresPrioritaires: this.mesures.slice(0, 6),
      },
    };
  }

  avecIndicateurs(
    thematique: string,
    moyenne: number
  ): ConstructeurRestitution {
    this.indicateurs = {
      ...this.indicateurs,
      ...{ [thematique]: { moyennePonderee: moyenne } },
    };
    return this;
  }

  avecMesures(mesures: MesurePriorisee[]): ConstructeurRestitution {
    this.mesures = [...this.mesures, ...mesures];
    return this;
  }

  avecIdentifiant(identifiant: crypto.UUID): ConstructeurRestitution {
    this.identifiant = identifiant;
    return this;
  }

  avecInformations(
    informationsRestitution: InformationsRestitution
  ): ConstructeurRestitution {
    this.informationsRestitution = informationsRestitution;
    return this;
  }
}

class ConstructeurInformationsRestitution
  implements Constructeur<InformationsRestitution>
{
  private dateCreation: Date = FournisseurHorloge.maintenant();
  private dateDerniereModification: Date = add(this.dateCreation, { days: 1 });
  private secteurActivite: string = fakerFR.commerce.department();
  private zoneGeographique: string = fakerFR.location.city();
  construis(): InformationsRestitution {
    return {
      dateCreation: this.dateCreation,
      dateDerniereModification: this.dateDerniereModification,
      secteurActivite: this.secteurActivite,
      secteurGeographique: this.zoneGeographique,
    };
  }

  avecSecteurActivite(
    secteurActivite: string
  ): ConstructeurInformationsRestitution {
    this.secteurActivite = secteurActivite;
    return this;
  }

  avecZoneGeographique(
    zoneGeogprahique: string
  ): ConstructeurInformationsRestitution {
    this.zoneGeographique = zoneGeogprahique;
    return this;
  }
}

export const uneRestitution = (): ConstructeurRestitution =>
  new ConstructeurRestitution();

export const desInformationsDeRestitution =
  (): ConstructeurInformationsRestitution =>
    new ConstructeurInformationsRestitution();
