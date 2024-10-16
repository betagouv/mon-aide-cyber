import { afterEach, beforeEach, describe, expect } from 'vitest';
import { Express } from 'express';
import testeurIntegration from '../testeurIntegration';
import { executeRequete } from '../executeurRequete';
import { ReponseAPIAnnuaireAidants } from '../../../src/api/annuaire-aidants/routeAPIAnnuaireAidants';
import { unAidant } from '../../annuaire-aidants/constructeurAidant';

describe('le serveur MAC sur les routes /api/annuaire-aidant', () => {
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
    const aidant = unAidant().construis();
    await testeurMAC.entrepots.annuaireAidants().persiste(aidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire-aidants',
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    const newVar = await reponse.json();
    expect(newVar).toStrictEqual<ReponseAPIAnnuaireAidants>([
      { identifiant: aidant.identifiant, nomPrenom: aidant.nomPrenom },
    ]);
  });

  describe('Lorsque l’on filtre', () => {
    describe('Par département', () => {
      it('Retourne un Aidant dans le département désiré', async () => {
        const aidant = unAidant().enGironde().construis();
        const autreAidant = unAidant().enCorreze().construis();
        await testeurMAC.entrepots.annuaireAidants().persiste(aidant);
        await testeurMAC.entrepots.annuaireAidants().persiste(autreAidant);

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/annuaire-aidants?departement=Gironde',
          donneesServeur.portEcoute
        );

        expect(reponse.statusCode).toBe(200);
        const newVar = await reponse.json();
        expect(newVar).toStrictEqual<ReponseAPIAnnuaireAidants>([
          { identifiant: aidant.identifiant, nomPrenom: aidant.nomPrenom },
        ]);
      });
    });
  });
});
