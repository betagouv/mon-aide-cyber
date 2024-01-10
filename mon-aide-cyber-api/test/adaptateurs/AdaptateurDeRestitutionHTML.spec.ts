import { describe, it } from 'vitest';
import {
  uneListeDeQuestions,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { uneAssociation } from '../constructeurs/constructeurAssociation';
import { unTableauDeRecommandations } from '../constructeurs/constructeurTableauDeRecommandations';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { genereLaRestitution } from '../../src/diagnostic/Diagnostic';
import { unAdaptateurDeRestitutionHTML } from './ConstructeurAdaptateurRestitutionHTML';
import { RestitutionHTML } from '../../src/adaptateurs/AdaptateurDeRestitutionHTML';

describe('Adapatateur de Restitution HTML', () => {
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

  describe('genère la restitution', () => {
    it('intègre les informations', async () => {
      const diagnostic = unDiagnostic().construis();

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecMesuresPrioritaires('une mesure prioritaire')
        .avecInformations(diagnostic)
        .construis();

      genereLaRestitution(diagnostic);
      const restitution = await adaptateurDeRestitutionHTML.genereRestitution(
        diagnostic,
      );

      expect(restitution).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: '',
        informations: `${diagnostic.identifiant}`,
        mesuresPrioritaires: 'une mesure prioritaire',
      });
    });

    it('intègre des mesures prioritaires', async () => {
      const diagnostic = unDiagnostic().construis();

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecMesuresPrioritaires('une mesure prioritaire')
        .construis();

      genereLaRestitution(diagnostic);
      const restitution = await adaptateurDeRestitutionHTML.genereRestitution(
        diagnostic,
      );

      expect(restitution).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: '',
        informations: '',
        mesuresPrioritaires: 'une mesure prioritaire',
      });
    });

    it('intègre un indicateur', async () => {
      const diagnostic = unDiagnostic().construis();

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecIndicateurs("un graphe d'indicateurs")
        .construis();

      genereLaRestitution(diagnostic);
      const restitution = await adaptateurDeRestitutionHTML.genereRestitution(
        diagnostic,
      );

      expect(restitution).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: "un graphe d'indicateurs",
        informations: '',
        mesuresPrioritaires: '',
      });
    });

    it('intègre les autres mesures', async () => {
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

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecAutresMesures('une mesure non prioritaire')
        .construis();

      genereLaRestitution(diagnostic);
      const restitution = await adaptateurDeRestitutionHTML.genereRestitution(
        diagnostic,
      );

      expect(restitution).toStrictEqual<RestitutionHTML>({
        autresMesures: 'une mesure non prioritaire',
        indicateurs: '',
        informations: '',
        mesuresPrioritaires: '',
      });
    });
  });
});
