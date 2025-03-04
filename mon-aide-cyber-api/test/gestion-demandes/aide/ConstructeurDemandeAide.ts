import { fakerFR } from '@faker-js/faker';
import crypto from 'crypto';
import { Constructeur } from '../../constructeurs/constructeur';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { departements } from '../../../src/gestion-demandes/departements';

class ConstructeurDemandeAide implements Constructeur<DemandeAide> {
  private dateSignatureCGU: Date = FournisseurHorloge.maintenant();
  private demandeIncomplete = false;

  construis(): DemandeAide {
    return this.demandeIncomplete
      ? ({ email: fakerFR.internet.email() } as DemandeAide)
      : {
          identifiant: crypto.randomUUID(),
          dateSignatureCGU: this.dateSignatureCGU,
          email: fakerFR.internet.email(),
          raisonSociale: fakerFR.company.name(),
          departement: departements[fakerFR.number.int({ min: 1, max: 99 })],
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
}

export const uneDemandeAide = () => new ConstructeurDemandeAide();
