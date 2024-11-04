import { describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { unAidant } from '../espace-aidant/constructeurs/constructeurAidant';
import { ReponseAuthentification } from '../../src/api/routesAPIAuthentification';
import { unUtilisateur } from '../authentification/constructeurs/constructeurUtilisateur';

describe("Le serveur MAC, sur les routes d'authentification", () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('/api/token/', () => {
    describe('Quand une requête POST est reçue', () => {
      it('génère un token', async () => {
        await testeurMAC.entrepots
          .utilisateurs()
          .persiste(
            unUtilisateur()
              .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
              .avecUnMotDePasse('mon_Mot-D3p4sse')
              .avecUnNomPrenom('Martin Dupont')
              .construis()
          );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
          {
            identifiant: 'martin.dupont@email.com',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual({
          nomPrenom: 'Martin Dupont',
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
        const cookieRecu = (
          reponse.headers['set-cookie']! as string[]
        )[0].split('; ');
        expect(cookieRecu[0]).toStrictEqual(
          'session=eyJ0b2tlbiI6InVuLWpldG9uIn0='
        );
        expect(cookieRecu[1]).toStrictEqual('path=/');
        expect(cookieRecu[3]).toStrictEqual('samesite=strict');
        expect(cookieRecu[4]).toStrictEqual('httponly');
      });

      it("retourne une erreur http 401 quand l'utilisateur n'est pas trouvé", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
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

      it("l'identifiant de connexion est expurgé", async () => {
        await testeurMAC.entrepots
          .aidants()
          .persiste(
            unAidant()
              .avecUnNomPrenom('Martin Dupont')
              .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
              .avecUnMotDePasse('mon_Mot-D3p4sse')
              .construis()
          );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
          {
            identifiant: 'MARTIN.DUPONT@EMAIL.COM',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual<ReponseAuthentification>({
          nomPrenom: 'Martin Dupont',
          liens: {
            'lancer-diagnostic': { url: '/api/diagnostic', methode: 'POST' },
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

      describe("dans le cas où un utilisateur n'a pas encore d'espace aidant", () => {
        it("renvoie un lien pour créer l'espace Aidant", async () => {
          await testeurMAC.entrepots
            .utilisateurs()
            .persiste(
              unUtilisateur()
                .avecUnNomPrenom('Jean Dupont')
                .avecUnIdentifiantDeConnexion('jean.dupont@email.com')
                .avecUnMotDePasse('mon_Mot-D3p4sse')
                .sansCGUSignees()
                .construis()
            );

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/token',
            donneesServeur.portEcoute,
            {
              identifiant: 'jean.dupont@email.com',
              motDePasse: 'mon_Mot-D3p4sse',
            }
          );

          expect(reponse.statusCode).toBe(201);
          expect(await reponse.json()).toStrictEqual<ReponseAuthentification>({
            nomPrenom: 'Jean Dupont',
            liens: {
              'creer-espace-aidant': {
                url: '/api/espace-aidant/cree',
                methode: 'POST',
              },
            },
          });
        });
      });
    });

    describe('Quand une requête DELETE est reçue', () => {
      it('supprime le cookie de session', async () => {
        await testeurMAC.entrepots
          .aidants()
          .persiste(
            unAidant()
              .avecUnNomPrenom('Martin Dupont')
              .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
              .avecUnMotDePasse('mon_Mot-D3p4sse')
              .construis()
          );

        const reponse = await executeRequete(
          donneesServeur.app,
          'DELETE',
          '/api/token',
          donneesServeur.portEcoute,
          undefined,
          { 'set-cookie': [] }
        );

        expect(reponse.statusCode).toBe(200);
        expect(testeurMAC.adaptateurDeGestionDeCookies.aSupprime).toBe(true);
      });
    });
  });
});
