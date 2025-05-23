import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Express } from 'express';
import testeurIntegration from '../testeurIntegration';
import { executeRequete } from '../executeurRequete';
import {
  ReponseAPIAnnuaireAidants,
  ReponseAPIAnnuaireAidantsSucces,
} from '../../../src/api/annuaire-aidants/routeAPIAnnuaireAidants';
import {
  correze,
  departements,
  gironde,
} from '../../../src/gestion-demandes/departements';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  TypeAffichageAnnuaire,
  typesEntites,
} from '../../../src/espace-aidant/Aidant';

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
    const aidant = unAidant()
      .avecUnNomPrenom('Jean Dupont')
      .ayantConsentiPourLAnnuaire(TypeAffichageAnnuaire.PRENOM_N)
      .ayantPourDepartements([gironde])
      .construis();
    await testeurMAC.entrepots.aidants().persiste(aidant);

    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      `/api/annuaire-aidants?departement=${aidant.preferences.departements[0].nom}`
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
    const aidant = unAidant()
      .ayantPourDepartements([gironde, correze])
      .construis();
    const autreAidant = unAidant().ayantPourDepartements([correze]).construis();
    await testeurMAC.entrepots.aidants().persiste(aidant);
    await testeurMAC.entrepots.aidants().persiste(autreAidant);

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
          .avecUnNomPrenom('Jean DUPONT')
          .ayantPourDepartements([gironde])
          .ayantConsentiPourLAnnuaire(TypeAffichageAnnuaire.PRENOM_N)
          .construis();
        const autreAidant = unAidant()
          .ayantPourDepartements([correze])
          .construis();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        await testeurMAC.entrepots.aidants().persiste(autreAidant);

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
        const aidant = unAidant().ayantPourDepartements([gironde]).construis();
        const autreAidant = unAidant()
          .ayantPourDepartements([correze])
          .construis();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        await testeurMAC.entrepots.aidants().persiste(autreAidant);

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
          .ayantPourDepartements([departements[102]])
          .construis();
        const autreAidant = unAidant()
          .ayantPourDepartements([correze])
          .construis();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        await testeurMAC.entrepots.aidants().persiste(autreAidant);

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

    describe("Par type d'entité", () => {
      it("Retourne les Aidants ayant choisi un type d'entité", async () => {
        const organisationsPubliques = typesEntites[0];

        const aidant = unAidant()
          .avecUnNomPrenom('Jean DUPONT')
          .ayantPourDepartements([gironde])
          .ayantPourTypesEntite([organisationsPubliques])
          .ayantConsentiPourLAnnuaire(TypeAffichageAnnuaire.PRENOM_N)
          .construis();
        const autreAidant = unAidant()
          .ayantPourDepartements([gironde])
          .ayantConsentiPourLAnnuaire(TypeAffichageAnnuaire.PRENOM_N)
          .construis();
        await testeurMAC.entrepots.aidants().persiste(aidant);
        await testeurMAC.entrepots.aidants().persiste(autreAidant);

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/annuaire-aidants?departement=${encodeURIComponent('Gironde')}&typeEntite=${encodeURIComponent('Organisations publiques')}`
        );

        const reponseJson: ReponseAPIAnnuaireAidantsSucces =
          await reponse.json();
        expect(reponseJson.aidants).toStrictEqual([
          { identifiant: aidant.identifiant, nomPrenom: 'Jean D.' },
        ]);
      });
    });
  });
});
