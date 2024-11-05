import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Express } from 'express';
import testeurIntegration from '../testeurIntegration';
import { executeRequete } from '../executeurRequete';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { Profil } from '../../../src/api/representateurs/profil/Profil';
import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../../constructeurs/constructeursAidantUtilisateur';
import { Utilisateur } from '../../../src/authentification/Utilisateur';

describe('le serveur MAC sur les routes /api/profil', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /', () => {
    it("retourne les informations le l'Aidant", async () => {
      const { utilisateur, aidant } =
        await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
          constructeurAidant: unAidant(),
        });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<Profil>({
        nomPrenom: aidant.nomPrenom,
        dateSignatureCGU: FournisseurHorloge.formateDate(
          aidant.dateSignatureCGU!
        ).date,
        consentementAnnuaire: aidant.consentementAnnuaire,
        identifiantConnexion: aidant.email,
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/espace-aidant/tableau-de-bord',
          },
          'se-deconnecter': { url: '/api/token', methode: 'DELETE' },
          'modifier-mot-de-passe': {
            url: '/api/profil/modifier-mot-de-passe',
            methode: 'POST',
          },
          'modifier-profil': {
            url: '/api/profil',
            methode: 'PATCH',
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
        donneesServeur.portEcoute
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it("ne peut pas accéder au profil si l'aidant n'existe pas", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });
  });

  describe('Quand une requête PATCH est reçue sur /', () => {
    it('Retourne une erreur HTTP 404 si l’Aidant n’est pas connu', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/profil`,
        donneesServeur.portEcoute,
        {
          consentementAnnuaire: true,
        }
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });

    it("Modifie le consentement pour apparaître dans l'annuaire", async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        '/api/profil',
        donneesServeur.portEcoute,
        {
          consentementAnnuaire: true,
        }
      );

      const aidantModifie = await testeurMAC.entrepots
        .aidants()
        .lis(utilisateur.identifiant);
      expect(reponse.statusCode).toBe(204);
      expect(aidantModifie.consentementAnnuaire).toBe(true);
    });

    it("Modifie le consentement pour ne plus apparaître dans l'annuaire", async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant().ayantConsentiPourLAnnuaire(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        '/api/profil',
        donneesServeur.portEcoute,
        {
          consentementAnnuaire: false,
        }
      );

      const aidantModifie = await testeurMAC.entrepots
        .aidants()
        .lis(utilisateur.identifiant);
      expect(reponse.statusCode).toBe(204);
      expect(aidantModifie.consentementAnnuaire).toBe(false);
    });

    it('Ne modifie pas le consentement si il n’y a pas de changements', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        '/api/profil',
        donneesServeur.portEcoute,
        {
          consentementAnnuaire: false,
        }
      );

      const aidantModifie = await testeurMAC.entrepots
        .aidants()
        .lis(utilisateur.identifiant);
      expect(reponse.statusCode).toBe(204);
      expect(aidantModifie.consentementAnnuaire).toBe(false);
    });

    it('Vérifie que les CGU ont été signées', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      await executeRequete(
        donneesServeur.app,
        'PATCH',
        '/api/profil',
        donneesServeur.portEcoute,
        {
          consentementAnnuaire: true,
        }
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Valide que le corps de la requête correspond au consentement', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        '/api/profil',
        donneesServeur.portEcoute,
        {
          consentemetAnnaire: 'true',
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual({
        message:
          "Une erreur est survenue, vos modifications n'ont pas été prises en compte. Veuillez recharger la page et vérifier vos informations.",
      });
    });
  });

  describe('Quand une requête POST est reçue sur /modifier-mot-de-passe', () => {
    it('modifie le mot de passe', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const nouveauMotDePasse = 'EgLw5R0ItVRxkl%#>cPd';
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/profil/modifier-mot-de-passe',
        donneesServeur.portEcoute,
        {
          ancienMotDePasse: utilisateur.motDePasse,
          motDePasse: nouveauMotDePasse,
          confirmationMotDePasse: nouveauMotDePasse,
        }
      );

      expect(reponse.statusCode).toBe(204);
      const utilisateurRecupere = await testeurMAC.entrepots
        .aidants()
        .lis(utilisateur.identifiant);
      expect(utilisateurRecupere.motDePasse).toBe(nouveauMotDePasse);
    });

    it('vérifie que les CGU ont été signées', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const nouveauMotDePasse = 'EgLw5R0ItVRxkl%#>cPd';
      await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/profil/modifier-mot-de-passe',
        donneesServeur.portEcoute,
        {
          ancienMotDePasse: utilisateur.motDePasse,
          motDePasse: nouveauMotDePasse,
          confirmationMotDePasse: nouveauMotDePasse,
        }
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    describe('En ce qui concerne la vérification du mot de passe', async () => {
      const utilisateur: Utilisateur = unUtilisateur().construis();
      beforeEach(
        async () =>
          await testeurMAC.entrepots.utilisateurs().persiste(utilisateur)
      );

      it.each([
        [
          'vérifie la longueur du mot de passe',
          {
            corps: {
              ancienMotDePasse: utilisateur.motDePasse,
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
              ancienMotDePasse: utilisateur.motDePasse,
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
              ancienMotDePasse: utilisateur.motDePasse,
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
              ancienMotDePasse: utilisateur.motDePasse,
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
              ancienMotDePasse: utilisateur.motDePasse,
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
          "vérifie que l'ancien mot de passe est bien celui de l'Aidant",
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
              ancienMotDePasse: utilisateur.motDePasse,
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
        const { utilisateur: aidantUtilisateur } =
          await unCompteAidantRelieAUnCompteUtilisateur({
            entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
            entrepotAidant: testeurMAC.entrepots.aidants(),
            constructeurUtilisateur: unUtilisateur().avecUnMotDePasse(
              utilisateur.motDePasse
            ),
            constructeurAidant: unAidant(),
          });
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantUtilisateur
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/profil/modifier-mot-de-passe',
          donneesServeur.portEcoute,
          {
            ...test.corps,
          }
        );

        expect(reponse.statusCode).toBe(test.attendu.code);
        expect(await reponse.json()).toStrictEqual({
          message: test.attendu.message,
        });
      });
    });
  });
});
