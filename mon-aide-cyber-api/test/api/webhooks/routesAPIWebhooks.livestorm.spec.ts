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
    beforeEach(() => {
      adaptateurEnvironnement.webinaires = () => ({
        livestorm: () => ({
          idEvenementAteliersDevenirAidant: '12345',
        }),
      });
    });

    it('active le compte Aidant', async () => {
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

    describe('Lors de l’étape de validation', () => {
      it('renvoie une réponse HTTP 204 si la requête Livestorm n‘est pas du type "people" (correspond à l‘événement people.attended) pour éviter que Livestorm lance un retry (https://developers.livestorm.co/docs/webhooks-1#auto-retry-process)', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/livestorm/activation-compte-aidant`,
          {
            data: {
              type: "session",
              attributes: {
                registrant_detail: {
                  event_id: "12345",
                  fields: [{id: "email", "value": "email-aidant@email.com"}],
                },
              },
            },
          }
        );

        expect(reponse.statusCode).toBe(204);
      });

      it('renvoie une réponse HTTP 204 si la requête Livestorm ne comporte pas un bon event_id', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/livestorm/activation-compte-aidant`,
          {
            data: {
              type: 'session',
              attributes: {
                registrant_detail: {
                  event_id: 'faux-id',
                  fields: [{ id: "email", value: 'email-aidant@email.com' }],
                },
              },
            },
          }
        );

        expect(reponse.statusCode).toBe(204);
      });

      it('renvoie une réponse HTTP 204 si la requête Livestorm ne contient pas l’email', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/livestorm/activation-compte-aidant`,
          {
            data: {
              type: 'people',
              attributes: {
                registrant_detail: {
                  event_id: '12345',
                  fields: [{ id: "champ-inconnu", value: 'email-aidant@email.com' }],
                },
              },
            },
          }
        );

        expect(reponse.statusCode).toBe(204);
      });


      it('renvoie une réponse HTTP 204 si la requête Livestorm contient un email invalide', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/livestorm/activation-compte-aidant`,
          {
            data: {
              type: 'people',
              attributes: {
                registrant_detail: {
                  event_id: '12345',
                  fields: [{ id: 'email', value: 'email-invalide' }],
                },
              },
            },
          }
        );

        expect(reponse.statusCode).toBe(204);
      });

      });
  });
});
