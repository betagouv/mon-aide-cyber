import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { Express } from 'express';

describe('le serveur MAC sur la route /api/diagnostics', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue', () => {
    it('retourne la liste de diagnostics ', async () => {
      const premierDiagnostic = unDiagnostic().construis();
      const deuxiemeDiagnostic = unDiagnostic().construis();
      const troisiemeDiagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(premierDiagnostic);
      await testeurMAC.entrepots.diagnostic().persiste(deuxiemeDiagnostic);
      await testeurMAC.entrepots.diagnostic().persiste(troisiemeDiagnostic);

      const reponse = await executeRequete(donneesServeur.app, 'GET', '/api/diagnostics', donneesServeur.portEcoute);

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual([
        {
          identifiant: premierDiagnostic.identifiant,
          actions: [{ details: `/api/diagnostic/${premierDiagnostic.identifiant}` }],
        },
        {
          identifiant: deuxiemeDiagnostic.identifiant,
          actions: [
            {
              details: `/api/diagnostic/${deuxiemeDiagnostic.identifiant}`,
            },
          ],
        },
        {
          identifiant: troisiemeDiagnostic.identifiant,
          actions: [
            {
              details: `/api/diagnostic/${troisiemeDiagnostic.identifiant}`,
            },
          ],
        },
      ]);
    });

    it('la route est protégée', async () => {
      await executeRequete(donneesServeur.app, 'GET', `/api/diagnostics/`, donneesServeur.portEcoute);

      expect(testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
    });
  });
});
