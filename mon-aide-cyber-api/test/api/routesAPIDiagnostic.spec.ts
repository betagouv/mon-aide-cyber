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
import { unAdaptateurRestitutionPDF } from '../adaptateurs/ConstructeurAdaptateurRestitutionPDF';
import { uneRestitution } from '../constructeurs/constructeurRestitution';
import {
  ReponseDiagnostic,
  RepresentationRestitution,
} from '../../src/api/routesAPIDiagnostic';
import { Diagnostic } from '../../src/diagnostic/Diagnostic';
import { LiensHATEOAS } from '../../src/api/hateoas/hateoas';
import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  relieUnAidantAUnDiagnostic,
  relieUnUtilisateurInscritAUnDiagnostic,
} from '../constructeurs/relationsUtilisateursMACDiagnostic';
import { AdaptateurDeVerificationDeDemandeMAC } from '../../src/adaptateurs/AdaptateurDeVerificationDeDemandeMAC';
import { EntrepotAideMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { AdaptateurDeVerificationDeDemandeDeTest } from '../adaptateurs/AdaptateurDeVerificationDeDemandeDeTest';

describe('Le serveur MAC sur les routes /api/diagnostic', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  const connecteUtilisateur = (identifiantAidant: crypto.UUID) => {
    testeurMAC.adaptateurDeVerificationDeSession.utilisateurProConnect(
      identifiantAidant
    );
  };

  describe('Quand une requête GET est reçue sur /{id}', () => {
    it('Retourne le référentiel du diagnostic', async () => {
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
        `/api/diagnostic/${diagnostic.identifiant}`
      );

      expect(reponse.statusCode).toBe(200);
      const diagnosticRecu: RepresentationDiagnostic = await reponse.json();
      expect(diagnosticRecu).toStrictEqual<ReponseDiagnostic>(
        forgeReponseDiagnostic(diagnostic, {
          [`afficher-diagnostic-${diagnostic.identifiant}`]: {
            url: `/api/diagnostic/${diagnostic.identifiant}/restitution`,
            methode: 'GET',
          },
          'repondre-diagnostic': {
            url: `/api/diagnostic/${diagnostic.identifiant}`,
            methode: 'PATCH',
          },
          'afficher-tableau-de-bord': {
            url: '/api/mon-espace/tableau-de-bord',
            methode: 'GET',
          },
        })
      );
    });

    it("Renvoie une erreur HTTP 404 diagnostic non trouvé si le diagnostic n'existe pas", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/id-inexistant`
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
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Vérifie que l’Aidant peut accéder au diagnostic', async () => {
      const { identifiantDiagnostic, identifiantUtilisateur } =
        await relieUnAidantAUnDiagnostic(
          testeurMAC.entrepots,
          testeurMAC.adaptateurRelations
        );
      connecteUtilisateur(identifiantUtilisateur);

      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${identifiantDiagnostic}`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDesAcces.verifieRelationExiste({
          relation: 'initiateur',
          typeObjet: 'diagnostic',
          typeUtilisateur: 'aidant',
        })
      ).toBe(true);
    });

    it('Vérifie que l’Utilisateur Inscrit peut accéder au diagnostic', async () => {
      const { identifiantDiagnostic, identifiantUtilisateur } =
        await relieUnUtilisateurInscritAUnDiagnostic(
          testeurMAC.entrepots,
          testeurMAC.adaptateurRelations
        );
      connecteUtilisateur(identifiantUtilisateur);

      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${identifiantDiagnostic}`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDesAcces.verifieRelationExiste({
          relation: 'initiateur',
          typeObjet: 'diagnostic',
          typeUtilisateur: 'utilisateurInscrit',
        })
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
        '/api/diagnostic'
      );

      expect(reponse.statusCode).toBe(201);
      expect(reponse.headers['link']).toMatch(
        /api\/diagnostic\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/
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
        '/api/diagnostic'
      );
      const lien = reponseCreation.headers['link'] as string;

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `${lien}`
      );

      const diagnosticRetourne = await reponse.json();
      expect(diagnosticRetourne.identifiant).toBe(
        lien?.substring(lien.lastIndexOf('/') + 1)
      );
      expect(diagnosticRetourne.referentiel.contexte.groupes).toHaveLength(1);
    });

    it("Retourne une erreur HTTP 500 lorsque le référentiel n'est pas trouvé", async () => {
      testeurMAC.adaptateurReferentiel.reInitialise();
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/diagnostic'
      );

      expect(reponse.statusCode).toBe(500);
      expect(await reponse.json()).toMatchObject({
        message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
      });
    });

    it('La route est protégée', async () => {
      await executeRequete(donneesServeur.app, 'POST', `/api/diagnostic/`);

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(donneesServeur.app, 'POST', `/api/diagnostic/`);

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Vérifie que l‘email de l‘entité correspond à une demande', async () => {
      await executeRequete(donneesServeur.app, 'POST', `/api/diagnostic/`, {
        emailEntiteAidee: 'jean.dupont@yopmail.com',
      });

      expect(
        (
          testeurMAC.adaptateurDeVerificationDeDemande as AdaptateurDeVerificationDeDemandeDeTest
        ).verifiePassage('jean.dupont@yopmail.com')
      ).toBe(true);
    });

    describe('Afin de valider le mail de l‘entité', () => {
      const testeurMAC = testeurIntegration();
      let donneesServeur: { app: Express };
      const entrepotAide = new EntrepotAideMemoire();

      beforeEach(() => {
        testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
        testeurMAC.adaptateurDeVerificationDeDemande =
          new AdaptateurDeVerificationDeDemandeMAC(entrepotAide);
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => {
        testeurMAC.arrete();
      });

      it("Vérifie que l'email fourni est au bon format", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/diagnostic/`,
          {
            emailEntiteAidee: 'mauvaisformat',
          }
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message: 'Veuillez renseigner une adresse email valide.',
        });
      });

      it("Vérifie que l'email est bien aseptisé", async () => {
        await executeRequete(donneesServeur.app, 'POST', `/api/diagnostic/`, {
          emailEntiteAidee: '  jean.dupont@yopmail.com   ',
        });

        expect(
          testeurMAC.adaptateurAseptisation.ontEteAseptises('emailEntiteAidee')
        ).toBe(true);
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
        `/api/diagnostic/${diagnostic.identifiant}`,
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
            [`afficher-diagnostic-${diagnostic.identifiant}`]: {
              url: `/api/diagnostic/${diagnostic.identifiant}/restitution`,
              methode: 'GET',
            },
            'repondre-diagnostic': {
              url: `/api/diagnostic/${diagnostic.identifiant}`,
              methode: 'PATCH',
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
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
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

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Vérifie que l’Aidant peut répondre au diagnostic', async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDesAcces.verifieRelationExiste({
          relation: 'initiateur',
          typeObjet: 'diagnostic',
          typeUtilisateur: 'aidant',
        })
      ).toBe(true);
    });

    it('Vérifie que l’Utilisateur Inscrit peut répondre au diagnostic', async () => {
      const { identifiantDiagnostic, identifiantUtilisateur } =
        await relieUnUtilisateurInscritAUnDiagnostic(
          testeurMAC.entrepots,
          testeurMAC.adaptateurRelations
        );
      connecteUtilisateur(identifiantUtilisateur);

      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/${identifiantDiagnostic}`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDesAcces.verifieRelationExiste({
          relation: 'initiateur',
          typeObjet: 'diagnostic',
          typeUtilisateur: 'utilisateurInscrit',
        })
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
        `/api/diagnostic/${identifiant}/restitution`
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<RepresentationRestitution>({
        liens: {
          'lancer-diagnostic': {
            methode: 'POST',
            url: '/api/diagnostic',
          },
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/mon-espace/tableau-de-bord',
          },
          'modifier-diagnostic': {
            url: `/api/diagnostic/${identifiant}`,
            methode: 'GET',
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
          'afficher-preferences': {
            url: '/api/aidant/preferences',
            methode: 'GET',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
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

    it('Retourne l’action de déconnexion propre a ProConnect', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        constructeurAidant: unAidant(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur.identifiant
      );
      testeurMAC.adaptateursRestitution.html = () =>
        unAdaptateurDeRestitutionHTML().construis();
      const identifiant = crypto.randomUUID();
      const restitution = uneRestitution()
        .avecIdentifiant(identifiant)
        .construis();
      await testeurMAC.entrepots.restitution().persiste(restitution);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${identifiant}/restitution`
      );

      expect((await reponse.json()).liens['se-deconnecter']).toStrictEqual({
        url: '/pro-connect/deconnexion',
        methode: 'GET',
        typeAppel: 'DIRECT',
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
      const restitution = uneRestitution().construis();
      testeurMAC.entrepots.restitution().persiste(restitution);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${restitution.identifiant}/restitution`,
        undefined,
        { accept: 'application/pdf' }
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.headers['content-type']).toBe('application/pdf');
      expect(adaptateurPDFAppele).toBe(true);
    });

    it('La route est protégée', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/restitution`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
    });

    it('Vérifie que les CGU et la charte ont été signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/restitution`
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Retourne une erreur HTTP 404 si le diagnostic visé n’existe pas', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${crypto.randomUUID()}/restitution`
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
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47/restitution`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDesAcces.verifieRelationExiste({
          relation: 'initiateur',
          typeObjet: 'diagnostic',
          typeUtilisateur: 'aidant',
        })
      ).toBe(true);
    });

    it('Vérifie que l’Utilisateur Inscrit peut accéder à la restitution', async () => {
      const { identifiantDiagnostic, identifiantUtilisateur } =
        await relieUnUtilisateurInscritAUnDiagnostic(
          testeurMAC.entrepots,
          testeurMAC.adaptateurRelations
        );
      connecteUtilisateur(identifiantUtilisateur);

      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/diagnostic/${identifiantDiagnostic}/restitution`
      );

      expect(
        testeurMAC.adaptateurDeVerificationDesAcces.verifieRelationExiste({
          relation: 'initiateur',
          typeObjet: 'diagnostic',
          typeUtilisateur: 'utilisateurInscrit',
        })
      ).toBe(true);
    });
  });
});

const forgeReponseDiagnostic = (
  diagnostic: Diagnostic,
  liens: LiensHATEOAS = {
    [`afficher-diagnostic-${diagnostic.identifiant}`]: {
      url: `/api/diagnostic/${diagnostic.identifiant}/restitution`,
      methode: 'GET',
    },
    'afficher-tableau-de-bord': {
      url: '/api/espace-aidant/tableau-de-bord',
      methode: 'GET',
    },
  },
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
