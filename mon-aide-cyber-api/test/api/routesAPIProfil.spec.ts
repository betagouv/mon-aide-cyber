import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { Profil } from '../../src/api/representateurs/profil/Profil';
import { Aidant } from '../../src/authentification/Aidant';

describe('le serveur MAC sur les routes /api/profil', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /', () => {
    it("retourne les informations le l'utilisateur", async () => {
      const aidant = unAidant().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<Profil>({
        nomPrenom: aidant.nomPrenom,
        dateSignatureCGU: FournisseurHorloge.formateDate(
          aidant.dateSignatureCGU!,
        ).date,
        identifiantConnexion: aidant.identifiantConnexion,
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          'se-deconnecter': { url: '/api/token', methode: 'DELETE' },
          'modifier-mot-de-passe': {
            url: '/api/profil/modifier-mot-de-passe',
            methode: 'POST',
          },
        },
      });
    });

    it('ne peut pas accéder au profil si les CGU ne sont pas signés', async () => {
      const aidant = unAidant().sansEspace().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute,
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });

    it("ne peut pas accéder au profil si l'aidant n'existe pas", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });
  });

  describe('quand une requête POST est reçue sur /modifier-mot-de-passe', () => {
    it('modifie le mot de passe', async () => {
      const aidant = unAidant().construis();
      testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const nouveauMotDePasse = 'EgLw5R0ItVRxkl%#>cPd';
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/profil/modifier-mot-de-passe',
        donneesServeur.portEcoute,
        {
          ancienMotDePasse: aidant.motDePasse,
          motDePasse: nouveauMotDePasse,
          confirmationMotDePasse: nouveauMotDePasse,
        },
      );

      expect(reponse.statusCode).toBe(204);
      const aidantRecupere = await testeurMAC.entrepots
        .aidants()
        .lis(aidant.identifiant);
      expect(aidantRecupere.motDePasse).toBe(nouveauMotDePasse);
    });

    it('vérifie que les CGU ont été signées', async () => {
      const aidant = unAidant().construis();
      testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const nouveauMotDePasse = 'EgLw5R0ItVRxkl%#>cPd';
      await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/profil/changement-mot-de-passe',
        donneesServeur.portEcoute,
        {
          ancienMotDePasse: aidant.motDePasse,
          motDePasse: nouveauMotDePasse,
          confirmationMotDePasse: nouveauMotDePasse,
        },
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });

    describe('En ce qui concerne la vérification du mot de passe', async () => {
      const aidant: Aidant = unAidant().construis();
      beforeEach(
        async () => await testeurMAC.entrepots.aidants().persiste(aidant),
      );

      it.each([
        [
          'vérifie la longueur du mot de passe',
          {
            corps: {
              ancienMotDePasse: aidant.motDePasse,
              motDePasse: 'EgLwVRxkl%#>cPd',
              confirmationMotDePasse: 'EgLwVRxkl%#>cPd',
            },
            attendu: {
              code: 422,
              message:
                'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
            },
          },
        ],
        [
          'vérifie que le mot de passe contient au moins une minuscule',
          {
            corps: {
              ancienMotDePasse: aidant.motDePasse,
              motDePasse: 'EGLW5R0ITVRXKL%#>CPD',
              confirmationMotDePasse: 'EGLW5R0ITVRXKL%#>CPD',
            },
            attendu: {
              code: 422,
              message:
                'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
            },
          },
        ],
        [
          'vérifie que le mot de passe contient au moins une majuscule',
          {
            corps: {
              ancienMotDePasse: aidant.motDePasse,
              motDePasse: 'eglw5r0itvrxkl%#>cpd',
              confirmationMotDePasse: 'eglw5r0itvrxkl%#>cpd',
            },
            attendu: {
              code: 422,
              message:
                'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
            },
          },
        ],
        [
          'vérifie que le mot de passe contient au moins un chiffre',
          {
            corps: {
              ancienMotDePasse: aidant.motDePasse,
              motDePasse: 'EgLwCRDItVRxkl%#>cPd',
              confirmationMotDePasse: 'EgLwCRDItVRxkl%#>cPd',
            },
            attendu: {
              code: 422,
              message:
                'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
            },
          },
        ],
        [
          'vérifie que le mot de passe contient au moins un caractère spécial',
          {
            corps: {
              ancienMotDePasse: aidant.motDePasse,
              motDePasse: 'EgLwCRD0tVRxklAbCcPd',
              confirmationMotDePasse: 'EgLwCRD0tVRxklAbCcPd',
            },
            attendu: {
              code: 422,
              message:
                'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
            },
          },
        ],
        [
          "vérifie que l'ancien mot de passe est bien fourni",
          {
            corps: {
              ancienMotDePasse: '',
              motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
              confirmationMotDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
            },
            attendu: {
              code: 422,
              message:
                "L'ancien mot de passe est obligatoire.\nVotre ancien mot de passe est erroné.",
            },
          },
        ],
        [
          "vérifie que l'ancien mot de passe est bien fourni et que le nouveau mot de passe est valide",
          {
            corps: {
              ancienMotDePasse: '',
              motDePasse: 'EgLwCRD0tVRxklAbCcPd',
              confirmationMotDePasse: 'EgLwCRD0tVRxklAbCcPd',
            },
            attendu: {
              code: 422,
              message:
                "Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.\nL'ancien mot de passe est obligatoire.\nVotre ancien mot de passe est erroné.",
            },
          },
        ],
        [
          "vérifie que le nouveau mot de passe est différent de l'ancien mot de passe",
          {
            corps: {
              ancienMotDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
              motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
              confirmationMotDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
            },
            attendu: {
              code: 422,
              message:
                'Votre nouveau mot de passe doit être différent de votre ancien mot de passe.\nVotre ancien mot de passe est erroné.',
            },
          },
        ],
        [
          "vérifie que l'ancien mot de passe est bien celui de l'utilisateur",
          {
            corps: {
              ancienMotDePasse: 'mauvais-mdp',
              motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
              confirmationMotDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
            },
            attendu: {
              code: 422,
              message: 'Votre ancien mot de passe est erroné.',
            },
          },
        ],
        [
          'vérifie que la confirmation du mot de passe correspond',
          {
            corps: {
              ancienMotDePasse: aidant.motDePasse,
              motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
              confirmationMotDePasse: 'pas-le-meme-mdp',
            },
            attendu: {
              code: 422,
              message:
                'La confirmation de votre mot de passe ne correspond pas.',
            },
          },
        ],
      ])('%s', async (_, test) => {
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidant,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/profil/modifier-mot-de-passe',
          donneesServeur.portEcoute,
          {
            ...test.corps,
          },
        );

        expect(reponse.statusCode).toBe(test.attendu.code);
        expect(await reponse.json()).toStrictEqual({
          message: test.attendu.message,
        });
      });
    });
  });
});
