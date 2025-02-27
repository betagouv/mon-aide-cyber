import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { AdaptateurDeVerificationDeSessionAvecContexteDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionAvecContexteDeTest';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';

import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unCompteUtilisateurInscritConnecteViaProConnect,
  unCompteUtilisateurInscritRelieAUnCompteUtilisateur,
  unUtilisateur,
  unUtilisateurInscrit,
} from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
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
import {
  ReponseHATEOAS,
  ReponseHATEOASEnErreur,
} from '../../src/api/hateoas/hateoas';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';

describe('Le serveur MAC sur les routes /api/utilisateur', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };
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

    describe('Dans le cas d’un Aidant', () => {
      it("Retourne l'utilisateur connecté", async () => {
        const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          constructeurAidant: unAidant(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
        });
        adaptateurDeVerificationDeSession.utilisateurConnecte(
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/utilisateur/`
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
    });

    describe('Dans le cas d’un Utilisateur Inscrit', () => {
      it("Retourne l'utilisateur connecté via ProConnect", async () => {
        const utilisateur =
          await unCompteUtilisateurInscritConnecteViaProConnect({
            entrepotUtilisateurInscrit:
              testeurMAC.entrepots.utilisateursInscrits(),
            constructeurUtilisateur:
              unUtilisateurInscrit().avecUneDateDeSignatureDeCGU(
                new Date(Date.parse('2025-02-02T12:32:24'))
              ),
            adaptateurDeVerificationDeSession,
          });

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/utilisateur/`
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
            'se-deconnecter': {
              url: '/pro-connect/deconnexion',
              methode: 'GET',
              typeAppel: 'DIRECT',
            },
            'demande-devenir-aidant': {
              url: '/api/demandes/devenir-aidant',
              methode: 'GET',
            },
            'envoyer-demande-devenir-aidant': {
              url: '/api/demandes/devenir-aidant',
              methode: 'POST',
            },
            'rechercher-entreprise': {
              url: '/api/recherche-entreprise',
              methode: 'GET',
            },
          },
        });
      });
    });

    it('Retourne l’information si l’utilisateur s’est connecté via ProConnect', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect((await reponse.json()).liens['se-deconnecter']).toStrictEqual({
        url: '/pro-connect/deconnexion',
        methode: 'GET',
        typeAppel: 'DIRECT',
      });
    });

    it('Retourne l’action valider profil si l’utilisateur ne les a pas signées', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        nomPrenom: utilisateur.nomPrenom,
        liens: {
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
          'valider-profil-utilisateur-inscrit': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
          },
          'valider-profil-aidant': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-aidant',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
          },
        },
      });
    });

    it('Retourne l’action valider profil si l’utilisateur proconnect ne les a pas signées', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        nomPrenom: utilisateur.nomPrenom,
        liens: {
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
          'valider-profil-utilisateur-inscrit': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
          },
          'valider-profil-aidant': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-aidant',
          },
          'se-deconnecter': {
            methode: 'GET',
            typeAppel: 'DIRECT',
            url: '/pro-connect/deconnexion',
          },
        },
      });
    });

    it('Retourne l’action valider signature CGU si l’utilisateur, un Gendarme connecté via proconnect, ne les a pas signées', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees().avecUnProfilGendarme(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`
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
          'se-deconnecter': {
            methode: 'GET',
            typeAppel: 'DIRECT',
            url: '/pro-connect/deconnexion',
          },
        },
      });
    });

    it('Retourne l’action valider signature CGU si l’utilisateur Inscrit proconnect ne les a pas signées', async () => {
      const utilisateur = await unCompteUtilisateurInscritConnecteViaProConnect(
        {
          entrepotUtilisateurInscrit:
            testeurMAC.entrepots.utilisateursInscrits(),
          constructeurUtilisateur: unUtilisateurInscrit().sansValidationDeCGU(),
          adaptateurDeVerificationDeSession,
        }
      );
      adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`
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
          'se-deconnecter': {
            methode: 'GET',
            typeAppel: 'DIRECT',
            url: '/pro-connect/deconnexion',
          },
          'envoyer-demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'POST',
          },
          'demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'GET',
          },
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
        },
      });
    });

    it("retourne une erreur HTTP 404 si l'utilisateur n'est pas connu", async () => {
      adaptateurDeVerificationDeSession.reinitialise();
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`
      );

      expect(reponse.statusCode).toBe(404);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        message: 'Utilisateur non trouvé.',
      });
    });

    describe('Lorsque l’on fournit des informations de contexte', () => {
      beforeEach(() => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-12-12T13:45:32'))
        );
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
          `/api/utilisateur?contexte=demande-devenir-aidant:finalise-creation-espace-aidant`
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

    describe('Dans le cas du nouveau parcours devenir Aidant', () => {
      const testeurMAC = testeurIntegration();
      let donneesServeur: { app: Express };
      let adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;

      beforeEach(() => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2025-02-04T15:47:43'))
        );
        donneesServeur = testeurMAC.initialise();
        adaptateurDeVerificationDeSession =
          testeurMAC.adaptateurDeVerificationDeSession as AdaptateurDeVerificationDeSessionDeTest;
      });

      afterEach(() => {
        testeurMAC.arrete();
      });

      it('Retourne les actions pour valider les profils Aidant et Utilisateur Inscrit', async () => {
        const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          constructeurAidant: unAidant().cguValideesLe(
            new Date(Date.parse('2024-12-13T10:24:31'))
          ),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
        });
        adaptateurDeVerificationDeSession.utilisateurConnecte(
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/utilisateur/`
        );

        expect(reponse.statusCode).toBe(200);
        expect((await reponse.json()).liens).toStrictEqual({
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
          'valider-profil-utilisateur-inscrit': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
          },
          'valider-profil-aidant': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-aidant',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
          },
        });
      });

      it('Retourne les actions pour valider les profils Aidant et Utilisateur Inscrit connecté via ProConnect', async () => {
        await unCompteUtilisateurInscritConnecteViaProConnect({
          entrepotUtilisateurInscrit:
            testeurMAC.entrepots.utilisateursInscrits(),
          constructeurUtilisateur:
            unUtilisateurInscrit().avecUneDateDeSignatureDeCGU(
              new Date(Date.parse('2024-12-13T10:24:31'))
            ),
          adaptateurDeVerificationDeSession,
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/utilisateur/`
        );

        expect(reponse.statusCode).toBe(200);
        expect((await reponse.json()).liens).toStrictEqual({
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
          'valider-profil-utilisateur-inscrit': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
          },
          'valider-profil-aidant': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-aidant',
          },
          'se-deconnecter': {
            url: '/pro-connect/deconnexion',
            methode: 'GET',
            typeAppel: 'DIRECT',
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
    let donneesServeur: { app: Express };
    beforeEach(() => {
      testeurMAC.adaptateurDeVerificationDeSession =
        new AdaptateurDeVerificationDeSessionDeTest();
      donneesServeur = testeurMAC.initialise();
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

    it('Retourne une 404 si l’utilisateur n’existe pas', async () => {
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        crypto.randomUUID()
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-signature-cgu`,
        {
          cguValidees: true,
        }
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        liens: {
          'se-deconnecter': {
            methode: 'DELETE',
            url: '/api/token',
            typeAppel: 'API',
          },
          'valider-signature-cgu': {
            methode: 'POST',
            url: '/api/utilisateur/valider-signature-cgu',
          },
        },
        message: 'Erreur lors de la validation des CGU.',
      });
    });

    describe('Dans le cas d’un Aidant', () => {
      it('Ajoute la date de signature des CGU', async () => {
        FournisseurHorlogeDeTest.initialise(new Date());
        const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          constructeurAidant: unAidant().sansCGUSignees(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
        });
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
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
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
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
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
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
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
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

    describe('Dans le cas d’un Utilisateur Inscrit', () => {
      it('Ajoute la date de signature des CGU', async () => {
        FournisseurHorlogeDeTest.initialise(new Date());
        const { utilisateur } =
          await unCompteUtilisateurInscritRelieAUnCompteUtilisateur({
            entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
            constructeurUtilisateurInscrit:
              unUtilisateurInscrit().sansValidationDeCGU(),
            entrepotUtilisateurInscrit:
              testeurMAC.entrepots.utilisateursInscrits(),
            constructeurUtilisateur: unUtilisateur(),
          });
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
          {
            cguValidees: true,
          }
        );

        expect(reponse.statusCode).toBe(200);
        const utilisateurInscritModifie = await testeurMAC.entrepots
          .utilisateursInscrits()
          .lis(utilisateur.identifiant);
        expect(utilisateurInscritModifie.dateSignatureCGU).toStrictEqual(
          FournisseurHorloge.maintenant()
        );
      });

      it("Accepte la requête et renvoie les actions possibles pour l'Utilisateur Inscrit", async () => {
        const { utilisateur } =
          await unCompteUtilisateurInscritRelieAUnCompteUtilisateur({
            entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
            constructeurUtilisateurInscrit:
              unUtilisateurInscrit().sansValidationDeCGU(),
            entrepotUtilisateurInscrit:
              testeurMAC.entrepots.utilisateursInscrits(),
            constructeurUtilisateur: unUtilisateur(),
          });
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
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
            'se-deconnecter': {
              methode: 'DELETE',
              url: '/api/token',
              typeAppel: 'API',
            },
            'demande-devenir-aidant': {
              methode: 'GET',
              url: '/api/demandes/devenir-aidant',
            },
            'envoyer-demande-devenir-aidant': {
              methode: 'POST',
              url: '/api/demandes/devenir-aidant',
            },
            'rechercher-entreprise': {
              methode: 'GET',
              url: '/api/recherche-entreprise',
            },
          },
        });
      });

      it("Accepte la requête et renvoie les actions possibles pour l'Utilisateur Inscrit connecté via ProConnect", async () => {
        await unCompteUtilisateurInscritConnecteViaProConnect({
          entrepotUtilisateurInscrit:
            testeurMAC.entrepots.utilisateursInscrits(),
          constructeurUtilisateur: unUtilisateurInscrit().sansValidationDeCGU(),
          adaptateurDeVerificationDeSession:
            testeurMAC.adaptateurDeVerificationDeSession,
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-signature-cgu`,
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
    });
  });

  describe('Quand une requête POST est reçue sur /api/utilisateur/valider-profil-aidant', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { app: Express };

    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T14:32:34'))
      );
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

    it('Accepte la requête et retourne les actions possibles', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().cguValideesLe(
          new Date(Date.parse('2024-04-12T12:34:54'))
        ),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-aidant`,
        {
          cguValidees: true,
          signatureCharte: true,
          entite: {
            nom: 'Beta-Gouv',
            siret: '1234567890',
            type: 'ServicePublic',
          },
          departement: 'Gironde',
        }
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
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

    it('Met à jour l’Aidant', async () => {
      const { utilisateur, aidant } =
        await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          constructeurAidant: unAidant().cguValideesLe(
            new Date(Date.parse('2024-04-12T12:34:54'))
          ),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
        });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-aidant`,
        {
          cguValidees: true,
          signatureCharte: true,
          entite: {
            nom: 'Beta-Gouv',
            siret: '1234567890',
            type: 'ServicePublic',
          },
        }
      );

      expect(
        await testeurMAC.entrepots.aidants().lis(aidant.identifiant)
      ).toStrictEqual<Aidant>({
        identifiant: expect.any(String),
        email: aidant.email,
        nomPrenom: aidant.nomPrenom,
        preferences: {
          secteursActivite: [],
          departements: [],
          typesEntites: [],
          nomAffichageAnnuaire: aidant.preferences.nomAffichageAnnuaire,
        },
        consentementAnnuaire: false,
        entite: {
          type: 'ServicePublic',
          nom: 'Beta-Gouv',
          siret: '1234567890',
        },
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        dateSignatureCharte: FournisseurHorloge.maintenant(),
      });
    });

    it('Vérifie la présence des CGU validées', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-aidant`,
        {
          cguValidees: false,
          signatureCharte: true,
          entite: {
            nom: 'Beta-Gouv',
            siret: '1234567890',
            type: 'ServicePublic',
          },
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        message: 'Veuillez valider les CGU',
        liens: {
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
          'valider-profil-aidant': {
            url: '/api/utilisateur/valider-profil-aidant',
            methode: 'POST',
          },
          'valider-profil-utilisateur-inscrit': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
          },
        },
      });
    });

    it('Vérifie la présence de la signature de la charte Aidant', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-aidant`,
        {
          cguValidees: true,
          signatureCharte: false,
          entite: {
            nom: 'Beta-Gouv',
            siret: '1234567890',
            type: 'ServicePublic',
          },
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect((await reponse.json()).message).toStrictEqual(
        'Veuillez valider la Charte de l’Aidant'
      );
    });

    it.each([
      ['Beta-Gouv', '1234567890', 'ServicePublic', 200],
      [undefined, undefined, 'ServicePublic', 422],
      ['Beta-Gouv', '1234567890', 'ServiceEtat', 200],
      [undefined, undefined, 'ServiceEtat', 422],
      ['Beta-Gouv', '1234567890', 'Association', 200],
      [undefined, undefined, 'Association', 200],
    ])(
      "S'assure de la validité de l'entité [Pour %s - %s en %s] fournie (",
      async (nomEntite, siretEntite, typeEntite, codeHttpRetour) => {
        FournisseurHorlogeDeTest.initialise(new Date());
        const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          constructeurAidant: unAidant().sansCGUSignees(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
        });
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          utilisateur.identifiant
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/valider-profil-aidant`,
          {
            cguValidees: true,
            signatureCharte: true,
            entite: {
              nom: nomEntite,
              siret: siretEntite,
              type: typeEntite,
            },
          }
        );

        expect(reponse.statusCode).toBe(codeHttpRetour);
      }
    );

    it("Vérifie la cohérence du message d'erreur", async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-aidant`,
        {
          cguValidees: true,
          signatureCharte: true,
          entite: {
            nom: '',
            siret: '',
            type: '',
          },
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect((await reponse.json()).message).toStrictEqual(
        'Veuillez fournir une entité valide, nom, siret et type (parmi ServicePublic, ServiceEtat ou Association)'
      );
    });

    it('Retourne une 404 si l’utilisateur n’est pas connu', async () => {
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        crypto.randomUUID()
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-aidant`,
        {
          cguValidees: true,
          signatureCharte: true,
          entite: {
            nom: 'Beta-Gouv',
            siret: '1234567890',
            type: 'ServicePublic',
          },
        }
      );

      expect(reponse.statusCode).toBe(404);
    });
  });

  describe('Quand une requête POST est reçue sur /api/utilisateur/valider-profil-utilisateur-inscrit', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { app: Express };

    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T14:32:34'))
      );
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

    it('Accepte la requête et retourne les actions possibles', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotAidant: testeurMAC.entrepots.aidants(),
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().sansCGUSignees(),
        constructeurUtilisateur: unUtilisateur().sansCGUSignees(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-utilisateur-inscrit`,
        {
          cguValidees: true,
        }
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
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
          'se-deconnecter': {
            methode: 'DELETE',
            url: '/api/token',
            typeAppel: 'API',
          },
          'demande-devenir-aidant': {
            methode: 'GET',
            url: '/api/demandes/devenir-aidant',
          },
          'envoyer-demande-devenir-aidant': {
            methode: 'POST',
            url: '/api/demandes/devenir-aidant',
          },
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
        },
      });
    });

    it('Transforme un Aidant en Utilisateur Inscrit', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant().cguValideesLe(
          new Date(Date.parse('2024-04-12T12:34:54'))
        ),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-utilisateur-inscrit`,
        {
          cguValidees: true,
        }
      );

      const utilisateurInscrit = await testeurMAC.entrepots
        .utilisateursInscrits()
        .lis(utilisateur.identifiant);

      expect(utilisateurInscrit).toStrictEqual<UtilisateurInscrit>({
        identifiant: expect.any(String),
        email: utilisateurInscrit.email,
        nomPrenom: utilisateurInscrit.nomPrenom,
        dateSignatureCGU: FournisseurHorloge.maintenant(),
      });
    });

    it('Vérifie la présence des CGU validées', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const { utilisateur } =
        await unCompteUtilisateurInscritRelieAUnCompteUtilisateur({
          entrepotUtilisateurInscrit:
            testeurMAC.entrepots.utilisateursInscrits(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          constructeurUtilisateurInscrit:
            unUtilisateurInscrit().sansValidationDeCGU(),
          constructeurUtilisateur: unUtilisateur(),
        });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-utilisateur-inscrit`,
        {
          cguValidees: false,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        message: 'Veuillez valider les CGU',
        liens: {
          'rechercher-entreprise': {
            methode: 'GET',
            url: '/api/recherche-entreprise',
          },
          'valider-profil-aidant': {
            url: '/api/utilisateur/valider-profil-aidant',
            methode: 'POST',
          },
          'valider-profil-utilisateur-inscrit': {
            methode: 'POST',
            url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
          },
        },
      });
    });

    it('Retourne une 404 si l’utilisateur n’est pas connu', async () => {
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        crypto.randomUUID()
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/valider-profil-utilisateur-inscrit`,
        {
          cguValidees: true,
        }
      );

      expect(reponse.statusCode).toBe(404);
    });
  });
});
