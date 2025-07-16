import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { unConstructeurDeReponseTally } from './constructeursDeWebhooks';
import {
  CorpsReponseTallyRecue,
  ReponseTallyRecue,
} from '../../../src/api/webhooks/routesAPIWebhooks.tally';

describe('Routes Webhooks Tally', () => {
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
          dateReponse: new Date(
            Date.parse('2025-06-20T10:00:00')
          ).toISOString(),
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

    it('Ne consigne pas les champs libre (TEXTAREA pour l’instant)', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/tally`,
        unConstructeurDeReponseTally()
          .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
          .avecUnNom('formulaire exemple')
          .ajouteUneReponse({ label: 'Nom', value: 'DUPONT' })
          .ajouteUneReponseZoneDeTexteLibre({
            label: 'Une saisie',
            value: 'Ma saisie libre',
          })
          .construis()
      );

      expect(reponse.statusCode).toBe(202);
      expect(
        (
          testeurMAC.busEvenement.evenementRecu
            ?.corps as unknown as CorpsReponseTallyRecue
        ).reponses
      ).toStrictEqual([
        {
          libelle: 'Nom',
          valeur: 'DUPONT',
        },
      ]);
    });
  });
});
