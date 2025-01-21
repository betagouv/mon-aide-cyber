import { describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { ReponseAuthentification } from '../../src/api/routesAPIAuthentification';

import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../constructeurs/constructeursAidantUtilisateur';

describe("Le serveur MAC, sur les routes d'authentification", () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

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

      it('Génère un token', async () => {
        const constructeurUtilisateur = unUtilisateur()
          .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
          .avecUnMotDePasse('mon_Mot-D3p4sse')
          .avecUnNomPrenom('Martin Dupont');
        await unCompteAidantRelieAUnCompteUtilisateur({
          constructeurAidant: unAidant(),
          constructeurUtilisateur,
          entrepotAidant: testeurMAC.entrepots.aidants(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        });

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

      it("Retourne une erreur http 401 quand l'utilisateur n'est pas trouvé", async () => {
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

      it("L'identifiant de connexion est expurgé", async () => {
        const constructeurUtilisateur = unUtilisateur()
          .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
          .avecUnMotDePasse('mon_Mot-D3p4sse')
          .avecUnNomPrenom('Martin Dupont');
        await unCompteAidantRelieAUnCompteUtilisateur({
          constructeurAidant: unAidant(),
          constructeurUtilisateur,
          entrepotAidant: testeurMAC.entrepots.aidants(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        });

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

      it('Demande la signature des CGU si elles n’ont pas été signées', async () => {
        const constructeurUtilisateur = unUtilisateur()
          .avecUnIdentifiantDeConnexion('jean.dujardin@email.com')
          .avecUnMotDePasse('mon_Mot-D3p4sse')
          .avecUnNomPrenom('Jean Dujardin');
        await unCompteAidantRelieAUnCompteUtilisateur({
          constructeurAidant: unAidant().sansCGUSignees(),
          constructeurUtilisateur,
          entrepotAidant: testeurMAC.entrepots.aidants(),
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
          {
            identifiant: 'jean.dujardin@email.com',
            motDePasse: 'mon_Mot-D3p4sse',
          }
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual({
          nomPrenom: 'Jean Dujardin',
          liens: {
            'valider-signature-cgu': {
              methode: 'POST',
              url: '/api/utilisateur/valider-signature-cgu',
            },
          },
        });
      });
    });

    describe('Quand une requête DELETE est reçue', () => {
      it('Supprime le cookie de session', async () => {
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
