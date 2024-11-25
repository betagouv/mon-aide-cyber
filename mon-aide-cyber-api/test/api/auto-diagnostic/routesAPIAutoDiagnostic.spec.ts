import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import {
  uneQuestion,
  unReferentiel,
} from '../../constructeurs/constructeurReferentiel';
import { executeRequete } from '../executeurRequete';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import crypto from 'crypto';
import { unDiagnostic } from '../../constructeurs/constructeurDiagnostic';
import { RepresentationDiagnostic } from '../../../src/api/representateurs/types';
import { ReponseDiagnostic } from '../../../src/api/routesAPIDiagnostic';
import { Diagnostic } from '../../../src/diagnostic/Diagnostic';
import { LiensHATEOAS } from '../../../src/api/hateoas/hateoas';
import { CorpsReponseCreerAutoDiagnosticEnErreur } from '../../../src/api/auto-diagnostic/routesAPIAutoDiagnostic';

describe('Le serveur MAC sur les routes /api/auto-diagnostic', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Quand une requête POST est reçue sur /', () => {
    it('Retourne une réponse 201 avec dans le header le lien vers le diagnostic créé', async () => {
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/auto-diagnostic',
        donneesServeur.portEcoute,
        { email: 'jean.dujardin@email.com', cguSignees: true }
      );

      expect(reponse.statusCode).toBe(201);
      expect(reponse.headers['link']).toMatch(
        /api\/auto-diagnostic\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it('Crée l’auto-diagnostic', async () => {
      const idAutoDiagnostic = crypto.randomUUID();
      adaptateurUUID.genereUUID = () => idAutoDiagnostic;
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/auto-diagnostic',
        donneesServeur.portEcoute,
        { email: 'jean.dupont@mail.com', cguSignees: true }
      );

      expect(
        await testeurMAC.entrepots.diagnostic().lis(idAutoDiagnostic)
      ).not.toBeUndefined();
      expect(reponse.headers['link']).toStrictEqual(
        `/api/auto-diagnostic/${idAutoDiagnostic}`
      );
    });

    describe('Lors de la phase de validation', () => {
      it('Valide la présence de l’email', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/auto-diagnostic',
          donneesServeur.portEcoute,
          { email: '', cguSignees: true }
        );

        expect(reponse.statusCode).toBe(422);
        expect(
          await reponse.json()
        ).toStrictEqual<CorpsReponseCreerAutoDiagnosticEnErreur>({
          message: 'Veuillez renseigner votre e-mail.',
          liens: {
            'creer-auto-diagnostic': {
              url: '/api/auto-diagnostic',
              methode: 'POST',
            },
          },
        });
      });

      it('Valide la signature des CGU', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/auto-diagnostic',
          donneesServeur.portEcoute,
          { email: 'jean.dupont@mail.com' }
        );

        expect(reponse.statusCode).toBe(422);
        expect(
          await reponse.json()
        ).toStrictEqual<CorpsReponseCreerAutoDiagnosticEnErreur>({
          message: 'Veuillez signer les CGU.',
          liens: {
            'creer-auto-diagnostic': {
              url: '/api/auto-diagnostic',
              methode: 'POST',
            },
          },
        });
      });
    });
  });

  describe('Quand une requête GET est reçue sur /', () => {
    it('Retourne le diagnostic', async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(uneQuestion().construis())
            .construis()
        )
        .construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/auto-diagnostic/${diagnostic.identifiant}`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      const diagnosticRecu: RepresentationDiagnostic = await reponse.json();
      expect(diagnosticRecu).toStrictEqual<ReponseDiagnostic>(
        forgeReponseDiagnostic(diagnostic, {
          'repondre-diagnostic': {
            url: `/api/auto-diagnostic/${diagnostic.identifiant}`,
            methode: 'PATCH',
          },
        })
      );
    });

    it("Renvoie une erreur HTTP 404 diagnostic non trouvé si le diagnostic n'existe pas", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/auto-diagnostic/id-inexistant`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(404);
      const newVar = await reponse.json();
      expect(newVar).toStrictEqual({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });

    it('Vérifie que le diagnostic n’est pas un diagnostic en libre accès', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/auto-diagnostic/${crypto.randomUUID()}`,
        donneesServeur.portEcoute
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste()
      ).toBe(true);
    });
  });
});

const forgeReponseDiagnostic = (
  diagnostic: Diagnostic,
  liens: LiensHATEOAS,
  reponseDonnee?: string
): ReponseDiagnostic => {
  return {
    identifiant: diagnostic.identifiant,
    referentiel: {
      contexte: {
        description: 'Description du contexte',
        libelle: 'Contexte',
        styles: {
          navigation: 'navigation-contexte',
        },
        localisationIllustration: '/chemin/illustration/contexte',
        groupes: [
          {
            numero: 1,
            questions: diagnostic.referentiel.contexte.questions.map((q) => {
              return {
                identifiant: q.identifiant,
                libelle: q.libelle,
                reponseDonnee: {
                  valeur: reponseDonnee ? reponseDonnee : null,
                  reponses: [],
                },
                reponsesPossibles: q.reponsesPossibles.map((r) => {
                  return {
                    identifiant: r.identifiant,
                    libelle: r.libelle,
                    ordre: r.ordre,
                  };
                }),
                type: 'choixUnique',
              };
            }),
          },
        ],
      },
    },
    liens,
  };
};
