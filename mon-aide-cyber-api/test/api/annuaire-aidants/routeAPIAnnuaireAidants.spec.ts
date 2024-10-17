import { afterEach, beforeEach, describe, expect } from 'vitest';
import { Express } from 'express';
import testeurIntegration from '../testeurIntegration';
import { executeRequete } from '../executeurRequete';
import {
  ReponseAPIAnnuaireAidants,
  ReponseAPIAnnuaireAidantsSucces,
} from '../../../src/api/annuaire-aidants/routeAPIAnnuaireAidants';
import { unAidant } from '../../annuaire-aidants/constructeurAidant';
import { departements } from '../../../src/gestion-demandes/departements';

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
    const aidant = unAidant().avecNomPrenom('Jean DUPONT').construis();
    await testeurMAC.entrepots.annuaireAidants().persiste(aidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire-aidants',
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    const reponseJson: ReponseAPIAnnuaireAidantsSucces = await reponse.json();
    expect(reponseJson.aidants).toStrictEqual([
      { identifiant: aidant.identifiant, nomPrenom: 'Jean D.' },
    ]);
    expect(reponseJson.departements).not.empty;
  });

  it('Retourne la liste des départements', async () => {
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire-aidants',
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    const reponseJson: ReponseAPIAnnuaireAidantsSucces = await reponse.json();
    expect(reponseJson.departements).toStrictEqual(
      departements.map((d) => ({ code: d.code, nom: d.nom }))
    );
  });

  it('Retourne le nombre d’Aidants', async () => {
    const aidant = unAidant().enGironde().construis();
    const autreAidant = unAidant().enCorreze().construis();
    await testeurMAC.entrepots.annuaireAidants().persiste(aidant);
    await testeurMAC.entrepots.annuaireAidants().persiste(autreAidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire-aidants',
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    const reponseJson: ReponseAPIAnnuaireAidantsSucces = await reponse.json();
    expect(reponseJson.nombreAidants).toStrictEqual(2);
  });

  describe('Lorsque l’on filtre', () => {
    describe('Par département', () => {
      it('Retourne un Aidant dans le département désiré', async () => {
        const aidant = unAidant()
          .avecNomPrenom('Jean DUPONT')
          .enGironde()
          .construis();
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
        const reponseJson: ReponseAPIAnnuaireAidantsSucces =
          await reponse.json();
        expect(reponseJson.aidants).toStrictEqual([
          { identifiant: aidant.identifiant, nomPrenom: 'Jean D.' },
        ]);
        expect(reponseJson.nombreAidants).toStrictEqual(1);
        expect(reponseJson.departements).not.empty;
      });

      it('Retourne les liens HATEOAS dans le corps de la réponse', async () => {
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
        const reponseJson: ReponseAPIAnnuaireAidants = await reponse.json();
        expect(reponseJson.liens).toStrictEqual({
          'afficher-annuaire-aidants': {
            url: '/api/annuaire-aidants',
            methode: 'GET',
          },
          'afficher-annuaire-aidants-parametre': {
            url: '/api/annuaire-aidants?departement=Gironde',
            methode: 'GET',
          },
        });
      });

      it('Valide le département passé en paramètre', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/annuaire-aidants?departement=Mauvais-département',
          donneesServeur.portEcoute
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message: 'Veuillez renseigner un département',
          liens: {
            'afficher-annuaire-aidants': {
              url: '/api/annuaire-aidants',
              methode: 'GET',
            },
          },
        });
      });
    });
  });
});
