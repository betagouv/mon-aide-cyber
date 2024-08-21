import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import {
  Departement,
  departements,
} from '../../../src/gestion-demandes/departements';
import { unConstructeurDeDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/constructeurDeDemandeDevenirAidant';
import { uneRequeteDemandeDevenirAidant } from './constructeurRequeteDemandeDevenirAidant';

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

      expect(await reponse.json()).toStrictEqual({
        departements: departements.map(({ nom, code }) => ({
          nom,
          code,
        })),
        liens: {
          'envoyer-demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'POST',
          },
        },
      });
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
        uneRequeteDemandeDevenirAidant()
          .dansLeDepartement('Hautes-Alpes')
          .construis()
      );

      expect(reponse.statusCode).toStrictEqual(200);
      expect(
        (await testeurMAC.entrepots.demandesDevenirAidant().tous())[0]
          .departement
      ).toStrictEqual<Departement>({
        nom: 'Hautes-Alpes',
        code: '5',
        codeRegion: '93',
      });
    });

    it("Renvoie une erreur 400 si l'utilisateur a déjà fait une demande préalable", async () => {
      await testeurMAC.entrepots
        .demandesDevenirAidant()
        .persiste(
          unConstructeurDeDemandeDevenirAidant()
            .avecUnMail('mail@fournisseur.fr')
            .construis()
        );
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        uneRequeteDemandeDevenirAidant()
          .avecUnMail('mail@fournisseur.fr')
          .construis()
      );

      expect(reponse.statusCode).toStrictEqual(400);
      expect(await reponse.json()).toStrictEqual({
        message: 'Une demande existe déjà',
      });
    });

    describe('Valide les paramètres de la requête', () => {
      let donneesServeur: { portEcoute: number; app: Express };

      beforeEach(() => {
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => testeurMAC.arrete());

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
        const corpsDeRequeteAvecMailInvalide = uneRequeteDemandeDevenirAidant()
          .avecUnMail('mail-invalide')
          .construis();

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

      it('Précise toutes les erreurs dans un message, si plusieurs erreurs sont rencontrées', async () => {
        const corpsDeRequeteAvecMailEtNomInvalides =
          uneRequeteDemandeDevenirAidant()
            .avecUnMail('mail-invalide')
            .avecUnNomVide()
            .construis();

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

      it('Retourne le code 422 en cas de mauvais département', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          {
            nom: 'nom',
            prenom: 'prenom',
            mail: 'test.mail@fournisseur.fr',
            departement: 'Grandes-Hautes-Alpes',
          }
        );

        expect(reponse.statusCode).toStrictEqual(422);
      });
    });
  });
});
