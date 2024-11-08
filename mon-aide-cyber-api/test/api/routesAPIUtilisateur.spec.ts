import { afterEach, beforeEach, describe, expect } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { AdaptateurDeVerificationDeSessionAvecContexteDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionAvecContexteDeTest';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';

import { unUtilisateur } from '../constructeurs/constructeursAidantUtilisateur';
import { ReponseReinitialisationMotDePasseEnErreur } from '../../src/api/routesAPIUtilisateur';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('le serveur MAC sur les routes /api/utilisateur', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };
  let adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
    adaptateurDeVerificationDeSession =
      testeurMAC.adaptateurDeVerificationDeSession as AdaptateurDeVerificationDeSessionDeTest;
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /', () => {
    it("retourne l'utilisateur connecté", async () => {
      const utilisateur = unUtilisateur().construis();
      await testeurMAC.entrepots.utilisateurs().persiste(utilisateur);
      adaptateurDeVerificationDeSession.utilisateurConnecte(utilisateur);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        nomPrenom: utilisateur.nomPrenom,
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/espace-aidant/tableau-de-bord',
          },
          'afficher-profil': {
            url: '/api/profil',
            methode: 'GET',
          },
          'afficher-preferences': {
            url: '/api/aidant/preferences',
            methode: 'GET',
          },
        },
      });
    });

    it("retourne l'utilisateur connecté avec le lien de création d'espace Aidant", async () => {
      const utilisateur = unUtilisateur().sansCGUSignees().construis();
      await testeurMAC.entrepots.utilisateurs().persiste(utilisateur);
      adaptateurDeVerificationDeSession.utilisateurConnecte(utilisateur);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        nomPrenom: utilisateur.nomPrenom,
        liens: {
          'creer-espace-aidant': {
            url: '/api/espace-aidant/cree',
            methode: 'POST',
          },
        },
      });
    });

    it("retourne une erreur HTTP 404 si l'utilisateur n'est pas connu", async () => {
      adaptateurDeVerificationDeSession.reinitialise();
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(404);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        message: "Le utilisateur demandé n'existe pas.",
      });
    });

    describe('Lorsque l’on fournit des informations de contexte', () => {
      beforeEach(() => {
        testeurMAC.adaptateurDeVerificationDeSession =
          new AdaptateurDeVerificationDeSessionAvecContexteDeTest();
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => {
        testeurMAC.arrete();
      });

      it('retourne les liens correspondant', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/utilisateur?contexte=demande-devenir-aidant:finalise-creation-espace-aidant`,
          donneesServeur.portEcoute
        );

        expect(reponse.statusCode).toBe(403);
        expect(await reponse.json()).toStrictEqual({
          message: "L'accès à la ressource est interdit.",
          liens: {
            'finalise-creation-espace-aidant': {
              url: '/api/demandes/devenir-aidant/creation-espace-aidant',
              methode: 'POST',
            },
          },
        });
      });
    });
  });

  describe('Quand une requête POST est reçue sur /api/utilisateur/reinitialisation-mot-de-passe', () => {
    it('Retourne une réponse ACCEPTED', async () => {
      const utilisateur = unUtilisateur().construis();
      testeurMAC.entrepots.utilisateurs().persiste(utilisateur);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/reinitialisation-mot-de-passe`,
        donneesServeur.portEcoute,
        {
          email: utilisateur.identifiantConnexion,
        }
      );

      expect(reponse.statusCode).toBe(202);
    });

    it('Retourne une réponse ACCEPTED même en cas d’erreur', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/reinitialisation-mot-de-passe`,
        donneesServeur.portEcoute,
        {
          email: 'email-inconnu',
        }
      );

      expect(reponse.statusCode).toBe(202);
    });
  });

  describe('Quand une requête PATCH est reçue sur /api/utilisateur/reinitialiser-mot-de-passe', () => {
    it('Modifie le mot de passe', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const utilisateur = unUtilisateur()
        .avecUnMotDePasse('original')
        .construis();
      await testeurMAC.entrepots.utilisateurs().persiste(utilisateur);
      const token = btoa(
        JSON.stringify({
          identifiant: utilisateur.identifiant,
          date: FournisseurHorloge.maintenant(),
          sommeDeControle: crypto
            .createHash('sha256')
            .update(utilisateur.motDePasse)
            .digest('base64'),
        })
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/utilisateur/reinitialiser-mot-de-passe`,
        donneesServeur.portEcoute,
        {
          motDePasse: 'n0uv3eaU-M0D3passe',
          confirmationMotDePasse: 'n0uv3eaU-M0D3passe',
          token,
        }
      );

      expect(reponse.statusCode).toBe(204);
      expect(
        (await testeurMAC.entrepots.utilisateurs().lis(utilisateur.identifiant))
          .motDePasse
      ).toStrictEqual('n0uv3eaU-M0D3passe');
    });

    describe('Lors de la phase de validation', () => {
      it('Valide le mot de passe', async () => {
        const utilisateur = unUtilisateur()
          .avecUnMotDePasse('original')
          .construis();
        await testeurMAC.entrepots.utilisateurs().persiste(utilisateur);
        const token = btoa(
          JSON.stringify({
            identifiant: utilisateur.identifiant,
          })
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'PATCH',
          `/api/utilisateur/reinitialiser-mot-de-passe`,
          donneesServeur.portEcoute,
          {
            motDePasse: 'n0uV3eaU-M0D3passe',
            confirmationMotDePasse: 'n0uv3eaU-M0D3passe',
            token,
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect(
          await reponse.json()
        ).toStrictEqual<ReponseReinitialisationMotDePasseEnErreur>({
          liens: {
            'se-connecter': { url: '/api/token', methode: 'POST' },
            'demande-devenir-aidant': {
              methode: 'GET',
              url: '/api/demandes/devenir-aidant',
            },
            'demande-etre-aide': {
              methode: 'GET',
              url: '/api/demandes/etre-aide',
            },
          },
          message: 'Les deux mots de passe saisis ne correspondent pas.',
        });
      });

      it('Valide l’utilisateur', async () => {
        const token = btoa(
          JSON.stringify({
            identifiant: crypto.randomUUID(),
          })
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'PATCH',
          `/api/utilisateur/reinitialiser-mot-de-passe`,
          donneesServeur.portEcoute,
          {
            motDePasse: 'n0uv3eaU-M0D3passe',
            confirmationMotDePasse: 'n0uv3eaU-M0D3passe',
            token,
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect((await reponse.json()).message).toStrictEqual(
          'L’utilisateur n’est pas connu.'
        );
      });
    });
  });
});
