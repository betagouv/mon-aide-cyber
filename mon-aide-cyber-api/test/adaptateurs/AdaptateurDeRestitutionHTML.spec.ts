import { describe, it } from 'vitest';
import {
  uneListeDeQuestions,
  uneQuestion,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import { uneAssociation } from '../constructeurs/constructeurAssociation';
import { unTableauDeRecommandations } from '../constructeurs/constructeurTableauDeRecommandations';
import {
  unDiagnostic,
  unDiagnosticAvecSecteurActivite,
  unDiagnosticEnGironde,
  uneReponseDonnee,
} from '../constructeurs/constructeurDiagnostic';
import { genereLaRestitution } from '../../src/diagnostic/Diagnostic';
import { unAdaptateurDeRestitutionHTML } from './ConstructeurAdaptateurRestitutionHTML';
import {
  AdaptateurDeRestitutionHTML,
  RestitutionHTML,
} from '../../src/adaptateurs/AdaptateurDeRestitutionHTML';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { Entrepots } from '../../src/domaine/Entrepots';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  desInformationsDeRestitution,
  uneRestitution,
} from '../constructeurs/constructeurRestitution';
import { uneRecommandationPriorisee } from '../constructeurs/constructeurRecommandation';

describe('Adapatateur de Restitution HTML', () => {
  const entrepots: Entrepots = new EntrepotsMemoire();
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
      const restitution = uneRestitution()
        .avecIdentifiant(diagnostic.identifiant)
        .avecInformations(desInformationsDeRestitution().construis())
        .construis();
      entrepots.restitution().persiste(restitution);
      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecMesuresPrioritaires('une mesure prioritaire')
        .avecInformations(diagnostic)
        .construis();

      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(
          diagnostic,
          entrepots,
        );

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: '',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: 'une mesure prioritaire',
      });
    });

    it('intègre des mesures prioritaires', async () => {
      const diagnostic = unDiagnostic().construis();
      const restitution = uneRestitution()
        .avecIdentifiant(diagnostic.identifiant)
        .avecRecommandations([uneRecommandationPriorisee().construis()])
        .construis();
      entrepots.restitution().persiste(restitution);

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecMesuresPrioritaires('une mesure prioritaire')
        .construis();

      genereLaRestitution(diagnostic);
      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(
          diagnostic,
          entrepots,
        );

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: '',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: 'une mesure prioritaire',
      });
    });

    it('intègre un indicateur', async () => {
      const diagnostic = unDiagnostic().construis();
      const restitution = uneRestitution()
        .avecIdentifiant(diagnostic.identifiant)
        .avecIndicateurs('thematique', 2)
        .construis();
      entrepots.restitution().persiste(restitution);

      const adaptateurDeRestitutionHTML = unAdaptateurDeRestitutionHTML()
        .avecIndicateurs("un graphe d'indicateurs")
        .construis();

      genereLaRestitution(diagnostic);
      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(
          diagnostic,
          entrepots,
        );

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: '',
        indicateurs: "un graphe d'indicateurs",
        informations: JSON.stringify(restitution.informations),
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
      const recommandationPriorisee = uneRecommandationPriorisee().construis();
      const restitution = uneRestitution()
        .avecIdentifiant(diagnostic.identifiant)
        .avecRecommandations(Array(7).fill(recommandationPriorisee))
        .construis();
      entrepots.restitution().persiste(restitution);

      genereLaRestitution(diagnostic);
      const restitutionHTML =
        await adaptateurDeRestitutionHTML.genereRestitution(
          diagnostic,
          entrepots,
        );

      expect(restitutionHTML).toStrictEqual<RestitutionHTML>({
        autresMesures: 'une mesure non prioritaire',
        indicateurs: '',
        informations: JSON.stringify(restitution.informations),
        mesuresPrioritaires: '',
      });
    });
  });

  describe('représente les informations du diagnostic', () => {
    it("représente l'identifiant", () => {
      const diagnostic = unDiagnostic().construis();

      const informations = new AdaptateurDeRestitutionHTML(
        new Map(),
      ).representeInformations(diagnostic);

      expect(informations.identifiant).toStrictEqual(diagnostic.identifiant);
    });

    it('représente la date de création', () => {
      const diagnostic = unDiagnostic().construis();
      diagnostic.dateCreation = FournisseurHorloge.enDate(
        '2023-01-01T17:01:00',
      );

      const informations = new AdaptateurDeRestitutionHTML(
        new Map(),
      ).representeInformations(diagnostic);

      expect(informations.dateCreation.date).toStrictEqual('01.01.2023');
      expect(informations.dateCreation.heure).toStrictEqual('17:01');
    });

    it('représente la date de dernière modification', () => {
      const diagnostic = unDiagnostic().construis();
      diagnostic.dateDerniereModification = FournisseurHorloge.enDate(
        '2023-01-01T17:01:00',
      );

      const informations = new AdaptateurDeRestitutionHTML(
        new Map(),
      ).representeInformations(diagnostic);

      expect(informations.dateDerniereModification.date).toStrictEqual(
        '01.01.2023',
      );
      expect(informations.dateDerniereModification.heure).toStrictEqual(
        '17:01',
      );
    });

    describe("zone géographique de l'entité", () => {
      it("représente la zone géographique au format '<département>, <région>'", () => {
        const diagnostic = unDiagnosticEnGironde().construis();

        const informations = new AdaptateurDeRestitutionHTML(
          new Map(),
        ).representeInformations(diagnostic);
        expect(informations.zoneGeographique).toStrictEqual(
          'Gironde, Nouvelle-Aquitaine',
        );
      });

      it("si seulement le département est renseigné, représente la zone géographique au format '<département>'", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique('contexte', [
                uneQuestion()
                  .avecIdentifiant('contexte-region-siege-social')
                  .aChoixUnique('région siège social ?', [
                    {
                      identifiant:
                        'contexte-region-siege-social-nouvelle-aquitaine',
                      libelle: 'Nouvelle-Aquitaine',
                    },
                  ])
                  .construis(),
                uneQuestion()
                  .avecIdentifiant('contexte-departement-tom-siege-social')
                  .aChoixUnique('département siège social ?', [
                    {
                      identifiant:
                        'contexte-departement-tom-siege-social-gironde',
                      libelle: 'Gironde',
                    },
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .ajouteUneReponseDonnee(
            {
              thematique: 'contexte',
              question: 'contexte-departement-tom-siege-social',
            },
            uneReponseDonnee()
              .ayantPourReponse('contexte-departement-tom-siege-social-gironde')
              .construis(),
          )
          .construis();

        const informations = new AdaptateurDeRestitutionHTML(
          new Map(),
        ).representeInformations(diagnostic);
        expect(informations.zoneGeographique).toStrictEqual('Gironde');
      });

      it("si seulement la région est renseigné, représente la zone géographique au format '<région>'", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique('contexte', [
                uneQuestion()
                  .avecIdentifiant('contexte-region-siege-social')
                  .aChoixUnique('région siège social ?', [
                    {
                      identifiant:
                        'contexte-region-siege-social-nouvelle-aquitaine',
                      libelle: 'Nouvelle-Aquitaine',
                    },
                  ])
                  .construis(),
                uneQuestion()
                  .avecIdentifiant('contexte-departement-tom-siege-social')
                  .aChoixUnique('département siège social ?', [
                    {
                      identifiant:
                        'contexte-departement-tom-siege-social-gironde',
                      libelle: 'Gironde',
                    },
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .ajouteUneReponseDonnee(
            {
              thematique: 'contexte',
              question: 'contexte-region-siege-social',
            },
            uneReponseDonnee()
              .ayantPourReponse(
                'contexte-region-siege-social-nouvelle-aquitaine',
              )
              .construis(),
          )
          .construis();

        const informations = new AdaptateurDeRestitutionHTML(
          new Map(),
        ).representeInformations(diagnostic);
        expect(informations.zoneGeographique).toStrictEqual(
          'Nouvelle-Aquitaine',
        );
      });

      it("si ni le département ni la région ne sont renseignés, affiche 'non renseigné'", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique('contexte', [
                uneQuestion()
                  .avecIdentifiant('contexte-region-siege-social')
                  .aChoixUnique('région siège social ?', [
                    {
                      identifiant:
                        'contexte-region-siege-social-nouvelle-aquitaine',
                      libelle: 'Nouvelle-Aquitaine',
                    },
                  ])
                  .construis(),
                uneQuestion()
                  .avecIdentifiant('contexte-departement-tom-siege-social')
                  .aChoixUnique('département siège social ?', [
                    {
                      identifiant:
                        'contexte-departement-tom-siege-social-gironde',
                      libelle: 'Gironde',
                    },
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .construis();

        const informations = new AdaptateurDeRestitutionHTML(
          new Map(),
        ).representeInformations(diagnostic);
        expect(informations.zoneGeographique).toStrictEqual('non renseigné');
      });
    });

    describe("secteur d'activité de l'entité", () => {
      it("si renseigné, représente le secteur d'activité", () => {
        const secteurActivite = 'Enseignement';
        const diagnostic =
          unDiagnosticAvecSecteurActivite(secteurActivite).construis();

        const informations = new AdaptateurDeRestitutionHTML(
          new Map(),
        ).representeInformations(diagnostic);

        expect(informations.secteurActivite).toStrictEqual(secteurActivite);
      });

      it("si non renseigné, indique 'non renseigné'", () => {
        const secteurActivite = 'Enseignement';
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique('contexte', [
                uneQuestion()
                  .avecIdentifiant('contexte-secteur-activite')
                  .aChoixUnique("secteur d'activité ?", [
                    {
                      identifiant: 'contexte-secteur-activite-enseignement',
                      libelle: secteurActivite,
                    },
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .construis();

        const informations = new AdaptateurDeRestitutionHTML(
          new Map(),
        ).representeInformations(diagnostic);

        expect(informations.secteurActivite).toStrictEqual('non renseigné');
      });
    });
  });
});
