import { afterEach, beforeEach, describe, expect } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { unReferentiel } from '../../constructeurs/constructeurReferentiel';
import { executeRequete } from '../executeurRequete';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import crypto from 'crypto';

describe('Le serveur MAC sur les routes /api/auto-diagnostic', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Quand une requête POST est reçue sur /', () => {
    it('Retourne une réponse 201 avec dans le header le lien vers le diagnostic créé', async () => {
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/auto-diagnostic',
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(201);
      expect(reponse.headers['link']).toMatch(
        /api\/auto-diagnostic\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it('Crée l’auto-diagnostic', async () => {
      const idAutoDiagnostic = crypto.randomUUID();
      adaptateurUUID.genereUUID = () => idAutoDiagnostic;
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/auto-diagnostic',
        donneesServeur.portEcoute
      );

      expect(
        await testeurMAC.entrepots.diagnostic().lis(idAutoDiagnostic)
      ).not.toBeUndefined();
      expect(reponse.headers['link']).toStrictEqual(
        `/api/auto-diagnostic/${idAutoDiagnostic}`
      );
    });
  });
});
