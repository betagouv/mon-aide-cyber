import { Meta, StoryObj } from '@storybook/react-vite';
import { unDiagnostic } from '../../test/constructeurs/constructeurDiagnostic.ts';
import { expect, waitFor, within } from 'storybook/test';
import {
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
} from '../../test/constructeurs/constructeurQuestions.ts';
import { uneReponsePossible } from '../../test/constructeurs/constructeurReponsePossible.ts';
import { unReferentiel } from '../../test/constructeurs/constructeurReferentiel.ts';
import { UUID } from '../types/Types.ts';
import { ServeurMACMemoire } from './ServeurMACMemoire.ts';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { decorateurComposantDiagnostic } from './DecorateurComposantDiagnostic.tsx';
import {
  ActionsHeaderDiagnosticAidant,
  EcranDiagnostic,
} from '../composants/diagnostic/EcranDiagnosticAidant.tsx';
import { HeaderDiagnostic } from '../composants/diagnostic/HeaderDiagnostic.tsx';

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
          .construis()
      )
      .construis()
  )
  .construis();
const identifiantPlusieursQuestions = '684a9219-83b2-40f5-9752-17675aa00b22';
const diagnosticAvecPlusieursQuestions = unDiagnostic()
  .avecIdentifiant(identifiantPlusieursQuestions)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestionAChoixUnique().avecLibelle('Une question?').construis()
      )
      .avecUneQuestion(
        uneQuestionAChoixUnique().avecLibelle('Une autre question?').construis()
      )
      .construis()
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
        ]
      )
      .construis()
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
                uneQuestionTiroirAChoixMultiple().avecNReponses(2).construis()
              )
              .avecUneQuestion(
                uneQuestionTiroirAChoixMultiple()
                  .avecNReponses(4)
                  .avecDesReponses([uneReponsePossible().construis()])
                  .construis()
              )
              .construis(),
          ])
          .construis()
      )
      .construis()
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
                  .construis()
              )
              .construis(),
          ])
          .construis()
      )
      .construis()
  )
  .construis();

const entrepotMemoire = new ServeurMACMemoire();
entrepotMemoire.persiste(diagnosticAvecUneQuestion);
entrepotMemoire.persiste(diagnosticAvecPlusieursQuestions);
entrepotMemoire.persiste(diagnosticAvecQuestionSousFormeDeListeDeroulante);
entrepotMemoire.persiste(diagnosticAvecReponseEntrainantQuestion);
entrepotMemoire.persiste(unDiagnosticAvecQuestionTiroirAChoixUnique);

const macAPIMemoire = {
  execute: <T, U, V = void>(
    parametresAPI: ParametresAPI<V>,
    _transcris: (contenu: Promise<U>) => Promise<T>
  ) => {
    const idDiagnostic = parametresAPI.url.split('/').at(-1);
    return Promise.resolve(entrepotMemoire.find(idDiagnostic as UUID) as T);
  },
};
const meta = {
  title: 'Diagnostic',
  component: EcranDiagnostic,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EcranDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuestionDiagnostic: Story = {
  name: 'Affiche une seule question du diagnostic',
  args: {
    idDiagnostic: identifiantUneQuestion,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantUneQuestion}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) => decorateurComposantDiagnostic(story, identifiantUneQuestion),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          `1. ${diagnosticAvecUneQuestion.referentiel.contexte.groupes[0].questions[0].libelle}`
        )
      )
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByLabelText('Entreprise privée (ex. TPE, PME, ETI)')
      )
    ).toBeInTheDocument();
    expect(await entrepotMemoire.verifieReponseNonEnvoyee()).toBe(true);
  },
};

export const AfficheDiagnosticAvecPlusieursQuestions: Story = {
  name: 'Affiche plusieurs questions',
  args: {
    idDiagnostic: identifiantPlusieursQuestions,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantPlusieursQuestions}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(story, identifiantPlusieursQuestions),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          `1. ${diagnosticAvecPlusieursQuestions.referentiel.contexte.groupes[0].questions[0].libelle}`
        )
      )
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByText(
          `2. ${diagnosticAvecPlusieursQuestions.referentiel.contexte.groupes[1].questions[0].libelle}`
        )
      )
    ).toBeInTheDocument();
  },
};

export const AfficheDiagnosticQuestionListeDeroulante: Story = {
  name: 'Affiche les réponses possibles à une question sous forme de champ de saisie avec auto complétion',
  args: {
    idDiagnostic: identifiantQuestionListeDeroulante,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantQuestionListeDeroulante}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(story, identifiantQuestionListeDeroulante),
  ],
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const champSaisie = await waitFor(() => canvas.getByRole('textbox'));

    expect(await waitFor(() => champSaisie)).toBeInTheDocument();
    userEvent.type(champSaisie, 'r');
    expect(
      await waitFor(() => canvas.getByRole('button', { name: /réponse a/i }))
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole('button', { name: /réponse B/i }))
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole('button', { name: /réponse c/i }))
    ).toBeInTheDocument();
    expect(await entrepotMemoire.verifieReponseNonEnvoyee()).toBe(true);
  },
};

export const AfficheDiagnosticAvecReponseEntrainantQuestion: Story = {
  name: "Affiche les réponses possibles à une question ainsi qu'une question reliée à une réponse",
  args: {
    idDiagnostic: identifiantReponseEntrainantQuestion,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantReponseEntrainantQuestion}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(
        story,
        identifiantReponseEntrainantQuestion
      ),
  ],
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const reponseEntrainantQuestion =
      diagnosticAvecReponseEntrainantQuestion.referentiel.contexte.groupes[0].questions[0].reponsesPossibles.find(
        (r) => r.questions && r.questions?.length > 0
      )!;
    await waitFor(() =>
      expect(
        canvas.getByText(reponseEntrainantQuestion.libelle)
      ).toBeInTheDocument()
    );

    await userEvent.click(
      canvas.getByRole('radio', { name: reponseEntrainantQuestion.libelle })
    );
    const sleep = (time: number) => new Promise((r) => setTimeout(r, time));
    await sleep(20);

    await waitFor(() => {
      const libelleAttendu = reponseEntrainantQuestion.questions?.[0].libelle;
      expect(canvas.getByText(libelleAttendu || '')).toBeInTheDocument();
      expect(canvas.getAllByRole('checkbox').length).toBe(7);
    });
  },
};

export const AfficheDiagnosticAvecQuestionTiroirAChoixUnique: Story = {
  name: 'Affiche la question avec réponses à choix unique sous forme de bouton radio',
  args: {
    idDiagnostic: identifiantDiagnosticAvecQuestionTiroirAChoixUnique,
    macAPI: macAPIMemoire,
    header: (
      <HeaderDiagnostic
        actions={
          <ActionsHeaderDiagnosticAidant
            idDiagnostic={identifiantDiagnosticAvecQuestionTiroirAChoixUnique}
          />
        }
      />
    ),
    accedeALaRestitution: () => null,
  },
  decorators: [
    (story) =>
      decorateurComposantDiagnostic(
        story,
        identifiantDiagnosticAvecQuestionTiroirAChoixUnique
      ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText('un libelle de question à choix unique')
      )
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole('radio', { name: /un libelle de réponse possible/i })
      )
    ).toBeInTheDocument();
  },
};
