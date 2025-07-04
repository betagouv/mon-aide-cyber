import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import {
  unAidant,
  unUtilisateurInscrit,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { desInformationsUtilisateur } from '../../constructeurs/constructeurProConnectInformationsUtilisateur';
import { fakerFR } from '@faker-js/faker';
import { unServiceAidant } from '../../../src/espace-aidant/ServiceAidantMAC';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { utilitairesCookies } from '../../../src/adaptateurs/utilitairesDeCookies';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

const enObjet = <T extends { [clef: string]: string }>(cookie: string): T =>
  cookie.split('; ').reduce((acc: T, v: string) => {
    const [cle, valeur] = v.split('=');
    return { ...acc, [cle]: valeur };
  }, {} as T);

describe('Le serveur MAC, sur les routes de connexion ProConnect', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Lorsqu’une requête GET est reçue sur /pro-connect/connexion', () => {
    beforeEach(() => {
      testeurMAC.adaptateurProConnect.genereDemandeAutorisation = () =>
        Promise.resolve({
          nonce: 'coucou',
          url: new URL('http://mom-domaine'),
          state: 'etat',
        });
      donneesServeur = testeurMAC.initialise();
    });

    it('L’utilisateur est redirigé', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/connexion'
      );

      expect(reponse.statusCode).toStrictEqual(302);
      const objet = enObjet<{ ProConnectInfo: string; [clef: string]: string }>(
        reponse.headers['set-cookie'] as string
      );
      expect(objet.ProConnectInfo).toStrictEqual(
        'j%3A%7B%22state%22%3A%22etat%22%2C%22nonce%22%3A%22coucou%22%7D'
      );
    });

    it('Le cookie de l’utilisateur est supprimé', async () => {
      await executeRequete(donneesServeur.app, 'GET', '/pro-connect/connexion');

      expect(testeurMAC.adaptateurDeGestionDeCookies.aSupprime).toBe(true);
    });
  });

  describe('Lorsqu’une requête GET est reçue sur /pro-connect/apres-authentification', () => {
    beforeEach(async () => {
      const aidant = unAidant()
        .avecUnEmail('jean.dupont@aidant.fr')
        .construis();
      donneesServeur = testeurMAC.initialise();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      utilitairesCookies.recuperateurDeCookies = () =>
        'j%3A%7B%22state%22%3A%22etat%22%2C%22nonce%22%3A%22coucou%22%7D';
      testeurMAC.adaptateurProConnect.recupereJeton = async () => ({
        idToken: fakerFR.string.alpha(10),
        accessToken: fakerFR.string.alpha(10),
      });
      testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
        async () =>
          desInformationsUtilisateur().pourUnAidant(aidant).construis();
      testeurMAC.gestionnaireDeJeton.genereJeton = () => 'abc';
    });

    it('L’Aidant est redirigé vers le tableau de bord', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-authentification'
      );

      expect(reponse.statusCode).toStrictEqual(302);
      expect(reponse.headers['location']).toStrictEqual(
        '/mon-espace/tableau-de-bord'
      );
      const objet = enObjet<{ session: string; [clef: string]: string }>(
        (reponse.headers['set-cookie'] as string[])[1]
      );
      expect(
        JSON.parse(Buffer.from(objet.session, 'base64').toString()).token
      ).toStrictEqual('abc');
    });

    it("L'email renvoyé par ProConnect est traité en minuscules, permettant de ne pas créer de nouveau compte pour un email existant", async () => {
      const casseDifferente = 'Jean.Dupont@aidant.fr';

      testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
        async () =>
          desInformationsUtilisateur()
            .pourUnAidant(unAidant().avecUnEmail(casseDifferente).construis())
            .construis();

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-authentification'
      );

      expect(reponse.statusCode).toStrictEqual(302);
      expect(reponse.headers['location']).toStrictEqual(
        '/mon-espace/tableau-de-bord'
      );
    });

    it('Si la présence du cookie ProConnectInfo n’est pas validée, on envoie un message d’erreur d’authentification', async () => {
      utilitairesCookies.recuperateurDeCookies = () => undefined;
      donneesServeur = testeurMAC.initialise();

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-authentification'
      );

      expect(reponse.statusCode).toStrictEqual(302);
      expect(reponse.headers['location']).toStrictEqual(
        encodeURI(
          "/connexion?erreurConnexion=Un problème est survenu lors de l'obtention de vos données de connexion ProConnect ! Veuillez réessayer."
        )
      );
    });

    it('Si une erreur est rencontrée lors de l’échange avec ProConnect, on redirige vers la mire de connexion', async () => {
      testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur = () => {
        throw new Error('Erreur avec ProConnect');
      };
      donneesServeur = testeurMAC.initialise();

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-authentification'
      );

      expect(reponse.statusCode).toStrictEqual(302);
      expect(reponse.headers['location']).toStrictEqual(
        encodeURI(
          '/connexion?erreurConnexion=Un problème est survenu lors de la connexion à ProConnect !'
        )
      );
    });

    describe('Dans le cas d’un Aidant n’ayant pas validé les CGU', () => {
      beforeEach(async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-11-21T12:32:12'))
        );
        const aidant = unAidant().sansCGUSignees().construis();
        donneesServeur = testeurMAC.initialise();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        utilitairesCookies.recuperateurDeCookies = () =>
          'j%3A%7B%22state%22%3A%22etat%22%2C%22nonce%22%3A%22coucou%22%7D';
        testeurMAC.adaptateurProConnect.recupereJeton = async () => ({
          idToken: fakerFR.string.alpha(10),
          accessToken: fakerFR.string.alpha(10),
        });
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur().pourUnAidant(aidant).construis();
        testeurMAC.gestionnaireDeJeton.genereJeton = () => 'abc';
      });

      it('L’Aidant est redirigé vers la validation des CGU si elles ne sont pas signées', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        expect(reponse.statusCode).toStrictEqual(302);
        expect(reponse.headers['location']).toStrictEqual(
          '/mon-espace/valide-signature-cgu'
        );
      });
    });

    describe('Dans le cas d’un Aidant ayant validé les CGU avant le 31/01/205', () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-02-02T12:34:34'))
      );

      beforeEach(async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2025-02-04T14:45:23'))
        );
        const aidant = unAidant()
          .cguValideesLe(new Date(Date.parse('2025-01-14T14:32:00')))
          .construis();
        donneesServeur = testeurMAC.initialise();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        utilitairesCookies.recuperateurDeCookies = () =>
          'j%3A%7B%22state%22%3A%22etat%22%2C%22nonce%22%3A%22coucou%22%7D';
        testeurMAC.adaptateurProConnect.recupereJeton = async () => ({
          idToken: fakerFR.string.alpha(10),
          accessToken: fakerFR.string.alpha(10),
        });
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur().pourUnAidant(aidant).construis();
        testeurMAC.gestionnaireDeJeton.genereJeton = () => 'abc';
      });

      it('Redirige vers /mon-espace/mon-utilisation-du-service', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        expect(reponse.statusCode).toStrictEqual(302);
        expect(reponse.headers['location']).toStrictEqual(
          '/mon-espace/mon-utilisation-du-service'
        );
      });
    });

    describe("Dans le cas d'un gendarme", () => {
      adaptateurEnvironnement.siretsEntreprise = () => ({
        gendarmerie: () => '12345',
      });
      it("Si l'utilisateur n'est pas connu, on crée un espace Aidant", async () => {
        const aidant = unAidant()
          .avecUnEmail('jean.pierre@yomail.com')
          .construis();
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur()
              .pourUnAidant(aidant)
              .avecUnSiret('12345')
              .construis();

        await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        const aidantTrouve = await unServiceAidant(
          testeurMAC.entrepots.aidants()
        ).rechercheParMail(aidant.email);
        expect(aidantTrouve).toBeDefined();
        expect(aidantTrouve!.siret).toStrictEqual('12345');
      });

      it("Si l'utilisateur n'est pas connu, on crée un espace Aidant avec le mail en minuscule", async () => {
        const aidant = unAidant()
          .avecUnEmail('Jean.Pierre@yomail.com')
          .construis();
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur()
              .pourUnAidant(aidant)
              .avecUnSiret('12345')
              .construis();

        await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        const aidantTrouve = await unServiceAidant(
          testeurMAC.entrepots.aidants()
        ).rechercheParMail('jean.pierre@yomail.com');
        expect(aidantTrouve).toBeDefined();
      });

      it("À l'issue de la création de l'espace Aidant, l'utilisateur est redirigé vers la validation des CGU", async () => {
        const aidant = unAidant()
          .avecUnEmail('jean.dujardin@mail.com')
          .construis();
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur()
              .pourUnAidant(aidant)
              .avecUnSiret('12345')
              .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        expect(reponse.statusCode).toStrictEqual(302);
        expect(reponse.headers['location']).toStrictEqual(
          '/mon-espace/valide-signature-cgu'
        );
        const objet = enObjet<{ session: string; [clef: string]: string }>(
          (reponse.headers['set-cookie'] as string[])[1]
        );
        expect(
          JSON.parse(Buffer.from(objet.session, 'base64').toString()).token
        ).toStrictEqual('abc');
      });

      it("Redirige vers la validation des CGU dans le cas d'anciens Gendarmes", async () => {
        const aidant = unAidant()
          .avecUnEmail('jean.pierre@yomail.com')
          .cguValideesLe(new Date(Date.parse('2024-10-09T13:43:12')))
          .construis();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur()
              .pourUnAidant(aidant)
              .avecUnSiret('12345')
              .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        expect(reponse.statusCode).toStrictEqual(302);
        expect(reponse.headers['location']).toStrictEqual(
          '/mon-espace/valide-signature-cgu'
        );
      });
    });

    describe('Dans le cas d’un Utilisateur Inscrit', () => {
      it('Lorsque l’utilisateur est connu', async () => {
        const utilisateurInscrit = unUtilisateurInscrit()
          .avecUneDateDeSignatureDeCGU(
            new Date(Date.parse('2025-02-04T14:23:51'))
          )
          .construis();
        await testeurMAC.entrepots
          .utilisateursInscrits()
          .persiste(utilisateurInscrit);
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur()
              .pourUnUtilisateurInscrit(utilisateurInscrit)
              .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        expect(reponse.headers['location']).toStrictEqual(
          '/mon-espace/tableau-de-bord'
        );
      });

      it('Lorsque l’utilisateur n’a pas encore validé les CGU', async () => {
        const utilisateurInscrit = unUtilisateurInscrit()
          .sansValidationDeCGU()
          .construis();
        await testeurMAC.entrepots
          .utilisateursInscrits()
          .persiste(utilisateurInscrit);
        testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
          async () =>
            desInformationsUtilisateur()
              .pourUnUtilisateurInscrit(utilisateurInscrit)
              .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/pro-connect/apres-authentification'
        );

        expect(reponse.headers['location']).toStrictEqual(
          '/mon-espace/valide-signature-cgu'
        );
      });

      describe('Qui se connecte pour la première fois', () => {
        it('Crée un compte', async () => {
          testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
            async () => desInformationsUtilisateur().construis();

          const reponse = await executeRequete(
            donneesServeur.app,
            'GET',
            '/pro-connect/apres-authentification'
          );

          expect(reponse.headers['location']).toStrictEqual(
            '/mon-espace/inscription'
          );
          expect(
            await testeurMAC.entrepots.utilisateursInscrits().tous()
          ).toHaveLength(1);
        });

        it('Crée un compte en mettant le mail en minuscule', async () => {
          testeurMAC.adaptateurProConnect.recupereInformationsUtilisateur =
            async () =>
              desInformationsUtilisateur()
                .avecLeMail('Jean.DuponT@email.com')
                .construis();

          const reponse = await executeRequete(
            donneesServeur.app,
            'GET',
            '/pro-connect/apres-authentification'
          );

          expect(reponse.headers['location']).toStrictEqual(
            '/mon-espace/inscription'
          );
          expect(
            (await testeurMAC.entrepots.utilisateursInscrits().tous())[0].email
          ).toBe('jean.dupont@email.com');
        });
      });
    });
  });

  describe('Lorsqu’une requête GET est reçue sur /pro-connect/apres-deconnexion', () => {
    it('Nettoie le cookie et redirige vers la route /connexion', async () => {
      let sessionSupprimeeAppelee = false;
      utilitairesCookies.reinitialiseLaSession = () => {
        sessionSupprimeeAppelee = true;
      };
      utilitairesCookies.recuperateurDeCookies = () =>
        'j%3A%7B%22state%22%3A%22etat%22%2C%22nonce%22%3A%22coucou%22%7D';

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-deconnexion?state=etat'
      );

      const objet = enObjet<{ ProConnectInfo: string; [clef: string]: string }>(
        reponse.headers['set-cookie'] as string
      );
      expect(objet.ProConnectInfo).toBeUndefined();
      expect(sessionSupprimeeAppelee).toBe(true);
      expect(reponse.headers['location']).toStrictEqual('/connexion');
    });

    it('Vérifie l’état fourni par la requête avec la valeur conservée dans la session', async () => {
      utilitairesCookies.recuperateurDeCookies = () =>
        'j%3A%7B%22state%22%3A%22etat1%22%2C%22nonce%22%3A%22coucou%22%7D';

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-deconnexion?state=etat2'
      );

      expect(reponse.statusCode).toBe(401);
    });

    it('Retourne une 401 si il n’y a pas de cookie', async () => {
      utilitairesCookies.recuperateurDeCookies = () => undefined;

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/apres-deconnexion?state=etat2'
      );

      expect(reponse.statusCode).toBe(401);
    });
  });

  describe('Lorsqu’une requête GET est reçue sur /pro-connect/deconnexion', () => {
    it('Génère une demande de déconnexion', async () => {
      let demandeDeconnexionAppelee = false;
      utilitairesCookies.fabriqueDeCookies = () => ({ session: 'session' });
      utilitairesCookies.recuperateurDeCookies = () => 'cookie';
      utilitairesCookies.jwtPayload = () => ({
        identifiant: crypto.randomUUID(),
        estProconnect: true,
      });
      testeurMAC.adaptateurProConnect.genereDemandeDeconnexion = () => {
        demandeDeconnexionAppelee = true;
        return Promise.resolve({
          url: new URL('http://localhost/pro-connect/apres-deconnexion'),
          state: 'state',
        });
      };

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/deconnexion'
      );

      expect(reponse.statusCode).toBe(302);
      expect(demandeDeconnexionAppelee).toBe(true);
      expect(reponse.headers['location']).toStrictEqual(
        'http://localhost/pro-connect/apres-deconnexion'
      );
    });

    it('Une erreur 401 est renvoyée si l’utilisateur n’est pas connecté', async () => {
      utilitairesCookies.fabriqueDeCookies = () => {
        throw new Error('Ne doit pas passer');
      };
      utilitairesCookies.recuperateurDeCookies = () => undefined;

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/deconnexion'
      );

      expect(reponse.statusCode).toBe(401);
    });

    it('Une erreur 401 est renvoyée si l’utilisateur n’est pas connecté via ProConnect', async () => {
      utilitairesCookies.fabriqueDeCookies = () => ({ session: 'session' });
      utilitairesCookies.recuperateurDeCookies = () => 'cookie';
      utilitairesCookies.jwtPayload = () => ({
        identifiant: crypto.randomUUID(),
        estProconnect: false,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/deconnexion'
      );

      expect(reponse.statusCode).toBe(401);
    });
  });
});
