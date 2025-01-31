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
  let donneesServeur: { app: Express };

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
      `/api/annuaire-aidants?departement=${aidant.departements[0].nom}`
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
      '/api/annuaire-aidants'
    );

    expect(reponse.statusCode).toBe(200);
    const reponseJson: ReponseAPIAnnuaireAidantsSucces = await reponse.json();
    expect(reponseJson).toStrictEqual<ReponseAPIAnnuaireAidantsSucces>({
      departements: departements.map((d) => ({ code: d.code, nom: d.nom })),
      liens: {
        'afficher-annuaire-aidants': {
          methode: 'GET',
          url: '/api/annuaire-aidants',
        },
        'afficher-annuaire-aidants-parametre': {
          methode: 'GET',
          url: '/api/annuaire-aidants',
        },
      },
    });
  });

  it('Retourne le nombre d’Aidants', async () => {
    const aidant = unAidant().enGironde().enCorreze().construis();
    const autreAidant = unAidant().enCorreze().construis();
    await testeurMAC.entrepots.annuaireAidants().persiste(aidant);
    await testeurMAC.entrepots.annuaireAidants().persiste(autreAidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      '/api/annuaire-aidants?departement=Corrèze'
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
          '/api/annuaire-aidants?departement=Gironde'
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
          '/api/annuaire-aidants?departement=Gironde'
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
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        });
      });

      it('Encode le département dans les liens HATEOAS de la réponse', async () => {
        const aidant = unAidant()
          .dansLeDepartement(departements[102])
          .construis();
        const autreAidant = unAidant().enCorreze().construis();
        await testeurMAC.entrepots.annuaireAidants().persiste(aidant);
        await testeurMAC.entrepots.annuaireAidants().persiste(autreAidant);

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/annuaire-aidants?departement=Collectivit%C3%A9%20de%20Wallis%20%26%20Futuna'
        );

        expect(reponse.statusCode).toBe(200);
        const reponseJson: ReponseAPIAnnuaireAidants = await reponse.json();
        expect(reponseJson.liens).toStrictEqual({
          'afficher-annuaire-aidants': {
            url: '/api/annuaire-aidants',
            methode: 'GET',
          },
          'afficher-annuaire-aidants-parametre': {
            url: '/api/annuaire-aidants?departement=Collectivit%C3%A9%20de%20Wallis%20%26%20Futuna',
            methode: 'GET',
          },
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        });
      });

      it('Valide le département passé en paramètre', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/annuaire-aidants?departement=Mauvais-département'
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message: 'Veuillez renseigner un département.',
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
