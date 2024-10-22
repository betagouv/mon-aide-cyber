import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import { unAidant } from '../../authentification/constructeurs/constructeurAidant';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';
import { ReponseDemandeSolliciterAideEnErreur } from '../../../src/api/demandes/routesAPIDemandeSolliciterAide';

describe('Le serveur MAC, sur les routes de sollicitation d’aide de la part de l’Aidé pour un Aidant donné', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête POST est reçue', () => {
    it('Traite la demande de sollicitation de l’Aidé', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        donneesServeur.portEcoute,
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Corse-du-Sud',
          raisonSociale: 'beta-gouv',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(202);
      const aides = await testeurMAC.entrepots.aides().tous();
      expect(aides).toHaveLength(1);
      expect(aides[0].dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant()
      );
    });

    it('Valide l’Aidant', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        donneesServeur.portEcoute,
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Corse-du-Sud',
          raisonSociale: 'beta-gouv',
          aidantSollicite: crypto.randomUUID(),
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message: 'L’Aidant demandé n’existe pas.',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });

    it('Valide le département', async () => {
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        donneesServeur.portEcoute,
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Département-inconnu',
          raisonSociale: 'beta-gouv',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message: 'Veuillez renseigner un département',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });
  });
});
