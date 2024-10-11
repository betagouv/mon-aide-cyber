import { beforeEach, describe, expect, it } from 'vitest';
import {
  nettoieLaBaseDeDonneesDiagnostics,
  nettoieLaBaseDeDonneesStatistiques,
} from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementClair } from '../../securite/ServiceDeChiffrementClair';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
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
