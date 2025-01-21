import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { AdaptateurDeVerificationDeSessionAvecContexteDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionAvecContexteDeTest';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';

import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../constructeurs/constructeursAidantUtilisateur';
import {
  CorpsReponseReinitialiserMotDePasseEnErreur,
  ReponseReinitialisationMotDePasseEnErreur,
} from '../../src/api/routesAPIUtilisateur';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { add } from 'date-fns';
import { AdaptateurGestionnaireErreursMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurGestionnaireErreursMemoire';
import { liensPublicsAttendus } from './hateoas/liensAttendus';
import { ReponseHATEOASEnErreur } from '../../src/api/hateoas/hateoas';

describe('Le serveur MAC sur les routes /api/utilisateur', () => {
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

  describe('Quand une requête GET est reçue sur /', () => {
    beforeEach(() => adaptateurDeVerificationDeSession.reinitialise());
    it("Retourne l'utilisateur connecté", async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
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
            url: '/api/mon-espace/tableau-de-bord',
          },
          'afficher-profil': {
            url: '/api/profil',
            methode: 'GET',
          },
          'afficher-preferences': {
            url: '/api/aidant/preferences',
            methode: 'GET',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
          },
        },
      });
    });

    it('Retourne l’information si l’utilisateur s’est connecté via ProConnect', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      adaptateurDeVerificationDeSession.utilisateurProConnect(utilisateur);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect((await reponse.json()).liens['se-deconnecter']).toStrictEqual({
        url: '/pro-connect/deconnexion',
        methode: 'GET',
        typeAppel: 'DIRECT',
      });
    });

    it('Retourne l’action valider signature CGU si l’utilisateur ne les a pas signées', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
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
          'valider-signature-cgu': {
            methode: 'POST',
            url: '/api/utilisateur/valider-signature-cgu',
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
        message: 'Utilisateur non trouvé.',
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
    beforeEach(() => {
      testeurMAC.gestionnaireErreurs =
        new AdaptateurGestionnaireErreursMemoire();
      donneesServeur = testeurMAC.initialise();
      adaptateurDeVerificationDeSession =
        testeurMAC.adaptateurDeVerificationDeSession as AdaptateurDeVerificationDeSessionDeTest;
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

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

    it('Consigne l’erreur', async () => {
      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/reinitialisation-mot-de-passe`,
        donneesServeur.portEcoute,
        {
          email: 'email-inconnu',
        }
      );

      expect(testeurMAC.gestionnaireErreurs.consignateur().tous()).toHaveLength(
        1
      );
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

    it('Retourne une erreur', async () => {
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

      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { minutes: 25 })
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

      expect(reponse.statusCode).toBe(419);
      expect(
        await reponse.json()
      ).toStrictEqual<CorpsReponseReinitialiserMotDePasseEnErreur>({
        message:
          'Le lien de réinitialisation du mot de passe n’est plus valide.',
        ...liensPublicsAttendus,
      });
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
          ...liensPublicsAttendus,
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

  describe("Lorsqu'une requête POST est reçue sur /utilisateur/valider-signature-cgu", () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { portEcoute: number; app: Express };
    beforeEach(() => {
      testeurMAC.adaptateurDeVerificationDeSession =
        new AdaptateurDeVerificationDeSessionDeTest();
      donneesServeur = testeurMAC.initialise();
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

    it('Ajoute la date de signature des CGU', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-signature-cgu`,
        donneesServeur.portEcoute,
        {
          cguValidees: true,
        }
      );

      expect(reponse.statusCode).toBe(200);
      const aidantModifie = await testeurMAC.entrepots
        .aidants()
        .lis(utilisateur.identifiant);
      expect(aidantModifie.dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant()
      );
    });

    it("Accepte la requête et renvoie les actions possibles pour l'Aidant", async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-signature-cgu`,
        donneesServeur.portEcoute,
        {
          cguValidees: true,
        }
      );

      expect(await reponse.json()).toStrictEqual({
        liens: {
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/mon-espace/tableau-de-bord',
          },
          'lancer-diagnostic': {
            methode: 'POST',
            url: '/api/diagnostic',
          },
          'modifier-mot-de-passe': {
            methode: 'POST',
            url: '/api/profil/modifier-mot-de-passe',
          },
          'modifier-profil': {
            methode: 'PATCH',
            url: '/api/profil',
          },
          'se-deconnecter': {
            methode: 'DELETE',
            url: '/api/token',
            typeAppel: 'API',
          },
        },
      });
    });

    it("Accepte la requête et renvoie les actions possibles pour l'Aidant connecté via ProConnect", async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-signature-cgu`,
        donneesServeur.portEcoute,
        {
          cguValidees: true,
        }
      );

      expect((await reponse.json()).liens['se-deconnecter']).toStrictEqual({
        methode: 'GET',
        url: '/pro-connect/deconnexion',
        typeAppel: 'DIRECT',
      });
    });

    it('Vérifie la présence de la date de signature des CGU', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-signature-cgu`,
        donneesServeur.portEcoute,
        {
          cguValidees: false,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        message: 'Veuillez valider les CGU',
        liens: {
          'valider-signature-cgu': {
            url: '/api/utilisateur/valider-signature-cgu',
            methode: 'POST',
          },
        },
      });
    });
  });
});
