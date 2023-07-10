import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { ComposantDiagnostique } from "../composants/diagnostic/ComposantDiagnostique.tsx";
import { expect } from "@storybook/jest";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { EntrepotDiagnostiqueMemoire } from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import { ErrorBoundary } from "react-error-boundary";
import { ComposantAffichageErreur } from "../composants/erreurs/ComposantAffichageErreur.tsx";

const entrepotDiagnostiqueMemoire = new EntrepotDiagnostiqueMemoire();

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
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </FournisseurEntrepots.Provider>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostique>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheErreurRecuperationDiagnostique: Story = {
  name: "Affiche le message d'erreur lorsque l'on ne peut récupérer un diagnostique",
  args: { idDiagnostique: "6dadad14-8fa0-4be7-a8da-473d538eb6c1" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByText(
          "Entitée 6dadad14-8fa0-4be7-a8da-473d538eb6c1 non trouvée.",
        ),
      ),
    ).toBeInTheDocument();
  },
};
