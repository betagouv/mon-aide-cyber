import { fakerFR } from '@faker-js/faker';
import crypto from 'crypto';
import { Constructeur } from '../../constructeurs/constructeur';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { departements } from '../../../src/gestion-demandes/departements';

class ConstructeurDemandeAide implements Constructeur<DemandeAide> {
  private dateSignatureCGU: Date = FournisseurHorloge.maintenant();
  construis(): DemandeAide {
    return {
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
}

export const uneDemandeAide = () => new ConstructeurDemandeAide();
