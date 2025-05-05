import { fakerFR } from '@faker-js/faker';
import crypto from 'crypto';
import { Constructeur } from '../../constructeurs/constructeur';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  Departement,
  departements,
} from '../../../src/gestion-demandes/departements';

class ConstructeurDemandeAide implements Constructeur<DemandeAide> {
  private dateSignatureCGU: Date = FournisseurHorloge.maintenant();
  private demandeIncomplete = false;
  private email: string = fakerFR.internet.email();
  private departement: Departement =
    departements[fakerFR.number.int({ min: 1, max: 99 })];

  construis(): DemandeAide {
    return this.demandeIncomplete
      ? ({ email: fakerFR.internet.email() } as DemandeAide)
      : {
          identifiant: crypto.randomUUID(),
          dateSignatureCGU: this.dateSignatureCGU,
          email: this.email,
          raisonSociale: fakerFR.company.name(),
          departement: this.departement,
        };
  }

  avecUneDateDeSignatureDesCGU(
    dateSignatureCGU: Date
  ): ConstructeurDemandeAide {
    this.dateSignatureCGU = dateSignatureCGU;
    return this;
  }

  incomplete(): ConstructeurDemandeAide {
    this.demandeIncomplete = true;
    return this;
  }

  avecUnEmail(email: string): ConstructeurDemandeAide {
    this.email = email;
    return this;
  }

  dansLeDepartement(departement: Departement): ConstructeurDemandeAide {
    this.departement = departement;
    return this;
  }
}

export const uneDemandeAide = () => new ConstructeurDemandeAide();
