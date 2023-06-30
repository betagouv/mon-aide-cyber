import { UUID } from "../types/Types.ts";
import { faker } from "@faker-js/faker/locale/fr";
import { ComposantDiagnostic } from "../composants/ComposantDiagnostic.tsx";
import { Meta, StoryObj } from "@storybook/react";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { unDiagnostic } from "../../test/consructeurs/constructeurDiagnostic.ts";
import { unReferentiel } from "../../test/consructeurs/construceurReferentiel.ts";
import { waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { EntrepotDiagnosticMemoire } from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";

const entrepotDiagnosticMemoire = new EntrepotDiagnosticMemoire();
const identifiantDiagnostic: UUID = faker.string.uuid() as UUID;

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
  args: { idDiagnostic: identifiantDiagnostic },
  play: async ({ canvasElement }) => {
    const diagnostic = unDiagnostic()
      .avecIdentifiant(identifiantDiagnostic)
      .avecUnReferentiel(
        unReferentiel()
          .avecUneQuestion("Quelle entreprise êtes-vous ?", [
            "Entreprise privée (ex. TPE, PME, ETI)",
          ])
          .construis(),
      )
      .construis();
    await entrepotDiagnosticMemoire.persiste(diagnostic);
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(diagnostic.referentiel.contexte.questions[0].libelle),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByLabelText("Entreprise privée (ex. TPE, PME, ETI)"),
      ),
    ).toBeInTheDocument();
  },
};
