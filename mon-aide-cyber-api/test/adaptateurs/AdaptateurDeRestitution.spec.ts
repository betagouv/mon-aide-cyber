import { describe, it } from 'vitest';
import { AdaptateurDeRestitution } from '../../src/adaptateurs/AdaptateurDeRestitution';
import {
  genereLaRestitution,
  Indicateurs,
  RecommandationPriorisee,
} from '../../src/diagnostic/Diagnostic';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import {
  uneListeDeQuestions,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { unTableauDeRecommandations } from '../constructeurs/constructeurTableauDeRecommandations';
import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { uneAssociation } from '../constructeurs/constructeurAssociation';

describe('Adaptateur de Restitution', () => {
  const adaptateurRestitution =
    new (class extends AdaptateurDeRestitution<Buffer> {
      protected genere(
        htmlRecommandations: Promise<ContenuHtml>[],
      ): Promise<Buffer> {
        return Promise.all(htmlRecommandations).then((htmls) => {
          const resultat: ContenuHtml[] = [];

          htmls.forEach((html) => {
            resultat.push(html);
          });

          return Buffer.from(JSON.stringify(resultat), 'utf-8');
        });
      }
      protected genereIndicateurs(
        indicateurs: Indicateurs | undefined,
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete indicateur',
          piedPage: 'piedPage indicateur',
        };

        Object.entries(indicateurs || {})?.forEach(
          ([thematique, indicateur]) => {
            resultat.corps += JSON.stringify({ thematique, indicateur });
          },
        );

        return Promise.resolve(resultat);
      }

      protected genereRecommandationsAnnexes(
        autresRecommandations: RecommandationPriorisee[] | undefined,
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete',
          piedPage: 'piedPage',
        };

        autresRecommandations?.forEach((reco) => {
          resultat.corps += JSON.stringify(reco);
        });

        return Promise.resolve(resultat);
      }

      protected genereRecommandationsPrioritaires(
        recommandationsPrioritaires: RecommandationPriorisee[] | undefined,
      ): Promise<ContenuHtml> {
        const resultat: ContenuHtml = {
          corps: '',
          entete: 'entete',
          piedPage: 'piedPage',
        };

        recommandationsPrioritaires?.forEach((reco) => {
          resultat.corps += JSON.stringify(reco);
        });

        return Promise.resolve(resultat);
      }
    })();

  const questions = uneListeDeQuestions()
    .dontLesLabelsSont(['q1', 'q2'])
    .avecLesReponsesPossiblesSuivantesAssociees([
      {
        libelle: 'reponse 11',
        association: uneAssociation()
          .avecIdentifiant('q1')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 12',
        association: uneAssociation()
          .avecIdentifiant('q1')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 13' },
      { libelle: 'reponse 14' },
      {
        libelle: 'reponse 21',
        association: uneAssociation()
          .avecIdentifiant('q2')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 22',
        association: uneAssociation()
          .avecIdentifiant('q2')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 23' },
      { libelle: 'reponse 24' },
    ])
    .construis();

  const tableauDeRecommandations = unTableauDeRecommandations()
    .avecLesRecommandations([
      { q1: { niveau1: 'reco 1', niveau2: 'reco 12', priorisation: 3 } },
      { q2: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q3: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q4: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q5: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q6: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q7: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
    ])
    .construis();

  it('génère la restitution sans annexe', async () => {
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .ajouteUneThematique('thematique', questions)
          .construis(),
      )
      .avecLesReponsesDonnees('contexte', [{ qc: 'rqc' }])
      .avecLesReponsesDonnees('thematique', [
        { q2: 'reponse-23' },
        { q1: 'reponse-11' },
      ])
      .avecUnTableauDeRecommandations(tableauDeRecommandations)
      .construis();

    genereLaRestitution(diagnostic);

    expect(
      JSON.parse(
        (await adaptateurRestitution.genereRestitution(diagnostic)).toString(),
      ),
    ).toMatchSnapshot();
  });

  it('génère la restitution avec annexe', async () => {
    const questionsSupplementaires = uneListeDeQuestions()
      .dontLesLabelsSont(['q3', 'q4', 'q5', 'q6', 'q7'])
      .avecLesReponsesPossiblesSuivantesAssociees([
        {
          libelle: 'reponse 31',
          association: uneAssociation()
            .avecIdentifiant('q3')
            .deNiveau1()
            .ayantPourValeurDIndice(0)
            .construis(),
        },
        {
          libelle: 'reponse 41',
          association: uneAssociation()
            .avecIdentifiant('q4')
            .deNiveau1()
            .ayantPourValeurDIndice(0)
            .construis(),
        },
        {
          libelle: 'reponse 51',
          association: uneAssociation()
            .avecIdentifiant('q5')
            .deNiveau1()
            .ayantPourValeurDIndice(0)
            .construis(),
        },
        {
          libelle: 'reponse 61',
          association: uneAssociation()
            .avecIdentifiant('q6')
            .deNiveau1()
            .ayantPourValeurDIndice(0)
            .construis(),
        },
        {
          libelle: 'reponse 71',
          association: uneAssociation()
            .avecIdentifiant('q7')
            .deNiveau1()
            .ayantPourValeurDIndice(0)
            .construis(),
        },
      ])
      .construis();
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .ajouteUneThematique('thematique', [
            ...questions,
            ...questionsSupplementaires,
          ])
          .construis(),
      )
      .avecLesReponsesDonnees('contexte', [{ qc: 'rqc' }])
      .avecLesReponsesDonnees('thematique', [
        { q1: 'reponse-11' },
        { q2: 'reponse-21' },
        { q3: 'reponse-31' },
        { q4: 'reponse-41' },
        { q5: 'reponse-51' },
        { q6: 'reponse-61' },
        { q7: 'reponse-71' },
      ])
      .avecUnTableauDeRecommandations(tableauDeRecommandations)
      .construis();

    genereLaRestitution(diagnostic);

    const buffer = await adaptateurRestitution.genereRestitution(diagnostic);

    buffer.toJSON();

    expect(
      JSON.parse(
        (await adaptateurRestitution.genereRestitution(diagnostic)).toString(),
      ),
    ).toMatchSnapshot();
  });
});
