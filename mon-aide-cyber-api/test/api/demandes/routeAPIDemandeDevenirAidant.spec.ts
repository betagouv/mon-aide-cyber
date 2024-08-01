import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { listeDepartements } from '../../../src/infrastructure/departements/listeDepartements/listeDepartements';

describe('Le serveur MAC, sur  les routes de demande pour devenir Aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête GET est reçue', () => {
    it('Fournis la liste des départements et leurs codes', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute
      );

      const newVar = await reponse.json();

      console.log(newVar);

      expect(newVar.departements).toStrictEqual(
        listeDepartements.map(({ nom, code }) => ({
          nom,
          code,
        }))
      );
    });
  });

  describe('Quand une requête POST est reçue', () => {
    let donneesServeur: { portEcoute: number; app: Express };

    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
    });

    afterEach(() => testeurMAC.arrete());
    it('Réponds OK à la requête', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        {
          nom: 'nom',
          prenom: 'prenom',
          mail: 'mail@fournisseur.fr',
          departement: 'departement',
        }
      );

      expect(reponse.statusCode).toStrictEqual(200);
    });

    describe('Valide les paramètres de la requête', () => {
      it("Retourne le code 422 en cas d'invalidité", async () => {
        const corpsDeRequeteInvalide = {};

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          corpsDeRequeteInvalide
        );

        expect(reponse.statusCode).toStrictEqual(422);
      });

      it("Précise l'erreur dans un message, si une erreur est rencontré", async () => {
        const corpsDeRequeteAvecMailInvalide = {
          nom: 'nom',
          prenom: 'prenom',
          mail: 'mail-invalide',
          departement: 'département',
        };

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          corpsDeRequeteAvecMailInvalide
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner votre e-mail'
        );
      });

      it('Précise toutes les erreurs dans un message, si plusieurs erreurs sont rencontrés', async () => {
        const corpsDeRequeteAvecMailEtNomInvalides = {
          nom: '',
          prenom: 'prenom',
          mail: 'mail-invalide',
          departement: 'département',
        };

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          corpsDeRequeteAvecMailEtNomInvalides
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner votre nom, Veuillez renseigner votre e-mail'
        );
      });
    });
  });
});
