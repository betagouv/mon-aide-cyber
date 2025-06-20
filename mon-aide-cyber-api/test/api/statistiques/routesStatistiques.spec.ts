import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import { ReponseStatistiques } from '../../../src/api/statistiques/routesStatistiques';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';

describe('Le serveur MAC sur les routes /statistiques', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    testeurMAC.entrepots = new EntrepotsMemoire();
    donneesServeur = testeurMAC.initialise();
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Quand une requête GET est reçue sur /statistiques', () => {
    it('Appelle metabase pour retourner les statistiques', async () => {
      testeurMAC.adaptateurMetabase.retourStatistiques('metabase');

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/statistiques`
      );

      const corprDeReponse: ReponseStatistiques = await reponse.json();
      expect(corprDeReponse.metabase).toStrictEqual('metabase');
    });
  });
});
