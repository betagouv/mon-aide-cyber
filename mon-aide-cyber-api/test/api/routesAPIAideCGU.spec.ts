import { describe, expect, it } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Le serveur MAC, sur les routes CGU Aidé', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('/api/aide/cgu', () => {
    describe('Quand une requête POST est reçue', () => {
      it('Valide les CGU de l’aidé', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-29T14:04:17+01:00')),
        );
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/aide/cgu',
          donneesServeur.portEcoute,
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: '33000',
            raisonSociale: 'beta-gouv',
          },
        );

        expect(reponse.statusCode).toBe(202);
        const aides = await testeurMAC.entrepots.aides().tous();
        expect(aides).toHaveLength(1);
        expect(aides[0].dateSignatureCGU).toStrictEqual(
          FournisseurHorloge.maintenant(),
        );
      });
    });
  });
});
