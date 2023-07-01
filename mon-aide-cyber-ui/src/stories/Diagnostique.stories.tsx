import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { ComposantDiagnostique } from "../composants/ComposantDiagnostique.tsx";
import { expect } from "@storybook/jest";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { EntrepotDiagnostiqueMemoire } from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import { unDiagnostique } from "../../test/consructeurs/constructeurDiagnostique.ts";
import { unReferentiel } from "../../test/consructeurs/construceurReferentiel.ts";

const entrepotDiagnostiqueMemoire = new EntrepotDiagnostiqueMemoire();

const identifiantUneQuestion = "6dadad14-8fa0-4be7-a8da-473d538eb6c1";
const diagnostiqueAvecUneQuestion = unDiagnostique()
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
const diagnostiqueAvecUnChampsDeSaisie = unDiagnostique()
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
const diagnostiqueAvecPlusieursQuestions = unDiagnostique()
  .avecIdentifiant(identifiantPlusieursQuestions)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion("Une question?")
      .avecUneQuestion("Une autre question?")
      .construis(),
  )
  .construis();
await entrepotDiagnostiqueMemoire.persiste(diagnostiqueAvecUneQuestion);
await entrepotDiagnostiqueMemoire.persiste(diagnostiqueAvecUnChampsDeSaisie);
await entrepotDiagnostiqueMemoire.persiste(diagnostiqueAvecPlusieursQuestions);

const meta = {
  title: "Diagnostique",
  component: ComposantDiagnostique,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) => (
      <FournisseurEntrepots.Provider
        value={{ diagnostique: () => entrepotDiagnostiqueMemoire }}
      >
        {story()}
      </FournisseurEntrepots.Provider>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostique>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheQuestionDiagnostique: Story = {
  name: "Affiche une question du diagnostique",
  args: { identifiant: identifiantUneQuestion },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnostiqueAvecUneQuestion.referentiel.contexte.questions[0].libelle,
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

export const AfficheQuestionDiagnostiqueAvecChampsSaisie: Story = {
  name: "Affiche une question avec plusieurs réponses dont un champs de saisie pour la réponse",
  args: { identifiant: identifiantChampsDeSaise },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() => canvas.getByRole("textbox")),
    ).toBeInTheDocument();
  },
};
export const AfficheDiagnostiqueAvecPlusieursQuestions: Story = {
  name: "Affiche plusieurs questions",
  args: { identifiant: identifiantPlusieursQuestions },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnostiqueAvecPlusieursQuestions.referentiel.contexte.questions[0]
            .libelle,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnostiqueAvecPlusieursQuestions.referentiel.contexte.questions[1]
            .libelle,
        ),
      ),
    ).toBeInTheDocument();
  },
};
