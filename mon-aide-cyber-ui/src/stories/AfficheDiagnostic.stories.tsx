import { Meta, StoryObj } from '@storybook/react';
import { unDiagnostic } from '../../test/constructeurs/constructeurDiagnostic.ts';
import { waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import {
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
} from '../../test/constructeurs/constructeurQuestions.ts';
import { uneReponsePossible } from '../../test/constructeurs/constructeurReponsePossible.ts';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { unReferentiel } from '../../test/constructeurs/constructeurReferentiel.ts';
import { ComposantDiagnostic } from '../composants/diagnostic/ComposantDiagnostic.tsx';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { UUID } from '../types/Types.ts';
import { ServeurMACMemoire } from './ServeurMACMemoire.ts';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

const identifiantUneQuestion = '6dadad14-8fa0-4be7-a8da-473d538eb6c1';
const diagnosticAvecUneQuestion = unDiagnostic()
  .avecIdentifiant(identifiantUneQuestion)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('Quelle entreprise êtes-vous ?')
          .avecDesReponses([
            uneReponsePossible()
              .avecLibelle('Entreprise privée (ex. TPE, PME, ETI)')
              .construis(),
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();
const identifiantChampsDeSaise = '19aea878-6593-4b2e-b092-678777270d31';
const diagnosticAvecUnChampsDeSaisie = unDiagnostic()
  .avecIdentifiant(identifiantChampsDeSaise)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('Quelle entreprise êtes-vous ?')
          .avecDesReponses([
            uneReponsePossible()
              .avecLibelle('Entreprise privée (ex. TPE, PME, ETI)')
              .construis(),
            uneReponsePossible()
              .avecLibelle('Autre')
              .auFormatTexteDeSaisieLibre()
              .construis(),
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();
const identifiantPlusieursQuestions = '684a9219-83b2-40f5-9752-17675aa00b22';
const diagnosticAvecPlusieursQuestions = unDiagnostic()
  .avecIdentifiant(identifiantPlusieursQuestions)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique().avecLibelle('Une question?').construis(),
      )
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecLibelle('Une autre question?')
          .construis(),
      )
      .construis(),
  )
  .construis();
const identifiantQuestionListeDeroulante =
  '1cdaac38-2ee8-413d-ac00-00f8b5fbad10';
const diagnosticAvecQuestionSousFormeDeListeDeroulante = unDiagnostic()
  .avecIdentifiant(identifiantQuestionListeDeroulante)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestionEtDesReponses(
        { libelle: 'Une liste déroulante?', type: 'liste' },
        [
          uneReponsePossible().avecLibelle('Réponse A').construis(),
          uneReponsePossible().avecLibelle('Réponse B').construis(),
          uneReponsePossible().avecLibelle('Réponse C').construis(),
        ],
      )
      .construis(),
  )
  .construis();

const identifiantReponseEntrainantQuestion =
  '4a0242d6-26c0-459b-85bd-bf2ce9962c9b';
const diagnosticAvecReponseEntrainantQuestion = unDiagnostic()
  .avecIdentifiant(identifiantReponseEntrainantQuestion)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().construis(),
            uneReponsePossible()
              .avecUneQuestion(
                uneQuestionTiroirAChoixMultiple().avecNReponses(2).construis(),
              )
              .avecUneQuestion(
                uneQuestionTiroirAChoixMultiple()
                  .avecNReponses(4)
                  .avecDesReponses([
                    uneReponsePossible()
                      .auFormatTexteDeSaisieLibre()
                      .construis(),
                  ])
                  .construis(),
              )
              .construis(),
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

const identifiantDiagnosticAvecQuestionTiroirAChoixUnique =
  'ba4cbe4d-dbcb-418c-8b8e-98aea21de323';
const unDiagnosticAvecQuestionTiroirAChoixUnique = unDiagnostic()
  .avecIdentifiant(identifiantDiagnosticAvecQuestionTiroirAChoixUnique)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique()
          .avecDesReponses([
            uneReponsePossible()
              .avecUneQuestion(
                uneQuestionAChoixUnique()
                  .avecLibelle('un libelle de question à choix unique')
                  .avecDesReponses([
                    uneReponsePossible()
                      .avecLibelle('un libelle de réponse possible')
                      .construis(),
                  ])
                  .construis(),
              )
              .construis(),
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

const entrepotMemoire = new ServeurMACMemoire();
entrepotMemoire.persiste(diagnosticAvecUneQuestion);
entrepotMemoire.persiste(diagnosticAvecUnChampsDeSaisie);
entrepotMemoire.persiste(diagnosticAvecPlusieursQuestions);
entrepotMemoire.persiste(diagnosticAvecQuestionSousFormeDeListeDeroulante);
entrepotMemoire.persiste(diagnosticAvecReponseEntrainantQuestion);
entrepotMemoire.persiste(unDiagnosticAvecQuestionTiroirAChoixUnique);

const meta = {
  title: 'Diagnostic',
  component: ComposantDiagnostic,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => (
      <ContexteMacAPI.Provider
        value={{
          appelle: async <T = Diagnostic, V = void>(
            parametresAPI: ParametresAPI<V>,
            _: (contenu: Promise<any>) => Promise<T>,
          ) => {
            const idDiagnostic = parametresAPI.url.split('/').at(-1);
            return entrepotMemoire.find(idDiagnostic as UUID) as T;
          },
        }}
      >
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </ContexteMacAPI.Provider>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuestionDiagnostic: Story = {
  name: 'Affiche une seule question du diagnostic',
  args: { idDiagnostic: identifiantUneQuestion },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          `1. ${diagnosticAvecUneQuestion.referentiel.contexte.groupes[0].questions[0].libelle}`,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByLabelText('Entreprise privée (ex. TPE, PME, ETI)'),
      ),
    ).toBeInTheDocument();
    expect(await entrepotMemoire.verifieReponseNonEnvoyee()).toBe(true);
  },
};

export const AfficheQuestionDiagnosticAvecChampsSaisie: Story = {
  name: 'Affiche une question avec plusieurs réponses dont un champs de saisie pour la réponse',
  args: { idDiagnostic: identifiantChampsDeSaise },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() => canvas.getByRole('textbox')),
    ).toBeInTheDocument();
  },
};
export const AfficheDiagnosticAvecPlusieursQuestions: Story = {
  name: 'Affiche plusieurs questions',
  args: { idDiagnostic: identifiantPlusieursQuestions },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          `1. ${diagnosticAvecPlusieursQuestions.referentiel.contexte.groupes[0].questions[0].libelle}`,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByText(
          `2. ${diagnosticAvecPlusieursQuestions.referentiel.contexte.groupes[1].questions[0].libelle}`,
        ),
      ),
    ).toBeInTheDocument();
  },
};

export const AfficheDiagnosticQuestionListeDeroulante: Story = {
  name: 'Affiche les réponses possibles à une question sous forme de liste déroulante',
  args: { idDiagnostic: identifiantQuestionListeDeroulante },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() => canvas.getByRole('combobox')),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole('option', { name: /réponse a/i })),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole('option', { name: /réponse B/i })),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole('option', { name: /réponse c/i })),
    ).toBeInTheDocument();
    expect(await entrepotMemoire.verifieReponseNonEnvoyee()).toBe(true);
  },
};

export const AfficheDiagnosticAvecReponseEntrainantQuestion: Story = {
  name: "Affiche les réponses possibles à une question ainsi qu'une question reliée à une réponse",
  args: { idDiagnostic: identifiantReponseEntrainantQuestion },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const reponseEntrainantQuestion =
      diagnosticAvecReponseEntrainantQuestion.referentiel.contexte.groupes[0]
        .questions[0].reponsesPossibles[2];
    expect(
      await waitFor(() =>
        canvas.findByText(
          reponseEntrainantQuestion.questions?.[0].libelle || '',
        ),
      ),
    ).toBeInTheDocument();
    expect(await waitFor(() => canvas.getAllByRole('checkbox').length)).toBe(7);
    expect(
      await waitFor(() => canvas.getByRole('textbox')),
    ).toBeInTheDocument();
  },
};

export const AfficheDiagnosticAvecQuestionTiroirAChoixUnique: Story = {
  name: 'Affiche la question avec réponses à choix unique sous forme de boutton radio',
  args: { idDiagnostic: identifiantDiagnosticAvecQuestionTiroirAChoixUnique },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText('un libelle de question à choix unique'),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole('radio', { name: /un libelle de réponse possible/i }),
      ),
    ).toBeInTheDocument();
  },
};
