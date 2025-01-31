import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../../constructeurs/constructeurReferentiel';
import { executeRequete } from '../executeurRequete';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import crypto from 'crypto';
import { unDiagnostic } from '../../constructeurs/constructeurDiagnostic';
import { RepresentationDiagnostic } from '../../../src/api/representateurs/types';
import {
  ReponseDiagnostic,
  RepresentationRestitution,
} from '../../../src/api/routesAPIDiagnostic';
import { Diagnostic } from '../../../src/diagnostic/Diagnostic';
import {
  LiensHATEOAS,
  ReponseHATEOASEnErreur,
} from '../../../src/api/hateoas/hateoas';
import { CorpsReponseCreerDiagnosticLibreAccesEnErreur } from '../../../src/api/diagnostic-libre-acces/routesAPIDiagnosticLibreAcces';
import { unAdaptateurDeRestitutionHTML } from '../../adaptateurs/ConstructeurAdaptateurRestitutionHTML';
import { uneRestitution } from '../../constructeurs/constructeurRestitution';
import { unAdaptateurRestitutionPDF } from '../../adaptateurs/ConstructeurAdaptateurRestitutionPDF';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { add } from 'date-fns';

describe('Le serveur MAC sur les routes /api/diagnostic-libre-acces', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurDeVerificationDeRelations.reinitialise();
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
        '/api/diagnostic-libre-acces',
        {
          email: 'jean.dujardin@email.com',
          cguSignees: true,
        }
      );

      expect(reponse.statusCode).toBe(201);
      expect(reponse.headers['link']).toMatch(
        /api\/diagnostic-libre-acces\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it('Crée le diagnostic en libre accès', async () => {
      const idAutoDiagnostic = crypto.randomUUID();
      adaptateurUUID.genereUUID = () => idAutoDiagnostic;
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/diagnostic-libre-acces',
        {
          email: 'jean.dupont@mail.com',
          cguSignees: true,
        }
      );

      expect(
        await testeurMAC.entrepots.diagnostic().lis(idAutoDiagnostic)
      ).not.toBeUndefined();
      expect(reponse.headers['link']).toStrictEqual(
        `/api/diagnostic-libre-acces/${idAutoDiagnostic}`
      );
    });

    describe('Lors de la phase de validation', () => {
      it('Valide la signature des CGU', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/diagnostic-libre-acces',
          { email: 'jean.dupont@mail.com' }
        );

        expect(reponse.statusCode).toBe(422);
        expect(
          await reponse.json()
        ).toStrictEqual<CorpsReponseCreerDiagnosticLibreAccesEnErreur>({
          message: 'Veuillez signer les CGU.',
          liens: {
            'creer-diagnostic': {
              url: '/api/diagnostic-libre-acces',
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
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}`
      );

      expect(reponse.statusCode).toBe(200);
      const diagnosticRecu: RepresentationDiagnostic = await reponse.json();
      expect(diagnosticRecu).toStrictEqual<ReponseDiagnostic>(
        forgeReponseDiagnostic(diagnostic, {
          'repondre-diagnostic': {
            url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}`,
            methode: 'PATCH',
          },
          [`afficher-diagnostic-${diagnostic.identifiant}`]: {
            url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}/restitution`,
            methode: 'GET',
          },
        })
      );
    });

    it("Renvoie une erreur HTTP 404 diagnostic non trouvé si le diagnostic n'existe pas", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/id-inexistant`
      );

      expect(reponse.statusCode).toBe(404);
      const corps = await reponse.json();
      expect(corps).toStrictEqual<ReponseHATEOASEnErreur>({
        liens: {
          'creer-diagnostic': {
            url: '/api/diagnostic-libre-acces',
            methode: 'POST',
          },
        },
        message: "Le diagnostic demandé n'existe pas.",
      });
    });

    it('Vérifie que le diagnostic est un diagnostic en libre accès', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${crypto.randomUUID()}`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste()
      ).toBe(true);
    });

    it('Vérifie que le diagnostic date de moins de 7 jours', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { days: 7 })
      );
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}`
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        liens: {
          'creer-diagnostic': {
            url: '/api/diagnostic-libre-acces',
            methode: 'POST',
          },
        },
        message: "Le diagnostic demandé n'existe pas.",
      });
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
                .construis()
            )
            .construis()
        )
        .construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}`,
        {
          chemin: 'contexte',
          identifiant: 'une-question-',
          reponse: 'reponse-2',
        }
      );

      const diagnosticRetourne = await testeurMAC.entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(reponse.statusCode).toBe(200);
      expect(
        diagnosticRetourne.referentiel.contexte.questions[0].reponseDonnee
      ).toStrictEqual({
        reponsesMultiples: [],
        reponseUnique: 'reponse-2',
      });
      expect(await reponse.json()).toStrictEqual(
        forgeReponseDiagnostic(
          diagnostic,
          {
            'repondre-diagnostic': {
              url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}`,
              methode: 'PATCH',
            },
            [`afficher-diagnostic-${diagnostic.identifiant}`]: {
              url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}/restitution`,
              methode: 'GET',
            },
          },
          'reponse-2'
        )
      );
    });

    it('Retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic-libre-acces/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        {
          chemin: 'contexte',
          identifiant: 'une-question-',
          reponse: 'reponse-2',
        }
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toMatchObject({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });

    it('Vérifie que le diagnostic est un diagnostic en libre accès', async () => {
      const diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste()
      ).toBe(true);
    });

    it('Vérifie que le diagnostic date de moins de 7 jours', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { days: 7 })
      );
      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}`
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        liens: {
          'creer-diagnostic': {
            url: '/api/diagnostic-libre-acces',
            methode: 'POST',
          },
        },
        message: "Le diagnostic demandé n'existe pas.",
      });
    });
  });

  describe('Quand une requête GET est reçue sur /{id}/restitution', () => {
    let diagnostic: Diagnostic;

    beforeEach(async () => {
      diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);
    });

    it('Retourne la restitution', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecIndicateurs('indicateurs')
        .avecMesuresPrioritaires('mesures prioritaires')
        .avecAutresMesures('autres mesures')
        .construis();
      testeurMAC.adaptateursRestitution.html = () =>
        adaptateurDeRestitutionHTML;
      const restitution = uneRestitution()
        .avecIdentifiant(diagnostic.identifiant)
        .construis();
      await testeurMAC.entrepots.restitution().persiste(restitution);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${restitution.identifiant}/restitution`
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<RepresentationRestitution>({
        liens: {
          'modifier-diagnostic': {
            url: `/api/diagnostic-libre-acces/${restitution.identifiant}`,
            methode: 'GET',
          },
          'restitution-json': {
            contentType: 'application/json',
            methode: 'GET',
            url: `/api/diagnostic-libre-acces/${restitution.identifiant}/restitution`,
          },
          'restitution-pdf': {
            contentType: 'application/pdf',
            methode: 'GET',
            url: `/api/diagnostic-libre-acces/${restitution.identifiant}/restitution`,
          },
        },
        autresMesures: '',
        contactsEtLiensUtiles: '',
        ressources: '',
        indicateurs: 'indicateurs',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: 'mesures prioritaires',
      });
    });

    it('Retourne la restitution au format PDF', async () => {
      let adaptateurPDFAppele = false;
      const adaptateurRestitutionPDF = unAdaptateurRestitutionPDF();
      adaptateurRestitutionPDF.genereRestitution = () => {
        adaptateurPDFAppele = true;
        return Promise.resolve(Buffer.from('PDF Mesures généré'));
      };
      testeurMAC.adaptateursRestitution.pdf = () => adaptateurRestitutionPDF;
      const restitution = uneRestitution()
        .avecIdentifiant(diagnostic.identifiant)
        .construis();
      testeurMAC.entrepots.restitution().persiste(restitution);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${restitution.identifiant}/restitution`,
        undefined,
        { accept: 'application/pdf' }
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.headers['content-type']).toBe('application/pdf');
      expect(adaptateurPDFAppele).toBe(true);
    });

    it('Retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${crypto.randomUUID()}/restitution`
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toMatchObject({
        message: "La restitution demandée n'existe pas.",
      });
    });

    it('Vérifie que le diagnostic est un diagnostic en libre accès', async () => {
      const diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}/restitution`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeRelations.verifieRelationExiste()
      ).toBe(true);
    });

    it('Vérifie que le diagnostic date de moins de 7 jours', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const diagnostic = unDiagnostic().construis();
      await testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      FournisseurHorlogeDeTest.initialise(
        add(FournisseurHorloge.maintenant(), { days: 7 })
      );
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic-libre-acces/${diagnostic.identifiant}/restitution`
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOASEnErreur>({
        liens: {
          'creer-diagnostic': {
            url: '/api/diagnostic-libre-acces',
            methode: 'POST',
          },
        },
        message: "La restitution demandée n'existe pas.",
      });
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
