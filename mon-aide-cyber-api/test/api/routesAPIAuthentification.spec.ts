import { describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { ReponseAuthentification } from '../../src/api/routesAPIAuthentification';

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
          .aidants()
          .persiste(
            unAidant()
              .avecUnNomPrenom('Martin Dupont')
              .avecUnIdentifiantDeConnexion('martin.dupont@email.com')
              .avecUnMotDePasse('mon_Mot-D3p4sse')
              .construis(),
          );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
          {
            identifiant: 'martin.dupont@email.com',
            motDePasse: 'mon_Mot-D3p4sse',
          },
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual({
          nomPrenom: 'Martin Dupont',
          liens: {
            suite: { url: '/tableau-de-bord' },
            'lancer-diagnostic': {
              url: '/api/diagnostic',
              methode: 'POST',
            },
          },
        });
        const cookieRecu = (
          reponse.headers['set-cookie']! as string[]
        )[0].split('; ');
        expect(cookieRecu[0]).toStrictEqual(
          'session=eyJ0b2tlbiI6InVuLWpldG9uIn0=',
        );
        expect(cookieRecu[1]).toStrictEqual('path=/');
        expect(cookieRecu[3]).toStrictEqual('samesite=strict');
        expect(cookieRecu[4]).toStrictEqual('httponly');
      });

      it("retourne une erreur http 401 quand l'aidant n'est pas trouvé", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
          {
            identifiant: 'existe@pas.fr',
            motDePasse: 'mon_Mot-D3p4sse',
          },
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
              .construis(),
          );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/token',
          donneesServeur.portEcoute,
          {
            identifiant: 'MARTIN.DUPONT@EMAIL.COM',
            motDePasse: 'mon_Mot-D3p4sse',
          },
        );

        expect(reponse.statusCode).toBe(201);
        expect(await reponse.json()).toStrictEqual<ReponseAuthentification>({
          nomPrenom: 'Martin Dupont',
          liens: {
            suite: { url: '/tableau-de-bord' },
            'lancer-diagnostic': { url: '/api/diagnostic', methode: 'POST' },
          },
        });
      });
    });
  });
});
