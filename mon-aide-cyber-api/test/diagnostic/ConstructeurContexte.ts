import { Constructeur } from '../constructeurs/constructeur';
import { Contexte } from '../../src/diagnostic/ServiceDiagnostic';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';

class ConstructeurContexte implements Constructeur<Contexte> {
  private date: Date = FournisseurHorloge.maintenant();
  private departement?: string;
  private region?: string;
  private secteurActivite?: string;

  avecDateCreation(date: Date): ConstructeurContexte {
    this.date = date;

    return this;
  }

  avecLeDepartement(departement: string): ConstructeurContexte {
    this.departement = departement;

    return this;
  }

  enRegion(region: string): ConstructeurContexte {
    this.region = region;
    return this;
  }

  avecSecteurActivite(secteurActivite: string): ConstructeurContexte {
    this.secteurActivite = secteurActivite;

    return this;
  }

  construis(): Contexte {
    return {
      dateCreation: this.date,
      ...(this.departement && { departement: this.departement }),
      ...(this.region && { region: this.region }),
      ...(this.secteurActivite && { secteurActivite: this.secteurActivite }),
    } as Contexte;
  }
}

export const unContexteVide = () => new ConstructeurContexte();
export const unContexte = () => new ConstructeurContexte();
