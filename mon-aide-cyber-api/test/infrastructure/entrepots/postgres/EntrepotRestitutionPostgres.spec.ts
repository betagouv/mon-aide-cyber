import {
  unDiagnostic,
  unDiagnosticAvecSecteurActivite,
  unDiagnosticCompletEnGirondeAvecDesReponsesDonnees,
  unDiagnosticEnGironde,
  uneQuestionDiagnostic,
  uneReponseDonnee,
} from '../../../constructeurs/constructeurDiagnostic';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { nettoieLaBaseDeDonneesDiagnostics } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDiagnosticPostgres';
import {
  EntrepotRestitutionPostgres,
  mappeurRestitution,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotRestitutionPostgres';
import { Restitution } from '../../../../src/restitution/Restitution';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import {
  genereLaRestitution,
  QuestionDiagnostic,
} from '../../../../src/diagnostic/Diagnostic';
import { uneReponsePossible } from '../../../constructeurs/constructeurReferentiel';
import crypto from 'crypto';

describe('Entrepôt de restitution', () => {
  beforeEach(() => FournisseurHorlogeDeTest.initialise(new Date()));

  afterEach(async () => {
    await nettoieLaBaseDeDonneesDiagnostics();
  });

  it('retourne une restitution sans indicateurs', async () => {
    const diagnostic = unDiagnostic().construis();
    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const entrepotRestitution = new EntrepotRestitutionPostgres();
    expect(
      await entrepotRestitution.lis(diagnostic.identifiant),
    ).toStrictEqual<Restitution>({
      identifiant: diagnostic.identifiant,
      informations: {
        dateCreation: FournisseurHorloge.maintenant(),
        dateDerniereModification: FournisseurHorloge.maintenant(),
        zoneGeographique: 'non renseigné',
        secteurActivite: 'non renseigné',
      },
      indicateurs: {},
      recommandations: {
        recommandationsPrioritaires: [],
        autresRecommandations: [],
      },
    });
  });

  it("remonte une erreur si la restitution n'existe pas", async () => {
    const entrepotRestitution = new EntrepotRestitutionPostgres();
    const identifiant = crypto.randomUUID();

    await expect(entrepotRestitution.lis(identifiant)).rejects.toThrowError(
      "Le restitution demandé n'existe pas",
    );
  });

  describe('retourne les informations de restitution', () => {
    it('avec la zone géographique', async () => {
      const diagnostic = unDiagnosticEnGironde().construis();
      genereLaRestitution(diagnostic);
      await new EntrepotDiagnosticPostgres().persiste(diagnostic);

      const entrepotRestitution = new EntrepotRestitutionPostgres();
      expect(
        await entrepotRestitution.lis(diagnostic.identifiant),
      ).toStrictEqual<Restitution>({
        identifiant: diagnostic.identifiant,
        informations: {
          dateCreation: FournisseurHorloge.maintenant(),
          dateDerniereModification: FournisseurHorloge.maintenant(),
          zoneGeographique: 'Gironde, Nouvelle-Aquitaine',
          secteurActivite: 'non renseigné',
        },
        indicateurs: {},
        recommandations: {
          recommandationsPrioritaires: [],
          autresRecommandations: [],
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
        await entrepotRestitution.lis(diagnostic.identifiant),
      ).toStrictEqual<Restitution>({
        identifiant: diagnostic.identifiant,
        informations: {
          dateCreation: FournisseurHorloge.maintenant(),
          dateDerniereModification: FournisseurHorloge.maintenant(),
          zoneGeographique: 'non renseigné',
          secteurActivite: 'Construction',
        },
        indicateurs: {},
        recommandations: {
          recommandationsPrioritaires: [],
          autresRecommandations: [],
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
        await entrepotRestitution.lis(diagnostic.identifiant),
      ).toStrictEqual<Restitution>({
        identifiant: diagnostic.identifiant,
        informations: {
          dateCreation: FournisseurHorloge.maintenant(),
          dateDerniereModification: FournisseurHorloge.maintenant(),
          zoneGeographique: 'Gironde, Nouvelle-Aquitaine',
          secteurActivite: 'non renseigné',
        },
        indicateurs: { thematique: { moyennePonderee: 0 } },
        recommandations: {
          recommandationsPrioritaires: [
            {
              valeurObtenue: 0,
              priorisation: 1,
              titre: 'reco 1',
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
            {
              valeurObtenue: 0,
              priorisation: 2,
              titre: 'reco 2',
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
            {
              valeurObtenue: 0,
              priorisation: 3,
              titre: 'reco 3',
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
            {
              valeurObtenue: 0,
              priorisation: 4,
              titre: 'reco 4',
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
            {
              valeurObtenue: 0,
              priorisation: 5,
              titre: 'reco 5',
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
            {
              valeurObtenue: 0,
              priorisation: 6,
              titre: 'reco 6',
              pourquoi: 'parce-que',
              comment: 'comme ça',
            },
          ],
          autresRecommandations: [
            {
              titre: 'reco 7',
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
          }),
        ),
      },
      reponsesPossibles: question.reponsesPossibles,
      type: question.type,
    });

    return {
      id: crypto.randomUUID(),
      datecreation: FournisseurHorloge.maintenant().toISOString(),
      datedernieremodification: FournisseurHorloge.maintenant().toISOString(),
      departement: enDTO(
        questions.questionDepartement || uneQuestionDiagnostic().construis(),
      ),
      region: enDTO(
        questions.questionRegion || uneQuestionDiagnostic().construis(),
      ),
      restitution: {
        indicateurs: {},
        recommandations: {
          recommandationsPrioritaires: [],
          autresRecommandations: [],
        },
      },
      secteuractivite: enDTO(
        questions.questionActivite || uneQuestionDiagnostic().construis(),
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
          uneReponseDonnee().ayantPourReponse('b').construis(),
        )
        .construis();

      expect(
        mappeurRestitution(
          mappeurRestitutionDTODepuisQuestion({
            questionActivite: questionSecteurActivite,
          }),
        ).secteurActivite,
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
          }),
        ).secteurActivite,
      ).toStrictEqual('non renseigné');
    });
  });

  describe("zone géographique de l'entité", () => {
    it("représente la zone géographique au format '<département>, <région>'", () => {
      const questionRegion = uneQuestionDiagnostic()
        .avecLibelle('Région?')
        .avecLesReponsesPossibles([
          uneReponsePossible().avecLibelle('Nouvelle-Aquitaine').construis(),
          uneReponsePossible().avecLibelle('Bretagne').construis(),
        ])
        .ayantLaReponseDonnee(
          uneReponseDonnee().ayantPourReponse('nouvelleaquitaine').construis(),
        )
        .construis();
      const questionDepartement = uneQuestionDiagnostic()
        .avecLibelle('Département?')
        .avecLesReponsesPossibles([
          uneReponsePossible().avecLibelle('Finistère').construis(),
          uneReponsePossible().avecLibelle('Gironde').construis(),
        ])
        .ayantLaReponseDonnee(
          uneReponseDonnee().ayantPourReponse('gironde').construis(),
        )
        .construis();

      expect(
        mappeurRestitution(
          mappeurRestitutionDTODepuisQuestion({
            questionRegion: questionRegion,
            questionDepartement: questionDepartement,
          }),
        ).zoneGeographique,
      ).toStrictEqual('Gironde, Nouvelle-Aquitaine');
    });

    it("si seulement le département est renseigné, représente la zone géographique au format '<département>'", () => {
      const questionDepartement = uneQuestionDiagnostic()
        .avecLibelle('Département?')
        .avecLesReponsesPossibles([
          uneReponsePossible().avecLibelle('Finistère').construis(),
          uneReponsePossible().avecLibelle('Gironde').construis(),
        ])
        .ayantLaReponseDonnee(
          uneReponseDonnee().ayantPourReponse('gironde').construis(),
        )
        .construis();

      expect(
        mappeurRestitution(
          mappeurRestitutionDTODepuisQuestion({
            questionDepartement: questionDepartement,
          }),
        ).zoneGeographique,
      ).toStrictEqual('Gironde');
    });

    it("si seulement la région est renseigné, représente la zone géographique au format '<région>'", () => {
      const questionRegion = uneQuestionDiagnostic()
        .avecLibelle('Région?')
        .avecLesReponsesPossibles([
          uneReponsePossible().avecLibelle('Nouvelle-Aquitaine').construis(),
          uneReponsePossible().avecLibelle('Bretagne').construis(),
        ])
        .ayantLaReponseDonnee(
          uneReponseDonnee().ayantPourReponse('nouvelleaquitaine').construis(),
        )
        .construis();

      expect(
        mappeurRestitution(
          mappeurRestitutionDTODepuisQuestion({
            questionRegion: questionRegion,
          }),
        ).zoneGeographique,
      ).toStrictEqual('Nouvelle-Aquitaine');
    });

    it("si ni le département ni la région ne sont renseignés, affiche 'non renseigné'", () => {
      expect(
        mappeurRestitution(mappeurRestitutionDTODepuisQuestion({}))
          .zoneGeographique,
      ).toStrictEqual('non renseigné');
    });
  });
});
