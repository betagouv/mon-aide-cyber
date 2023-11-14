import { describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';

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
        testeurMAC.entrepots
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
        });
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
    });
  });
});
