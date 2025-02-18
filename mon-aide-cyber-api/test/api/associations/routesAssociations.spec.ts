import { beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { adaptateurAssociations } from '../../../src/adaptateurs/adaptateurAssociations';
import { Association } from '../../../src/api/associations/routesAssociations';

describe('Le serveur MAC, sur les routes de récupération des associations', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  describe('Lorsqu’une requête GET est reçue sur /associations', () => {
    it('Retourne la liste des associations', async () => {
      adaptateurAssociations.referentiel = () => [
        { nom: 'Mon asso', siteUrl: 'https://monaide.cyber.gouv.fr' },
      ];
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/associations'
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<Association[]>([
        {
          nom: 'Mon asso',
          siteUrl: 'https://monaide.cyber.gouv.fr',
        },
      ]);
    });

    it('Retourne une erreur si on obtient pas le référentiel', async () => {
      adaptateurAssociations.referentiel = () => {
        throw new Error('Erreur de lecture référentiel associatif');
      };

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/associations'
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: 'Erreur de lecture référentiel associatif',
      });
    });
  });
});
