import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { listeDepartements } from '../../src/infrastructure/departements/listeDepartements.ts/listeDepartements';

describe('Le serveur MAC, sur les routes de demande d’aide de la part de l’Aidé', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('/api/aide/demande', () => {
    describe('Quand une requête POST est reçue', () => {
      it('Valide la demande de l’aidé', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-29T14:04:17+01:00')),
        );
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/aide/demande',
          donneesServeur.portEcoute,
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse du sud',
            raisonSociale: 'beta-gouv',
            relationAidant: true,
          },
        );

        expect(reponse.statusCode).toBe(202);
        const aides = await testeurMAC.entrepots.aides().tous();
        expect(aides).toHaveLength(1);
        expect(aides[0].dateSignatureCGU).toStrictEqual(
          FournisseurHorloge.maintenant(),
        );
      });

      it('Renvoie une erreur si la demande n’a pu aller au bout', async () => {
        const testeurMAC = testeurIntegration();
        const donneesServeur: { portEcoute: number; app: Express } =
          testeurMAC.initialise();
        testeurMAC.adaptateurEnvoieMessage.envoie = () => Promise.reject();
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/aide/demande',
          donneesServeur.portEcoute,
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse du sud',
            raisonSociale: 'beta-gouv',
          },
        );

        expect(reponse.statusCode).toBe(500);
        expect(await reponse.json()).toStrictEqual({
          message: "Votre demande d'aide n'a pu aboutir",
        });
      });

      describe("En ce qui concerne les informations envoyées par l'Aidé", () => {
        const testeurMAC = testeurIntegration();
        let donneesServeur: { portEcoute: number; app: Express };

        beforeEach(() => {
          donneesServeur = testeurMAC.initialise();
        });

        afterEach(() => testeurMAC.arrete());
        it('Vérifie que les CGU sont signées', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/demande',
            donneesServeur.portEcoute,
            {
              cguValidees: false,
              email: 'jean.dupont@aide.com',
              departement: 'Paris',
              raisonSociale: 'beta-gouv',
            },
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Veuillez signer les CGU',
            liens: {
              'demander-aide': {
                url: '/api/aide/demande',
                methode: 'POST',
              },
            },
          });
        });

        it("Vérifie que l'email est renseigné", async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/demande',
            donneesServeur.portEcoute,
            {
              cguValidees: true,
              email: 'ceci-n-est-pas-un-email',
              departement: 'Gironde',
              raisonSociale: 'beta-gouv',
            },
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Veuillez renseigner votre Email',
            liens: {
              'demander-aide': {
                url: '/api/aide/demande',
                methode: 'POST',
              },
            },
          });
        });

        it('Vérifie que le département est renseigné', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/demande',
            donneesServeur.portEcoute,
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: '   ',
              raisonSociale: 'beta-gouv',
            },
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message:
              "Veuillez renseigner le département de l'entité pour laquelle vous sollicitez une aide",
            liens: {
              'demander-aide': {
                url: '/api/aide/demande',
                methode: 'POST',
              },
            },
          });
        });

        it('La raison sociale est optionnelle', async () => {
          FournisseurHorlogeDeTest.initialise(
            new Date(Date.parse('2024-02-29T14:04:17+01:00')),
          );
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/demande',
            donneesServeur.portEcoute,
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Finistère',
            },
          );

          expect(reponse.statusCode).toBe(202);
          const aides = await testeurMAC.entrepots.aides().tous();
          expect(aides).toHaveLength(1);
          expect(aides[0].dateSignatureCGU).toStrictEqual(
            FournisseurHorloge.maintenant(),
          );
        });

        it('La raison sociale, lorsque fournie ne peut pas être vide', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/demande',
            donneesServeur.portEcoute,
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Bas-Rhin',
              raisonSociale: '    ',
            },
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message:
              "Veuillez renseigner la raison sociale de l'entité pour laquelle vous sollicitez une aide",
            liens: {
              'demander-aide': {
                url: '/api/aide/demande',
                methode: 'POST',
              },
            },
          });
        });
      });
    });

    describe('Quand une requête GET est reçue', () => {
      it("Retourne le lien 'demander-aide'", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/aide/demande',
          donneesServeur.portEcoute,
        );

        expect(reponse.statusCode).toBe(200);
        expect((await reponse.json()).liens).toStrictEqual({
          'demander-aide': {
            url: '/api/aide/demande',
            methode: 'POST',
          },
        });
      });

      it('Retourne la liste des départements', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/aide/demande',
          donneesServeur.portEcoute,
        );

        expect((await reponse.json()).departements).toStrictEqual([
          ...listeDepartements,
        ]);
      });
    });
  });
});
