import { beforeEach, describe, expect, it } from 'vitest';
import {
  nettoieLaBaseDeDonneesAidants,
  nettoieLaBaseDeDonneesDiagnostics,
  nettoieLaBaseDeDonneesStatistiques,
} from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementClair } from '../../securite/ServiceDeChiffrementClair';
import { unAidant } from '../../../espace-aidant/constructeurs/constructeurAidant';
import { EntrepotStatistiquesPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotStatistiquesPostgres';
import { Statistiques } from '../../../../src/statistiques/statistiques';
import { EntrepotRelationPostgres } from '../../../../src/relation/infrastructure/EntrepotRelationPostgres';
import { Tuple } from '../../../../src/relation/Tuple';
import { UUID } from 'crypto';
import {
  unDiagnostic,
  unDiagnosticAvecSecteurActivite,
  unDiagnosticCompletEnGirondeAvecDesReponsesDonnees,
  unDiagnosticEnGironde,
  uneQuestionDiagnostic,
  uneReponseDonnee,
} from '../../../constructeurs/constructeurDiagnostic';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDiagnosticPostgres';
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../../../constructeurs/constructeurReferentiel';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import {
  EntrepotRestitutionPostgres,
  mappeurRestitution,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotRestitutionPostgres';
import { Restitution } from '../../../../src/restitution/Restitution';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  genereLaRestitution,
  QuestionDiagnostic,
} from '../../../../src/diagnostic/Diagnostic';
import { EntrepotAnnuaireAidantsPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAnnuaireAidantsPostgres';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { Aidant as AnnuaireAidant } from '../../../../src/annuaire-aidants/annuaireAidants';
import {
  Departement,
  departements,
} from '../../../../src/gestion-demandes/departements';
import { SecteurActivite } from '../../../../src/espace-aidant/preferences/secteursActivite';
import { unUtilisateur } from '../../../authentification/constructeurs/constructeurUtilisateur';
import { EntrepotUtilisateurPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotUtilisateurPostgres';
import { Utilisateur } from '../../../../src/authentification/Utilisateur';
import {
  Aidant,
  EntitesAssociations,
  EntitesOrganisationsPubliques,
  TypesEntites,
} from '../../../../src/espace-aidant/Aidant';

describe('Entrepots Postgres', () => {
  describe('Entrepot Statistiques Postgres', () => {
    beforeEach(async () => await nettoieLaBaseDeDonneesStatistiques());

    const unTupleDiagnostic = (identifiant: UUID): Tuple => ({
      identifiant,
      relation: 'initiateur',
      objet: { type: 'diagnostic', identifiant: identifiant },
      utilisateur: { type: 'aidant', identifiant: '' },
    });

    it('Retourne les statistiques', async () => {
      const premierDiagnosticEnGironde = unDiagnosticEnGironde().construis();
      const deuxiemeDiagnosticEnGironde = unDiagnosticEnGironde().construis();
      const troisiemeDiagnosticEnGironde = unDiagnosticEnGironde().construis();
      const unDiagnosticSansDepartement = unDiagnostic().construis();
      const quatriemeDiagnosticEnGironde = unDiagnosticEnGironde().construis();
      const entrepotAidant = new EntrepotAidantPostgres(
        new ServiceDeChiffrementClair()
      );
      await entrepotAidant.persiste(unAidant().construis());
      await entrepotAidant.persiste(unAidant().construis());
      await new EntrepotDiagnosticPostgres().persiste(
        premierDiagnosticEnGironde
      );
      await new EntrepotDiagnosticPostgres().persiste(
        deuxiemeDiagnosticEnGironde
      );
      await new EntrepotDiagnosticPostgres().persiste(
        troisiemeDiagnosticEnGironde
      );
      await new EntrepotDiagnosticPostgres().persiste(
        quatriemeDiagnosticEnGironde
      );
      await new EntrepotDiagnosticPostgres().persiste(
        unDiagnosticSansDepartement
      );
      await new EntrepotRelationPostgres().persiste(
        unTupleDiagnostic(premierDiagnosticEnGironde.identifiant)
      );
      await new EntrepotRelationPostgres().persiste(
        unTupleDiagnostic(deuxiemeDiagnosticEnGironde.identifiant)
      );
      await new EntrepotRelationPostgres().persiste(
        unTupleDiagnostic(troisiemeDiagnosticEnGironde.identifiant)
      );
      await new EntrepotRelationPostgres().persiste(
        unTupleDiagnostic(quatriemeDiagnosticEnGironde.identifiant)
      );
      await new EntrepotRelationPostgres().persiste(
        unTupleDiagnostic(unDiagnosticSansDepartement.identifiant)
      );

      const statistiques = await new EntrepotStatistiquesPostgres().lis();

      expect(statistiques).toStrictEqual<Statistiques>({
        identifiant: expect.any(String),
        nombreDiagnostics: 4,
        nombreAidants: 2,
      });
    });
  });

  describe('Entrepot Diagnostic Postgres', () => {
    beforeEach(async () => {
      await nettoieLaBaseDeDonneesDiagnostics();
    });
    it('persiste un diagnostic', async () => {
      const diagnostic = unDiagnostic().construis();

      await new EntrepotDiagnosticPostgres().persiste(diagnostic);

      const entrepotDiagnosticPostgresLecture =
        new EntrepotDiagnosticPostgres();
      expect(
        await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant)
      ).toStrictEqual(diagnostic);
    });

    it('persiste un diagnostic avec les réponses données', async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('question-set', [
              uneQuestion()
                .aChoixMultiple('Sauvegardes-tu les set?', [
                  uneReponsePossible().avecLibelle('Oui').construis(),
                  uneReponsePossible().avecLibelle('Un peu').construis(),
                  uneReponsePossible().avecLibelle('Beaucoup').construis(),
                ])
                .construis(),
            ])
            .construis()
        )
        .avecLesReponsesDonnees('question-set', [
          { 'sauvegardestu-les-set': ['un-peu', 'beaucoup'] },
        ])
        .construis();

      await new EntrepotDiagnosticPostgres().persiste(diagnostic);

      const entrepotDiagnosticPostgresLecture =
        new EntrepotDiagnosticPostgres();
      expect(
        await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant)
      ).toStrictEqual(diagnostic);
    });

    it('Récupère les diagnostics pour les identifiants donnés', async () => {
      const diagnostic1 = unDiagnostic().construis();
      const diagnostic2 = unDiagnostic().construis();

      await new EntrepotDiagnosticPostgres().persiste(diagnostic1);
      await new EntrepotDiagnosticPostgres().persiste(diagnostic2);

      const entrepotDiagnosticPostgresLecture =
        new EntrepotDiagnosticPostgres();
      expect(
        await entrepotDiagnosticPostgresLecture.tousLesDiagnosticsAyantPourIdentifiant(
          [diagnostic1.identifiant, diagnostic2.identifiant]
        )
      ).toStrictEqual([diagnostic1, diagnostic2]);
    });
  });

  describe('Entrepôt Restitution Postgres', () => {
    beforeEach(() => FournisseurHorlogeDeTest.initialise(new Date()));

    beforeEach(async () => {
      await nettoieLaBaseDeDonneesDiagnostics();
    });

    it('retourne une restitution sans indicateurs', async () => {
      const diagnostic = unDiagnostic().construis();
      await new EntrepotDiagnosticPostgres().persiste(diagnostic);

      const entrepotRestitution = new EntrepotRestitutionPostgres();
      expect(
        await entrepotRestitution.lis(diagnostic.identifiant)
      ).toStrictEqual<Restitution>({
        identifiant: diagnostic.identifiant,
        informations: {
          dateCreation: FournisseurHorloge.maintenant(),
          dateDerniereModification: FournisseurHorloge.maintenant(),
          secteurGeographique: 'non renseigné',
          secteurActivite: 'non renseigné',
        },
        indicateurs: {},
        mesures: {
          mesuresPrioritaires: [],
          autresMesures: [],
        },
      });
    });

    it("remonte une erreur si la restitution n'existe pas", async () => {
      const entrepotRestitution = new EntrepotRestitutionPostgres();
      const identifiant = crypto.randomUUID();

      await expect(entrepotRestitution.lis(identifiant)).rejects.toThrowError(
        "Le restitution demandé n'existe pas"
      );
    });

    describe('retourne les informations de restitution', () => {
      it('avec la zone géographique', async () => {
        const diagnostic = unDiagnosticEnGironde().construis();
        genereLaRestitution(diagnostic);
        await new EntrepotDiagnosticPostgres().persiste(diagnostic);

        const entrepotRestitution = new EntrepotRestitutionPostgres();
        expect(
          await entrepotRestitution.lis(diagnostic.identifiant)
        ).toStrictEqual<Restitution>({
          identifiant: diagnostic.identifiant,
          informations: {
            dateCreation: FournisseurHorloge.maintenant(),
            dateDerniereModification: FournisseurHorloge.maintenant(),
            secteurGeographique: 'Gironde, Nouvelle-Aquitaine',
            secteurActivite: 'non renseigné',
          },
          indicateurs: {},
          mesures: {
            mesuresPrioritaires: [],
            autresMesures: [],
          },
        });
      });

      it("avec le secteur d'activité", async () => {
        const diagnostic =
          unDiagnosticAvecSecteurActivite('Construction').construis();
        genereLaRestitution(diagnostic);
        await new EntrepotDiagnosticPostgres().persiste(diagnostic);

        const entrepotRestitution = new EntrepotRestitutionPostgres();
        expect(
          await entrepotRestitution.lis(diagnostic.identifiant)
        ).toStrictEqual<Restitution>({
          identifiant: diagnostic.identifiant,
          informations: {
            dateCreation: FournisseurHorloge.maintenant(),
            dateDerniereModification: FournisseurHorloge.maintenant(),
            secteurGeographique: 'non renseigné',
            secteurActivite: 'Construction',
          },
          indicateurs: {},
          mesures: {
            mesuresPrioritaires: [],
            autresMesures: [],
          },
        });
      });
    });

    describe('retourne les mesures', () => {
      it('avec toutes les mesures et indicateurs', async () => {
        const diagnostic =
          unDiagnosticCompletEnGirondeAvecDesReponsesDonnees().construis();
        genereLaRestitution(diagnostic);
        await new EntrepotDiagnosticPostgres().persiste(diagnostic);

        const entrepotRestitution = new EntrepotRestitutionPostgres();
        expect(
          await entrepotRestitution.lis(diagnostic.identifiant)
        ).toStrictEqual<Restitution>({
          identifiant: diagnostic.identifiant,
          informations: {
            dateCreation: FournisseurHorloge.maintenant(),
            dateDerniereModification: FournisseurHorloge.maintenant(),
            secteurGeographique: 'Gironde, Nouvelle-Aquitaine',
            secteurActivite: 'non renseigné',
          },
          indicateurs: { thematique: { moyennePonderee: 0 } },
          mesures: {
            mesuresPrioritaires: [
              {
                valeurObtenue: 0,
                priorisation: 1,
                titre: 'mesure 1',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 2,
                titre: 'mesure 2',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 3,
                titre: 'mesure 3',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 4,
                titre: 'mesure 4',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 5,
                titre: 'mesure 5',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
              {
                valeurObtenue: 0,
                priorisation: 6,
                titre: 'mesure 6',
                pourquoi: 'parce-que',
                comment: 'comme ça',
              },
            ],
            autresMesures: [
              {
                titre: 'mesure 7',
                pourquoi: 'parce-que',
                comment: 'comme ça',
                valeurObtenue: 0,
                priorisation: 7,
              },
            ],
          },
        });
      });
    });

    describe('Mappeur de restitution', () => {
      const mappeurRestitutionDTODepuisQuestion = (questions: {
        questionRegion?: QuestionDiagnostic;
        questionDepartement?: QuestionDiagnostic;
        questionActivite?: QuestionDiagnostic;
      }) => {
        const enDTO = (question: QuestionDiagnostic) => ({
          identifiant: question.identifiant,
          libelle: question.libelle,
          poids: question.poids,
          reponseDonnee: {
            reponseUnique: question.reponseDonnee.reponseUnique,
            reponsesMultiples: question.reponseDonnee.reponsesMultiples.map(
              (rep) => ({
                identifiant: rep.identifiant,
                reponses: Array.from(rep.reponses.values()),
              })
            ),
          },
          reponsesPossibles: question.reponsesPossibles,
          type: question.type,
        });

        return {
          id: crypto.randomUUID(),
          datecreation: FournisseurHorloge.maintenant().toISOString(),
          datedernieremodification:
            FournisseurHorloge.maintenant().toISOString(),
          departement: enDTO(
            questions.questionDepartement || uneQuestionDiagnostic().construis()
          ),
          region: enDTO(
            questions.questionRegion || uneQuestionDiagnostic().construis()
          ),
          restitution: {
            indicateurs: {},
            mesures: {
              mesuresPrioritaires: [],
              autresMesures: [],
            },
          },
          secteuractivite: enDTO(
            questions.questionActivite || uneQuestionDiagnostic().construis()
          ),
        };
      };

      describe("secteur d'activité de l'entité", () => {
        it("si renseigné, représente le secteur d'activité", () => {
          const questionSecteurActivite = uneQuestionDiagnostic()
            .avecLibelle("Secteur d'activité?")
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('a').construis(),
              uneReponsePossible().avecLibelle('b').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee().ayantPourReponse('b').construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionActivite: questionSecteurActivite,
              })
            ).secteurActivite
          ).toStrictEqual('b');
        });

        it("si non renseigné, indique 'non renseigné'", () => {
          const questionSecteurActivite = uneQuestionDiagnostic()
            .avecLibelle("Secteur d'activité?")
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('a').construis(),
              uneReponsePossible().avecLibelle('b').construis(),
            ])
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionActivite: questionSecteurActivite,
              })
            ).secteurActivite
          ).toStrictEqual('non renseigné');
        });
      });

      describe("Zone géographique de l'entité", () => {
        it("Représente la zone géographique au format '<département>, <région>'", () => {
          const questionRegion = uneQuestionDiagnostic()
            .avecLibelle('Région?')
            .avecLesReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Nouvelle-Aquitaine')
                .construis(),
              uneReponsePossible().avecLibelle('Bretagne').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee()
                .ayantPourReponse('nouvelleaquitaine')
                .construis()
            )
            .construis();
          const questionDepartement = uneQuestionDiagnostic()
            .avecLibelle('Département?')
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('Finistère').construis(),
              uneReponsePossible().avecLibelle('Gironde').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee().ayantPourReponse('gironde').construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionRegion: questionRegion,
                questionDepartement: questionDepartement,
              })
            ).secteurGeographique
          ).toStrictEqual('Gironde, Nouvelle-Aquitaine');
        });

        it("Si seulement le département est renseigné, représente la zone géographique au format '<département>'", () => {
          const questionDepartement = uneQuestionDiagnostic()
            .avecLibelle('Département?')
            .avecLesReponsesPossibles([
              uneReponsePossible().avecLibelle('Finistère').construis(),
              uneReponsePossible().avecLibelle('Gironde').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee().ayantPourReponse('gironde').construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionDepartement: questionDepartement,
              })
            ).secteurGeographique
          ).toStrictEqual('Gironde');
        });

        it("Si seulement la région est renseigné, représente la zone géographique au format '<région>'", () => {
          const questionRegion = uneQuestionDiagnostic()
            .avecLibelle('Région?')
            .avecLesReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Nouvelle-Aquitaine')
                .construis(),
              uneReponsePossible().avecLibelle('Bretagne').construis(),
            ])
            .ayantLaReponseDonnee(
              uneReponseDonnee()
                .ayantPourReponse('nouvelleaquitaine')
                .construis()
            )
            .construis();

          expect(
            mappeurRestitution(
              mappeurRestitutionDTODepuisQuestion({
                questionRegion: questionRegion,
              })
            ).secteurGeographique
          ).toStrictEqual('Nouvelle-Aquitaine');
        });

        it("Si ni le département ni la région ne sont renseignés, affiche 'non renseigné'", () => {
          expect(
            mappeurRestitution(mappeurRestitutionDTODepuisQuestion({}))
              .secteurGeographique
          ).toStrictEqual('non renseigné');
        });
      });
    });
  });
});

describe('Entrepot Aidant', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesAidants();
  });

  it('Persiste un aidant', async () => {
    const aidant = unAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [aidant.email, 'aaa'],
        [aidant.motDePasse, 'bbb'],
        [aidant.nomPrenom, 'ccc'],
      ])
    );

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement
    ).lis(aidant.identifiant);
    expect(aidantRecu).toStrictEqual<Aidant>(aidant);
  });

  describe('Met à jour les préférences', () => {
    it('Persiste les types d’entités de l’Aidant', async () => {
      const organisationsPubliques: EntitesOrganisationsPubliques = {
        nom: 'Organisations publiques',
        libelle:
          'Organisations publiques (ex. collectivité, administration, etc.)',
      };
      const associations: EntitesAssociations = {
        nom: 'Associations',
        libelle: 'Associations (ex. association loi 1901, GIP)',
      };
      const aidant = unAidant()
        .ayantPourTypesEntite([organisationsPubliques, associations])
        .construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();

      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.preferences.typesEntites).toStrictEqual<TypesEntites>([
        organisationsPubliques,
        associations,
      ]);
    });

    it('Persiste les départements où l’Aidant souhaite intervenir', async () => {
      const finistere: Departement = {
        nom: 'Finistère',
        code: '29',
        codeRegion: '53',
      };
      const gironde: Departement = {
        nom: 'Gironde',
        code: '33',
        codeRegion: '75',
      };
      const gard: Departement = {
        nom: 'Gard',
        code: '30',
        codeRegion: '76',
      };
      const aidant = unAidant()
        .ayantPourDepartements([finistere, gironde, gard])
        .construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();

      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.preferences.departements).toStrictEqual<Departement[]>([
        finistere,
        gard,
        gironde,
      ]);
    });

    it('Persiste les secteurs d’activité pour lesquels l’Aidant peut intervenir', async () => {
      const administration: SecteurActivite = {
        nom: 'Administration',
      };
      const industrie: SecteurActivite = {
        nom: 'Industrie',
      };
      const aidant = unAidant()
        .ayantPourSecteursActivite([administration, industrie])
        .construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();

      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.preferences.secteursActivite).toStrictEqual<
        SecteurActivite[]
      >([administration, industrie]);
    });
  });

  describe('Met à jour un aidant', () => {
    it('Mets à jour les dates de signature des CGU et de la charte', async () => {
      const dateSignature = new Date(Date.parse('2024-02-04T13:25:17+01:00'));
      FournisseurHorlogeDeTest.initialise(dateSignature);
      const aidant = unAidant().sansEspace().construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
      aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.dateSignatureCharte).toStrictEqual(dateSignature);
      expect(aidantRecu.dateSignatureCGU).toStrictEqual(dateSignature);
    });

    it('Met à jour le consentement pour apparaître dans l’annuaire', async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      aidant.consentementAnnuaire = true;
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.consentementAnnuaire).toBe(true);
    });
  });

  describe('Recherche par identifiant', () => {
    it("l'aidant est trouvé", async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.email, 'aaa'],
          [aidant.motDePasse, 'bbb'],
          [aidant.nomPrenom, 'ccc'],
        ])
      );
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantTrouve = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).rechercheParIdentifiantDeConnexion(aidant.email);

      expect(aidantTrouve).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map())
        ).rechercheParIdentifiantDeConnexion('identifiant-inconnu')
      ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
    });
  });
});

describe('Entrepot Annuaire Aidants Postgres', () => {
  beforeEach(async () => await nettoieLaBaseDeDonneesAidants());
  it('Retourne les Aidants ayant consenti à apparaître dans l’Annuaire', async () => {
    const premierAidantSansConsentement = unAidant().construis();
    const secondAidantSansConsentement = unAidant().construis();
    const premierAidantAvecConsentement = unAidant()
      .ayantConsentiPourLAnnuaire()
      .construis();
    const secondAidantAvecConsentement = unAidant()
      .ayantConsentiPourLAnnuaire()
      .construis();
    const entrepotAidant = new EntrepotAidantPostgres(
      new ServiceDeChiffrementClair()
    );
    await entrepotAidant.persiste(premierAidantAvecConsentement);
    await entrepotAidant.persiste(secondAidantAvecConsentement);
    await entrepotAidant.persiste(premierAidantSansConsentement);
    await entrepotAidant.persiste(secondAidantSansConsentement);

    const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
      new ServiceDeChiffrementClair()
    ).rechercheParCriteres();

    expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
      {
        identifiant: premierAidantAvecConsentement.identifiant,
        nomPrenom: premierAidantAvecConsentement.nomPrenom,
        departements: premierAidantAvecConsentement.preferences.departements,
      },
      {
        identifiant: secondAidantAvecConsentement.identifiant,
        nomPrenom: secondAidantAvecConsentement.nomPrenom,
        departements: secondAidantAvecConsentement.preferences.departements,
      },
    ]);
  });

  it('Utilise le service de chiffrement pour déchiffrer le nom de l’Aidant', async () => {
    const aidant = unAidant()
      .avecUnNomPrenom('Jean Dupont')
      .ayantConsentiPourLAnnuaire()
      .construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([[aidant.nomPrenom, 'ccc']])
    );
    const entrepotAidant = new EntrepotAidantPostgres(serviceDeChiffrement);
    await entrepotAidant.persiste(aidant);

    const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
      serviceDeChiffrement
    ).rechercheParCriteres();

    expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
      {
        identifiant: aidant.identifiant,
        nomPrenom: 'Jean Dupont',
        departements: aidant.preferences.departements,
      },
    ]);
  });

  describe('Lorsque l’on filtre', () => {
    describe('Par territoire', () => {
      it('Retourne les Aidants pouvant intervenir dans le département', async () => {
        const premierAidantAvecConsentement = unAidant()
          .ayantConsentiPourLAnnuaire()
          .ayantPourDepartements([departements[0], departements[32]])
          .construis();
        const secondAidantAvecConsentement = unAidant()
          .ayantConsentiPourLAnnuaire()
          .ayantPourDepartements([departements[0]])
          .construis();
        const entrepotAidant = new EntrepotAidantPostgres(
          new ServiceDeChiffrementClair()
        );
        await entrepotAidant.persiste(premierAidantAvecConsentement);
        await entrepotAidant.persiste(secondAidantAvecConsentement);

        const tousLesAidants = await new EntrepotAnnuaireAidantsPostgres(
          new ServiceDeChiffrementClair()
        ).rechercheParCriteres({ departement: 'Gers' });

        expect(tousLesAidants).toStrictEqual<AnnuaireAidant[]>([
          {
            identifiant: premierAidantAvecConsentement.identifiant,
            nomPrenom: premierAidantAvecConsentement.nomPrenom,
            departements: [departements[0], departements[32]],
          },
        ]);
      });
    });
  });
});

describe('Entrepot Utilisateur', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesAidants();
  });

  it('Persiste un utilisateur', async () => {
    const utilisateur = unUtilisateur().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [utilisateur.identifiantConnexion, 'aaa'],
        [utilisateur.motDePasse, 'bbb'],
        [utilisateur.nomPrenom, 'ccc'],
      ])
    );
    const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
      serviceDeChiffrement
    );

    await entrepotUtilisateurPostgres.persiste(utilisateur);

    const utilisateurRecu = await entrepotUtilisateurPostgres.lis(
      utilisateur.identifiant
    );
    expect(utilisateurRecu).toStrictEqual<Utilisateur>(utilisateur);
  });

  describe('Recherche par identifiant et mot de passe', () => {
    it("L'utilisateur est trouvé", async () => {
      const utilisateur = unUtilisateur().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [utilisateur.identifiantConnexion, 'aaa'],
          [utilisateur.motDePasse, 'bbb'],
          [utilisateur.nomPrenom, 'ccc'],
        ])
      );
      const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
        serviceDeChiffrement
      );

      await entrepotUtilisateurPostgres.persiste(utilisateur);

      const utilisateurRecu =
        await entrepotUtilisateurPostgres.rechercheParIdentifiantConnexionEtMotDePasse(
          utilisateur.identifiantConnexion,
          utilisateur.motDePasse
        );
      expect(utilisateurRecu).toStrictEqual<Utilisateur>(utilisateur);
    });

    it("l'utilisateur n'est pas trouvé", () => {
      expect(
        new EntrepotUtilisateurPostgres(
          new FauxServiceDeChiffrement(new Map())
        ).rechercheParIdentifiantConnexionEtMotDePasse(
          'identifiant-inconnu',
          'mdp'
        )
      ).rejects.toThrow(new Error("Le utilisateur demandé n'existe pas."));
    });
  });

  describe('Mets à jour un utilisateur', () => {
    it('Mets à jour la date de signature des CGU', async () => {
      const serviceDeChiffrement = new ServiceDeChiffrementClair();
      const entrepotUtilisateurPostgres = new EntrepotUtilisateurPostgres(
        serviceDeChiffrement
      );
      const dateSignature = new Date(Date.parse('2024-02-04T13:25:17+01:00'));
      FournisseurHorlogeDeTest.initialise(dateSignature);
      const utilisateur = unUtilisateur().sansCGUSignees().construis();
      await entrepotUtilisateurPostgres.persiste(utilisateur);

      utilisateur.dateSignatureCGU = FournisseurHorloge.maintenant();
      await entrepotUtilisateurPostgres.persiste(utilisateur);

      const utilisateurRecu = await entrepotUtilisateurPostgres.lis(
        utilisateur.identifiant
      );
      expect(utilisateurRecu.dateSignatureCGU).toStrictEqual(dateSignature);
    });
  });
});
