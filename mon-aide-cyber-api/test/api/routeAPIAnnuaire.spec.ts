import { afterEach, beforeEach, describe, expect } from 'vitest';
import { executeRequete } from './executeurRequete';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { ReponseAPIAnnuaire } from '../../src/api/annuaire/routeAPIAnnuaire';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';

describe('le serveur MAC sur les routes /api/annuaire', () => {
  let testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC = testeurIntegration();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  it('Retourne un Aidant', async () => {
    const aidant = unAidant().ayantConsentiPourLAnnuaire().construis();
    testeurMAC.entrepots.aidants().persiste(aidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire',
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseAPIAnnuaire>([
      { nomPrenom: aidant.nomPrenom },
    ]);
  });

  it.skip('Besoin de réflexion autour du domaine Annuaire, retourne uniquement les Aidants ayant consenti à l’annuaire', async () => {
    const premierAidant = unAidant().ayantConsentiPourLAnnuaire().construis();
    const secondAidant = unAidant().construis();
    testeurMAC.entrepots.aidants().persiste(premierAidant);
    testeurMAC.entrepots.aidants().persiste(secondAidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire',
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseAPIAnnuaire>([
      { nomPrenom: premierAidant.nomPrenom },
    ]);
  });
});
