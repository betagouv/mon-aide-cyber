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
import {
  RepresentationDiagnostic,
  RepresentationReferentiel,
} from '../../src/api/representateurs/types';
import { Express } from 'express';

describe('le serveur MAC sur les routes /api/diagnostic', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /{id}', () => {
    it('retourne le référentiel du diagnostic', async () => {
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
      expect(diagnosticRecu.identifiant).toBe(diagnostic.identifiant);
      expect(
        diagnosticRecu.referentiel,
      ).toStrictEqual<RepresentationReferentiel>({
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
          libelle: 'Contexte',
          localisationIconeNavigation: '/chemin/icone/contexte',
          localisationIllustration: '/chemin/illustration/contexte',
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
      });
    });

    it("renvoie une erreur HTTP 404 diagnostic non trouvé si le diagnostic n'existe pas", async () => {
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

    it('la route est protégée', async () => {
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
  });

  describe('quand une requête POST est reçue', () => {
    it('lance un nouveau diagnostic', async () => {
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

    it('on peut récupérer le diagnostic précédemment lancé', async () => {
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
      expect(diagnosticRetourne.referentiel.contexte.questions).toHaveLength(1);
    });

    it("retourne une erreur HTTP 500 lorsque le référentiel n'est pas trouvé", async () => {
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

    it('la route est protégée', async () => {
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
  });

  describe('quand une requête PATCH est reçue sur /{id}', () => {
    it('on peut donner une réponse à une question', async () => {
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

    it('retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
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

    it('la route est protégée', async () => {
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
  });

  describe('quand une requête GET est reçue sur /{id}/termine', () => {
    it('génère les recommandations', async () => {
      let adaptateurPDFAppele = false;
      testeurMAC.adaptateurDeRestitution.genereRestitution = () => {
        adaptateurPDFAppele = true;
        return Promise.resolve(Buffer.from('PDF Recommandations généré'));
      };
      const diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${diagnostic.identifiant}/termine`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.headers['content-type']).toBe('application/pdf');
      expect(adaptateurPDFAppele).toBe(true);
    });

    it('retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/termine`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toMatchObject({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });

    it('la route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/termine`,
        donneesServeur.portEcoute,
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
    });
  });
});
