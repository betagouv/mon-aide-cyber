import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import {
  Field,
  ReponseTally,
  ReponseTallyRecue,
} from '../../../src/api/webhooks/routesAPIWebhooks';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { Constructeur } from '../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

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

  ajouteUneReponse(reponse: Field): ConstructeurDeReponseTally {
    this.reponses.push(reponse);
    return this;
  }

  construis(): ReponseTally {
    return {
      createdAt: this.dateCreation.toISOString(),
      data: { fields: this.reponses, formName: this.nomFormulaire },
    };
  }
}

const unConstructeurDeReponseTally = (): ConstructeurDeReponseTally => {
  return new ConstructeurDeReponseTally();
};

describe('Routes Webhooks', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe("Lorsqu'une requête POST est reçue sur /webhooks/tally", () => {
    it('Accepte la requête', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/tally`,
        unConstructeurDeReponseTally()
          .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
          .avecUnNom('formulaire exemple')
          .ajouteUneReponse({ label: 'Nom', value: 'DUPONT' })
          .construis()
      );

      expect(reponse.statusCode).toBe(202);
      expect(
        testeurMAC.busEvenement.evenementRecu
      ).toStrictEqual<ReponseTallyRecue>({
        corps: {
          dateReponse: FournisseurHorloge.enDate('2025-06-20T10:00:00'),
          nomFormulaire: 'formulaire exemple',
          reponses: [
            {
              libelle: 'Nom',
              valeur: 'DUPONT',
            },
          ],
        },
        identifiant: expect.any(String),
        type: 'REPONSE_TALLY_RECUE',
        date: FournisseurHorloge.maintenant(),
      });
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/tally`,
        unConstructeurDeReponseTally()
          .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
          .avecUnNom('formulaire exemple')
          .ajouteUneReponse({ label: 'Nom', value: 'DUPONT' })
          .construis()
      );

      expect(testeurMAC.adaptateurSignatureRequete.verifiePassage()).toBe(true);
    });
  });
});
