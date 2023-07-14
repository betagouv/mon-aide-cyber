import { Meta, StoryObj } from "@storybook/react";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { unDiagnostic } from "../../test/consructeurs/constructeurDiagnostic.ts";
import { waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  EntrepotDiagnosticMemoire,
  EntrepotDiagnosticsMemoire,
} from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import {
  uneQuestion,
  uneQuestionAChoixMultiple,
} from "../../test/consructeurs/constructeurQuestions.ts";
import { uneReponsePossible } from "../../test/consructeurs/constructeurReponsePossible.ts";
import { ComposantAffichageErreur } from "../composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { unReferentiel } from "../../test/consructeurs/constructeurReferentiel.ts";
import { ComposantDiagnostic } from "../composants/diagnostic/ComposantDiagnostic.tsx";
import { EntrepotDiagnostics } from "../domaine/diagnostic/Diagnostics.ts";
import { uneReponseComplementaire } from "../../test/consructeurs/constructeurReponseComplementaire.ts";

const entrepotDiagnosticMemoire = new EntrepotDiagnosticMemoire();

const identifiantUneQuestion = "6dadad14-8fa0-4be7-a8da-473d538eb6c1";
const diagnosticAvecUneQuestion = unDiagnostic()
  .avecIdentifiant(identifiantUneQuestion)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestionEtDesReponses(
        { libelle: "Quelle entreprise êtes-vous ?" },
        [
          uneReponsePossible()
            .avecLibelle("Entreprise privée (ex. TPE, PME, ETI)")
            .construis(),
        ],
      )
      .construis(),
  )
  .construis();
const identifiantChampsDeSaise = "19aea878-6593-4b2e-b092-678777270d31";
const diagnosticAvecUnChampsDeSaisie = unDiagnostic()
  .avecIdentifiant(identifiantChampsDeSaise)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestionEtDesReponses(
        { libelle: "Quelle entreprise êtes-vous ?" },
        [
          uneReponsePossible()
            .avecLibelle("Entreprise privée (ex. TPE, PME, ETI)")
            .construis(),
          uneReponsePossible()
            .avecLibelle("Autre")
            .auFormatTexteDeSaisieLibre()
            .construis(),
        ],
      )
      .construis(),
  )
  .construis();
const identifiantPlusieursQuestions = "684a9219-83b2-40f5-9752-17675aa00b22";
const diagnosticAvecPlusieursQuestions = unDiagnostic()
  .avecIdentifiant(identifiantPlusieursQuestions)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestionEtDesReponses({ libelle: "Une question?" })
      .avecUneQuestionEtDesReponses({ libelle: "Une autre question?" })
      .construis(),
  )
  .construis();
const identifiantQuestionListeDeroulante =
  "1cdaac38-2ee8-413d-ac00-00f8b5fbad10";
const diagnosticAvecQuestionSousFormeDeListeDeroulante = unDiagnostic()
  .avecIdentifiant(identifiantQuestionListeDeroulante)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestionEtDesReponses(
        { libelle: "Une liste déroulante?", type: "liste" },
        [
          uneReponsePossible().avecLibelle("Réponse A").construis(),
          uneReponsePossible().avecLibelle("Réponse B").construis(),
          uneReponsePossible().avecLibelle("Réponse C").construis(),
        ],
      )
      .construis(),
  )
  .construis();

const identifiantReponseEntrainantQuestion =
  "4a0242d6-26c0-459b-85bd-bf2ce9962c9b";
const diagnosticAvecReponseEntrainantQuestion = unDiagnostic()
  .avecIdentifiant(identifiantReponseEntrainantQuestion)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestion()
          .avecDesReponses([
            uneReponsePossible().construis(),
            uneReponsePossible().construis(),
            uneReponsePossible()
              .avecUneQuestion(
                uneQuestionAChoixMultiple()
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

const identifiantReponseComplementaire = "47713b22-9595-4205-9e5f-0c2fe1daa639";
const diagnosticAvecReponseComplementaire = unDiagnostic()
  .avecIdentifiant(identifiantReponseComplementaire)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion(
        uneQuestion()
          .avecDesReponses([
            uneReponsePossible()
              .avecReponsesComplementaires([
                uneReponseComplementaire()
                  .avecLibelle("Réponse Complémentaire 1")
                  .construis(),
                uneReponseComplementaire()
                  .avecLibelle("Réponse Complémentaire 2")
                  .auFormatTexteEnSaisieLibre()
                  .construis(),
              ])
              .construis(),
          ])
          .construis(),
      )
      .construis(),
  )
  .construis();

await entrepotDiagnosticMemoire.persiste(diagnosticAvecUneQuestion);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecUnChampsDeSaisie);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecPlusieursQuestions);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecQuestionSousFormeDeListeDeroulante,
);
await entrepotDiagnosticMemoire.persiste(
  diagnosticAvecReponseEntrainantQuestion,
);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecReponseComplementaire);

const meta = {
  title: "Diagnostic",
  component: ComposantDiagnostic,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) => (
      <FournisseurEntrepots.Provider
        value={{
          diagnostic: () => entrepotDiagnosticMemoire,
          diagnostics: (): EntrepotDiagnostics =>
            new EntrepotDiagnosticsMemoire(),
        }}
      >
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </FournisseurEntrepots.Provider>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuestionDiagnostic: Story = {
  name: "Affiche une seule question du diagnostic",
  args: { idDiagnostic: identifiantUneQuestion },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnosticAvecUneQuestion.referentiel.contexte.questions[0].libelle,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByLabelText("Entreprise privée (ex. TPE, PME, ETI)"),
      ),
    ).toBeInTheDocument();
  },
};

export const AfficheQuestionDiagnosticAvecChampsSaisie: Story = {
  name: "Affiche une question avec plusieurs réponses dont un champs de saisie pour la réponse",
  args: { idDiagnostic: identifiantChampsDeSaise },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() => canvas.getByRole("textbox")),
    ).toBeInTheDocument();
  },
};
export const AfficheDiagnosticAvecPlusieursQuestions: Story = {
  name: "Affiche plusieurs questions",
  args: { idDiagnostic: identifiantPlusieursQuestions },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnosticAvecPlusieursQuestions.referentiel.contexte.questions[0]
            .libelle,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnosticAvecPlusieursQuestions.referentiel.contexte.questions[1]
            .libelle,
        ),
      ),
    ).toBeInTheDocument();
  },
};

export const AfficheDiagnosticQuestionListeDeroulante: Story = {
  name: "Affiche les réponses possibles à une question sous forme de liste déroulante",
  args: { idDiagnostic: identifiantQuestionListeDeroulante },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() => canvas.getByRole("listbox")),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole("option", { name: /réponse a/i })),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole("option", { name: /réponse B/i })),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole("option", { name: /réponse c/i })),
    ).toBeInTheDocument();
  },
};

export const AfficheDiagnosticAvecReponseEntrainantQuestion: Story = {
  name: "Affiche les réponses possibles à une question ainsi qu'une question reliée à une réponse",
  args: { idDiagnostic: identifiantReponseEntrainantQuestion },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const reponseEntrainantQuestion =
      diagnosticAvecReponseEntrainantQuestion.referentiel.contexte.questions[0]
        .reponsesPossibles[2];
    expect(
      await waitFor(() =>
        canvas.findByText(reponseEntrainantQuestion.question?.libelle || ""),
      ),
    ).toBeInTheDocument();
    expect(await waitFor(() => canvas.getAllByRole("checkbox").length)).toBe(5);
    expect(
      await waitFor(() => canvas.getByRole("textbox")),
    ).toBeInTheDocument();
  },
};

export const AfficheDiagnosticAvecReponsesComplementaires: Story = {
  name: "Affiche les réponses complémentaires à une réponse possible",
  args: { idDiagnostic: identifiantReponseComplementaire },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByRole("checkbox", { name: /réponse complémentaire 1/i }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole("checkbox", { name: /réponse complémentaire 2/i }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() => canvas.getByRole("textbox")),
    ).toBeInTheDocument();
  },
};
