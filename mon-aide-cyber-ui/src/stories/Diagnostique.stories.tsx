import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { ComposantDiagnostique } from "../composants/ComposantDiagnostique.tsx";
import { expect } from "@storybook/jest";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { EntrepotDiagnostiqueMemoire } from "../../test/infrastructure/entrepots/EntrepotMemoire.ts";
import { unDiagnostique } from "../../test/consructeurs/constructeurDiagnostique.ts";
import { unReferentiel } from "../../test/consructeurs/construceurReferentiel.ts";
import { faker } from "@faker-js/faker/locale/fr";
import { UUID } from "../types/Types.ts";

const entrepotDiagnostiqueMemoire = new EntrepotDiagnostiqueMemoire();
const identifiantDiagnostique: UUID = faker.string.uuid() as UUID;

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

export const QuestionDiagnostique: Story = {
  name: "Affiche une seule question du diagnostique",
  args: { identifiant: identifiantDiagnostique },
  play: async ({ canvasElement }) => {
    const diagnostique = unDiagnostique()
      .avecIdentifiant(identifiantDiagnostique)
      .avecUnReferentiel(
        unReferentiel()
          .avecUneQuestion("Quelle entreprise êtes-vous ?", [
            "Entreprise privée (ex. TPE, PME, ETI)",
          ])
          .construis(),
      )
      .construis();
    await entrepotDiagnostiqueMemoire.persiste(diagnostique);
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          diagnostique.referentiel.contexte.questions[0].libelle,
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
