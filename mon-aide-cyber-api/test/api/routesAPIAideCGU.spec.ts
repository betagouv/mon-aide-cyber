import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Le serveur MAC, sur les routes CGU Aidé', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('/api/aide/cgu', () => {
    describe('Quand une requête POST est reçue', () => {
      it('Valide les CGU de l’aidé', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-29T14:04:17+01:00')),
        );
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/aide/cgu',
          donneesServeur.portEcoute,
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse du sud',
            raisonSociale: 'beta-gouv',
          },
        );

        expect(reponse.statusCode).toBe(202);
        const aides = await testeurMAC.entrepots.aides().tous();
        expect(aides).toHaveLength(1);
        expect(aides[0].dateSignatureCGU).toStrictEqual(
          FournisseurHorloge.maintenant(),
        );
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
            '/api/aide/cgu',
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
              'demander-validation-cgu-aide': {
                url: '/api/aide/cgu',
                methode: 'POST',
              },
            },
          });
        });

        it("Vérifie que l'email est renseigné", async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/cgu',
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
              'demander-validation-cgu-aide': {
                url: '/api/aide/cgu',
                methode: 'POST',
              },
            },
          });
        });

        it('Vérifie que le département est renseigné', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/aide/cgu',
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
              'demander-validation-cgu-aide': {
                url: '/api/aide/cgu',
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
            '/api/aide/cgu',
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
            '/api/aide/cgu',
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
              'demander-validation-cgu-aide': {
                url: '/api/aide/cgu',
                methode: 'POST',
              },
            },
          });
        });
      });
    });

    describe('Quand une requête GET est reçue', () => {
      it("Retourne le lien 'demander-validation-cgu-aide'", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/aide/cgu',
          donneesServeur.portEcoute,
        );

        expect(reponse.statusCode).toBe(200);
        expect(await reponse.json()).toStrictEqual({
          liens: {
            'demander-validation-cgu-aide': {
              url: '/api/aide/cgu',
              methode: 'POST',
            },
          },
        });
      });
    });
  });
});
