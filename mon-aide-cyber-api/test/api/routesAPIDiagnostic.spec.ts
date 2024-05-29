import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import crypto from 'crypto';
import testeurIntegration from './testeurIntegration';
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { executeRequete } from './executeurRequete';
import { RepresentationDiagnostic } from '../../src/api/representateurs/types';
import { Express } from 'express';
import { unAdaptateurDeRestitutionHTML } from '../adaptateurs/ConstructeurAdaptateurRestitutionHTML';
import { uneRestitution } from '../constructeurs/constructeurRestitution';
import {
  ReponseDiagnostic,
  ReprensentationRestitution,
} from '../../src/api/routesAPIDiagnostic';
import { ProcesseurPDFDeTest } from '../infrastructure/processus/processeurs';

describe('Le serveur MAC sur les routes /api/diagnostic', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Quand une requête GET est reçue sur /{id}', () => {
    it('Retourne le référentiel du diagnostic', async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(uneQuestion().construis())
            .construis(),
        )
        .construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${diagnostic.identifiant}`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      const premiereQuestion = diagnostic.referentiel.contexte.questions[0];
      const premiereReponsePossible = premiereQuestion.reponsesPossibles[0];
      const diagnosticRecu: RepresentationDiagnostic = await reponse.json();
      expect(diagnosticRecu).toStrictEqual<ReponseDiagnostic>({
        actions: [
          {
            contexte: {
              action: 'repondre',
              ressource: {
                methode: 'PATCH',
                url: `/api/diagnostic/${diagnostic.identifiant}`,
              },
            },
          },
        ],
        identifiant: diagnostic.identifiant,
        referentiel: {
          contexte: {
            actions: [
              {
                action: 'repondre',
                chemin: 'contexte',
                ressource: {
                  methode: 'PATCH',
                  url: `/api/diagnostic/${diagnostic.identifiant}`,
                },
              },
            ],
            description: 'Description du contexte',
            libelle: 'Contexte',
            styles: {
              navigation: 'navigation-contexte',
            },
            localisationIllustration: '/chemin/illustration/contexte',
            groupes: [
              {
                numero: 1,
                questions: [
                  {
                    identifiant: premiereQuestion.identifiant,
                    libelle: premiereQuestion.libelle,
                    reponseDonnee: {
                      valeur: null,
                      reponses: [],
                    },
                    reponsesPossibles: [
                      {
                        identifiant: premiereReponsePossible.identifiant,
                        libelle: premiereReponsePossible.libelle,
                        ordre: 0,
                      },
                    ],
                    type: 'choixUnique',
                  },
                ],
              },
            ],
          },
        },
        liens: {
          [`afficher-diagnostic-${diagnostic.identifiant}`]: {
            url: `/api/diagnostic/${diagnostic.identifiant}/restitution`,
            methode: 'GET',
          },
          'afficher-tableau-de-bord': {
            url: '/api/espace-aidant/tableau-de-bord',
            methode: 'GET',
          },
        },
      });
    });

    it("Renvoie une erreur HTTP 404 diagnostic non trouvé si le diagnostic n'existe pas", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/id-inexistant`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(404);
      const newVar = await reponse.json();
      expect(newVar).toStrictEqual({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });

    it('Vérifie que l’Aidant peut accéder au diagnostic', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste(),
      ).toBe(true);
    });
  });

  describe('Quand une requête POST est reçue', () => {
    it('Lance un nouveau diagnostic', async () => {
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/diagnostic',
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(201);
      expect(reponse.headers['link']).toMatch(
        /api\/diagnostic\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it('On peut récupérer le diagnostic précédemment lancé', async () => {
      const referentiel = unReferentiel()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);
      const reponseCreation = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/diagnostic',
        donneesServeur.portEcoute,
      );
      const lien = reponseCreation.headers['link'] as string;

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `${lien}`,
        donneesServeur.portEcoute,
      );

      const diagnosticRetourne = await reponse.json();
      expect(diagnosticRetourne.identifiant).toBe(
        lien?.substring(lien.lastIndexOf('/') + 1),
      );
      expect(diagnosticRetourne.referentiel.contexte.groupes).toHaveLength(1);
    });

    it("Retourne une erreur HTTP 500 lorsque le référentiel n'est pas trouvé", async () => {
      testeurMAC.adaptateurReferentiel.reInitialise();
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/diagnostic',
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(500);
      expect(await reponse.json()).toMatchObject({
        message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
      });
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/diagnostic/`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/diagnostic/`,
        donneesServeur.portEcoute,
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });
  });

  describe('Quand une requête PATCH est reçue sur /{id}', () => {
    it('On peut donner une réponse à une question', async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Une question ?')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('Réponse 1').construis(),
                  uneReponsePossible().avecLibelle('Réponse 2').construis(),
                ])
                .construis(),
            )
            .construis(),
        )
        .construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/${diagnostic.identifiant}`,
        donneesServeur.portEcoute,
        {
          chemin: 'contexte',
          identifiant: 'une-question-',
          reponse: 'reponse-2',
        },
      );

      const diagnosticRetourne = await testeurMAC.entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(reponse.statusCode).toBe(204);
      expect(
        diagnosticRetourne.referentiel.contexte.questions[0].reponseDonnee,
      ).toStrictEqual({
        reponsesMultiples: [],
        reponseUnique: 'reponse-2',
      });
    });

    it('Retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
        {
          chemin: 'contexte',
          identifiant: 'une-question-',
          reponse: 'reponse-2',
        },
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toMatchObject({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });

    it('Vérifie que l’Aidant peut répondre au diagnostic', async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste(),
      ).toBe(true);
    });
  });

  describe('Quand une requête GET est reçue sur /{id}/restitution', () => {
    it('Retourne la restitution', async () => {
      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecIndicateurs('indicateurs')
        .avecMesuresPrioritaires('mesures prioritaires')
        .avecAutresMesures('autres mesures')
        .construis();
      testeurMAC.adaptateursRestitution.html = () =>
        adaptateurDeRestitutionHTML;
      const identifiant = crypto.randomUUID();
      const restitution = uneRestitution()
        .avecIdentifiant(identifiant)
        .construis();
      await testeurMAC.entrepots.restitution().persiste(restitution);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${identifiant}/restitution`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReprensentationRestitution>({
        liens: {
          'lancer-diagnostic': {
            methode: 'POST',
            url: '/api/diagnostic',
          },
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/espace-aidant/tableau-de-bord',
          },
          'modifier-diagnostic': {
            url: `/diagnostic/${identifiant}`,
          },
          'restitution-json': {
            contentType: 'application/json',
            methode: 'GET',
            url: `/api/diagnostic/${identifiant}/restitution`,
          },
          'restitution-pdf': {
            contentType: 'application/pdf',
            methode: 'GET',
            url: `/api/diagnostic/${identifiant}/restitution`,
          },
          'afficher-profil': {
            url: '/api/profil',
            methode: 'GET',
          },
        },
        autresMesures: '',
        indicateurs: 'indicateurs',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: 'mesures prioritaires',
      });
    });

    it('Retourne la restitution au format PDF', async () => {
      const processeurPDF = new ProcesseurPDFDeTest();
      testeurMAC.processeurs.pdf = () => processeurPDF;
      const restitution = uneRestitution().construis();
      testeurMAC.entrepots.restitution().persiste(restitution);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${restitution.identifiant}/restitution`,
        donneesServeur.portEcoute,
        undefined,
        { accept: 'application/pdf' },
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.headers['content-type']).toBe('application/pdf');
      expect(processeurPDF.aEteExecute()).toBe(true);
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/restitution`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/restitution`,
        donneesServeur.portEcoute,
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });

    it('Retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/restitution`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toMatchObject({
        message: "Le restitution demandé n'existe pas.",
      });
    });

    it('Vérifie que l’Aidant peut accéder à la restitution', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47/restitution`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste(),
      ).toBe(true);
    });
  });
});
