import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import { executeRequete } from '../executeurRequete';
import { unConstructeurDeParticipantFinAtelierLivestorm } from './constructeursDeWebhooks';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { AdaptateurSignatureRequeteDeTest } from '../../adaptateurs/AdaptateurSignatureRequeteDeTest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';

describe('Route Webhook livestorm', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurSignatureRequete =
      new AdaptateurSignatureRequeteDeTest();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe("Lorsqu'une requête POST est reçue sur /webhooks/livestorm/activation-compte-aidant", () => {
    it('active le compte Aidant', async () => {
      adaptateurEnvironnement.webinaires = () => ({
        livestorm: () => ({
          idEvenementAteliersDevenirAidant: '12345',
        }),
      });
      const demandeDevenirAidant = uneDemandeDevenirAidant()
        .ayantPourMail('jean.dupont@email.com')
        .construis();
      await testeurMAC.entrepots
        .demandesDevenirAidant()
        .persiste(demandeDevenirAidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/livestorm/activation-compte-aidant`,
        unConstructeurDeParticipantFinAtelierLivestorm()
          .emailParticipant('jean.dupont@email.com')
          .construis()
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        await testeurMAC.entrepots
          .aidants()
          .rechercheParEmail('jean.dupont@email.com')
      ).toBeDefined();
    });

    it('active le compte Aidant avec l‘email du participant', async () => {
      adaptateurEnvironnement.webinaires = () => ({
        livestorm: () => ({
          idEvenementAteliersDevenirAidant: '12345',
        }),
      });
      const demandeDevenirAidant = uneDemandeDevenirAidant()
        .ayantPourMail('jean.dupont@email.com')
        .construis();
      await testeurMAC.entrepots
        .demandesDevenirAidant()
        .persiste(demandeDevenirAidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/livestorm/activation-compte-aidant`,
        unConstructeurDeParticipantFinAtelierLivestorm()
          .prenomParticipant('Jean')
          .nomParticipant('Dupont')
          .emailParticipant('jean.dupont@email.com')
          .construis()
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        await testeurMAC.entrepots
          .aidants()
          .rechercheParEmail('jean.dupont@email.com')
      ).toBeDefined();
    });

    it('renvoie une réponse HTTP 204 si la requête Livestorm n‘est pas du type "people" (correspond à l‘événement people.attended)', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/livestorm/activation-compte-aidant`,
        {
          data: {
            ...unConstructeurDeParticipantFinAtelierLivestorm().construis()
              .data,
            type: 'session',
          },
        }
      );

      expect(reponse.statusCode).toBe(204);
    });

    it('renvoie une réponse HTTP 204 si la requête Livestorm ne comporte pas un bon event_id (correspond à l‘événement people.attended)', async () => {
      adaptateurEnvironnement.webinaires = () => ({
        livestorm: () => ({
          idEvenementAteliersDevenirAidant: '12345',
        }),
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/livestorm/activation-compte-aidant`,
        unConstructeurDeParticipantFinAtelierLivestorm()
          .pourUnIdEvenement('faux_id')
          .construis()
      );

      expect(reponse.statusCode).toBe(204);
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/webhooks/livestorm/activation-compte-aidant`,
        unConstructeurDeParticipantFinAtelierLivestorm()
          .emailParticipant('jean.dupont@email.com')
          .construis()
      );

      expect(
        testeurMAC.adaptateurSignatureRequete.verifiePassage('LIVESTORM')
      ).toBe(true);
    });
  });
});
