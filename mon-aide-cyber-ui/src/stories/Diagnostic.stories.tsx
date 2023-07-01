import { ComposantDiagnostic } from "../composants/ComposantDiagnostic.tsx";
import { Meta, StoryObj } from "@storybook/react";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { unDiagnostic } from "../../test/consructeurs/constructeurDiagnostic.ts";
import { unReferentiel } from "../../test/consructeurs/construceurReferentiel.ts";
import { waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { EntrepotDiagnosticMemoire } from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";

const entrepotDiagnosticMemoire = new EntrepotDiagnosticMemoire();

const identifiantUneQuestion = "6dadad14-8fa0-4be7-a8da-473d538eb6c1";
const diagnosticAvecUneQuestion = unDiagnostic()
  .avecIdentifiant(identifiantUneQuestion)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion("Quelle entreprise êtes-vous ?", [
        { libelle: "Entreprise privée (ex. TPE, PME, ETI)" },
      ])
      .construis(),
  )
  .construis();
const identifiantChampsDeSaise = "19aea878-6593-4b2e-b092-678777270d31";
const diagnosticAvecUnChampsDeSaisie = unDiagnostic()
  .avecIdentifiant(identifiantChampsDeSaise)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion("Quelle entreprise êtes-vous ?", [
        { libelle: "Entreprise privée (ex. TPE, PME, ETI)" },
        { libelle: "Autre", type: { type: "saisieLibre", format: "texte" } },
      ])
      .construis(),
  )
  .construis();
const identifiantPlusieursQuestions = "684a9219-83b2-40f5-9752-17675aa00b22";
const diagnosticAvecPlusieursQuestions = unDiagnostic()
  .avecIdentifiant(identifiantPlusieursQuestions)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion("Une question?")
      .avecUneQuestion("Une autre question?")
      .construis(),
  )
  .construis();
await entrepotDiagnosticMemoire.persiste(diagnosticAvecUneQuestion);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecUnChampsDeSaisie);
await entrepotDiagnosticMemoire.persiste(diagnosticAvecPlusieursQuestions);

const meta = {
  title: "Diagnostic",
  component: ComposantDiagnostic,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) => (
      <FournisseurEntrepots.Provider
        value={{ diagnostic: () => entrepotDiagnosticMemoire }}
      >
        {story()}
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
