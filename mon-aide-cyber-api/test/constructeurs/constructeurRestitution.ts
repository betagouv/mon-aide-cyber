import { Constructeur } from './constructeur';
import {
  InformationsRestitution,
  Restitution,
} from '../../src/restitution/Restitution';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import { RecommandationPriorisee } from '../../src/diagnostic/Diagnostic';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { add } from 'date-fns';

class ConstructeurRestitution implements Constructeur<Restitution> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private dateCreation: Date = fakerFR.date.anytime();
  private mesures: RecommandationPriorisee[] = [];
  private indicateurs = {};
  private informationsRestitution: InformationsRestitution = {
    dateCreation: this.dateCreation,
    dateDerniereModification: fakerFR.date.soon({
      days: 1,
      refDate: this.dateCreation,
    }),
    secteurActivite: fakerFR.commerce.department(),
    zoneGeographique: fakerFR.location.city(),
  };

  construis(): Restitution {
    return {
      identifiant: this.identifiant,
      informations: this.informationsRestitution,
      indicateurs: this.indicateurs,
      recommandations: {
        autresRecommandations: this.mesures.slice(6),
        recommandationsPrioritaires: this.mesures.slice(0, 6),
      },
    };
  }

  avecIndicateurs(
    thematique: string,
    moyenne: number,
  ): ConstructeurRestitution {
    this.indicateurs = {
      ...this.indicateurs,
      ...{ [thematique]: { moyennePonderee: moyenne } },
    };
    return this;
  }

  avecMesures(
    recommandations: RecommandationPriorisee[],
  ): ConstructeurRestitution {
    this.mesures = [...this.mesures, ...recommandations];
    return this;
  }

  avecIdentifiant(identifiant: crypto.UUID): ConstructeurRestitution {
    this.identifiant = identifiant;
    return this;
  }

  avecInformations(
    informationsRestitution: InformationsRestitution,
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
      zoneGeographique: this.zoneGeographique,
    };
  }

  avecSecteurActivite(
    secteurActivite: string,
  ): ConstructeurInformationsRestitution {
    this.secteurActivite = secteurActivite;
    return this;
  }

  avecZoneGeographique(
    zoneGeogprahique: string,
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
