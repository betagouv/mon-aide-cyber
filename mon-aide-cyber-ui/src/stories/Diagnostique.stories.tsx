import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { ComposantDiagnostique } from "../composants/ComposantDiagnostique.tsx";
import { expect } from "@storybook/jest";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { EntrepotDiagnostiqueMemoire } from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import { unDiagnostique } from "../../test/consructeurs/constructeurDiagnostique.ts";
import { unReferentiel } from "../../test/consructeurs/constructeurReferentiel.ts";

const entrepotDiagnostiqueMemoire = new EntrepotDiagnostiqueMemoire();

const identifiantUneQuestion = "6dadad14-8fa0-4be7-a8da-473d538eb6c1";
const diagnostiqueAvecUneQuestion = unDiagnostique()
  .avecIdentifiant(identifiantUneQuestion)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion({ libelle: "Quelle entreprise êtes-vous ?" }, [
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
      .avecUneQuestion({ libelle: "Quelle entreprise êtes-vous ?" }, [
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
      .avecUneQuestion({ libelle: "Une question?" })
      .avecUneQuestion({ libelle: "Une autre question?" })
      .construis(),
  )
  .construis();
const identifiantQuestionListeDeroulante =
  "1cdaac38-2ee8-413d-ac00-00f8b5fbad10";
const diagnostiqueAvecQuestionSousFormeDeListeDeroulante = unDiagnostique()
  .avecIdentifiant(identifiantQuestionListeDeroulante)
  .avecUnReferentiel(
    unReferentiel()
      .avecUneQuestion({ libelle: "Une liste déroulante?", type: "liste" }, [
        { libelle: "Réponse A" },
        { libelle: "Réponse B" },
        { libelle: "Réponse C" },
      ])
      .construis(),
  )
  .construis();
await entrepotDiagnostiqueMemoire.persiste(diagnostiqueAvecUneQuestion);
await entrepotDiagnostiqueMemoire.persiste(diagnostiqueAvecUnChampsDeSaisie);
await entrepotDiagnostiqueMemoire.persiste(diagnostiqueAvecPlusieursQuestions);
await entrepotDiagnostiqueMemoire.persiste(
  diagnostiqueAvecQuestionSousFormeDeListeDeroulante,
);

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
  args: { idDiagnostique: identifiantUneQuestion },
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
  args: { idDiagnostique: identifiantChampsDeSaise },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() => canvas.getByRole("textbox")),
    ).toBeInTheDocument();
  },
};
export const AfficheDiagnostiqueAvecPlusieursQuestions: Story = {
  name: "Affiche plusieurs questions",
  args: { idDiagnostique: identifiantPlusieursQuestions },
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

export const AfficheDiagnostiqueQuestionListeDeroulante: Story = {
  name: "Affiche les réponses possibles à une question sous forme de liste déroulante",
  args: { idDiagnostique: identifiantQuestionListeDeroulante },
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
