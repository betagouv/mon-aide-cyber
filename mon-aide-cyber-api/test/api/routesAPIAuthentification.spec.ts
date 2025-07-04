import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { ReponseAuthentification } from '../../src/api/routesAPIAuthentification';

import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unCompteUtilisateurInscritRelieAUnCompteUtilisateur,
  unUtilisateur,
  unUtilisateurInscrit,
} from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { Response } from 'light-my-request';

describe("Le serveur MAC, sur les routes d'authentification", () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('/api/token/', () => {
    describe('Quand une requête POST est reçue', () => {
      beforeEach(() => {
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => testeurMAC.arrete());

      const expectCookie = (reponse: Response) => {
        const cookieRecu = (
          reponse.headers['set-cookie']! as string[]
        )[0].split('; ');
        expect(cookieRecu[0]).toStrictEqual(
          'session=eyJ0b2tlbiI6InVuLWpldG9uIn0='
        );
        expect(cookieRecu[1]).toStrictEqual('path=/');
        expect(cookieRecu[3]).toStrictEqual('samesite=strict');
        expect(cookieRecu[4]).toStrictEqual('httponly');
      };

      describe('Dans le cas d’un Aidant', () => {
        beforeEach(() => {
          FournisseurHorlogeDeTest.initialise(
            new Date(Date.parse('2025-01-31T10:00:00'))
          );
        });

        it('Génère un token', async () => {
          const constructeurUtilisateur =
            unUtilisateur().avecUnMotDePasse('mon_Mot-D3p4sse');
          await unCompteAidantRelieAUnCompteUtilisateur({
            constructeurAidant: unAidant()
              .avecUnEmail('martin.dupont@email.com')
              .avecUnNomPrenom('Martin Dupont'),
            constructeurUtilisateur,
            entrepotAidant: testeurMAC.entrepots.aidants(),
            entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          });

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/token',
            {
              identifiant: 'martin.dupont@email.com',
              motDePasse: 'mon_Mot-D3p4sse',
            }
          );

          expect(reponse.statusCode).toBe(201);
          expect(await reponse.json()).toStrictEqual({
            nomPrenom: 'Martin Dupont',
            email: 'martin.dupont@email.com',
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
                methode: 'DELETE',
                typeAppel: 'API',
                url: '/api/token',
              },
            },
          });
          expectCookie(reponse);
        });

        it('Redirige vers /mon-espace/mon-utilisation-du-service', async () => {
          const constructeurUtilisateur =
            unUtilisateur().avecUnMotDePasse('mon_Mot-D3p4sse');
          await unCompteAidantRelieAUnCompteUtilisateur({
            constructeurAidant: unAidant()
              .avecUnNomPrenom('Martin Dupont')
              .avecUnEmail('martin.dupont@email.com')
              .cguValideesLe(new Date(Date.parse('2024-12-12T20:00:00'))),
            constructeurUtilisateur,
            entrepotAidant: testeurMAC.entrepots.aidants(),
            entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          });

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/token',
            {
              identifiant: 'martin.dupont@email.com',
              motDePasse: 'mon_Mot-D3p4sse',
            }
          );

          expect(reponse.statusCode).toStrictEqual(201);
          expect(await reponse.json()).toStrictEqual({
            nomPrenom: 'Martin Dupont',
            email: 'martin.dupont@email.com',
            liens: {
              'valider-profil-utilisateur-inscrit': {
                methode: 'POST',
                url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
              },
              'rechercher-entreprise': {
                methode: 'GET',
                url: '/api/recherche-entreprise',
              },
              'valider-profil-aidant': {
                methode: 'POST',
                url: '/api/utilisateur/valider-profil-aidant',
              },
              'se-deconnecter': {
                methode: 'DELETE',
                typeAppel: 'API',
                url: '/api/token',
              },
            },
          });
          expectCookie(reponse);
        });
      });

      describe('Dans le cas d’un Utilisateur Inscrit', () => {
        it('Génère un token', async () => {
          const constructeurUtilisateur = unUtilisateur()
            .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
            .avecUnMotDePasse('mon_Mot-D3p4sse')
            .avecUnNomPrenom('Martin Dupont');
          await unCompteUtilisateurInscritRelieAUnCompteUtilisateur({
            constructeurUtilisateurInscrit:
              unUtilisateurInscrit().avecUneDateDeSignatureDeCGU(
                new Date(Date.parse('2025-03-03T00:00:00'))
              ),
            constructeurUtilisateur,
            entrepotUtilisateurInscrit:
              testeurMAC.entrepots.utilisateursInscrits(),
            entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
            adaptateurDeVerificationDeSession:
              testeurMAC.adaptateurDeVerificationDeSession,
          });

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/token',
            {
              identifiant: 'martin.dupont@email.com',
              motDePasse: 'mon_Mot-D3p4sse',
            }
          );

          expect(reponse.statusCode).toBe(201);
          expect(await reponse.json()).toStrictEqual({
            nomPrenom: 'Martin Dupont',
            email: 'martin.dupont@email.com',
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
                methode: 'DELETE',
                typeAppel: 'API',
                url: '/api/token',
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
          expectCookie(reponse);
        });
      });

      it("Retourne une erreur http 401 quand l'utilisateur n'est pas trouvé", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          {
            identifiant: 'existe@pas.fr',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(401);
        expect(await reponse.json()).toStrictEqual({
          message: 'Identifiants incorrects.',
        });
      });

      it("L'identifiant de connexion est expurgé", async () => {
        const constructeurUtilisateur =
          unUtilisateur().avecUnMotDePasse('mon_Mot-D3p4sse');
        await unCompteAidantRelieAUnCompteUtilisateur({
          constructeurAidant: unAidant()
            .avecUnNomPrenom('Martin Dupont')
            .avecUnEmail('martin.dupont@email.com'),
          constructeurUtilisateur,
          entrepotAidant: testeurMAC.entrepots.aidants(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          {
            identifiant: 'MARTIN.DUPONT@EMAIL.COM',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual<ReponseAuthentification>({
          nomPrenom: 'Martin Dupont',
          email: 'martin.dupont@email.com',
          liens: {
            'lancer-diagnostic': { url: '/api/diagnostic', methode: 'POST' },
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
              methode: 'DELETE',
              typeAppel: 'API',
              url: '/api/token',
            },
          },
        });
      });

      it('Demande la validation du profil si il s’agit d’un Aidant sans date de validation des CGU', async () => {
        const constructeurUtilisateur =
          unUtilisateur().avecUnMotDePasse('mon_Mot-D3p4sse');
        await unCompteAidantRelieAUnCompteUtilisateur({
          constructeurAidant: unAidant()
            .avecUnEmail('jean.dujardin@email.com')
            .avecUnNomPrenom('Jean Dujardin')
            .sansCGUSignees(),
          constructeurUtilisateur,
          entrepotAidant: testeurMAC.entrepots.aidants(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          {
            identifiant: 'jean.dujardin@email.com',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual({
          nomPrenom: 'Jean Dujardin',
          email: 'jean.dujardin@email.com',
          liens: {
            'valider-profil-utilisateur-inscrit': {
              methode: 'POST',
              url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
            },
            'rechercher-entreprise': {
              methode: 'GET',
              url: '/api/recherche-entreprise',
            },
            'valider-profil-aidant': {
              methode: 'POST',
              url: '/api/utilisateur/valider-profil-aidant',
            },
            'se-deconnecter': {
              methode: 'DELETE',
              typeAppel: 'API',
              url: '/api/token',
            },
          },
        });
        expectCookie(reponse);
      });

      it('Demande la validation du profil si les CGU sont antérieures à la date du nouveau parcours', async () => {
        const constructeurUtilisateur =
          unUtilisateur().avecUnMotDePasse('mon_Mot-D3p4sse');
        await unCompteAidantRelieAUnCompteUtilisateur({
          constructeurAidant: unAidant()
            .avecUnEmail('jean.dujardin@email.com')
            .avecUnNomPrenom('Jean Dujardin')
            .cguValideesLe(new Date(Date.parse('2024-12-24T14:32:12'))),
          constructeurUtilisateur,
          entrepotAidant: testeurMAC.entrepots.aidants(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          {
            identifiant: 'jean.dujardin@email.com',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual({
          nomPrenom: 'Jean Dujardin',
          email: 'jean.dujardin@email.com',
          liens: {
            'valider-profil-utilisateur-inscrit': {
              methode: 'POST',
              url: '/api/utilisateur/valider-profil-utilisateur-inscrit',
            },
            'rechercher-entreprise': {
              methode: 'GET',
              url: '/api/recherche-entreprise',
            },
            'valider-profil-aidant': {
              methode: 'POST',
              url: '/api/utilisateur/valider-profil-aidant',
            },
            'se-deconnecter': {
              methode: 'DELETE',
              typeAppel: 'API',
              url: '/api/token',
            },
          },
        });
        expectCookie(reponse);
      });
    });

    describe('Quand une requête DELETE est reçue', () => {
      it('Supprime le cookie de session', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'DELETE',
          '/api/token',
          undefined,
          { 'set-cookie': [] }
        );

        expect(reponse.statusCode).toBe(200);
        expect(testeurMAC.adaptateurDeGestionDeCookies.aSupprime).toBe(true);
      });
    });
  });
});
