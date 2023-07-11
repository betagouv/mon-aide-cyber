import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { EntrepotDiagnosticsMemoire } from "../../test/infrastructure/entrepots/EntrepotsMemoire.ts";
import { unDiagnostique } from "../../test/consructeurs/constructeurDiagnostique.ts";
import { ComposantAffichageErreur } from "../composants/erreurs/ComposantAffichageErreur.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ComposantDiagnostics } from "../composants/ComposantDiagnostics.tsx";
import { EntrepotDiagnostics } from "../domaine/diagnostique/Diagnostics.ts";
import { EntrepotDiagnostique } from "../domaine/diagnostique/Diagnostique.ts";
import { withRouter } from "storybook-addon-react-router-v6";
import { lesDiagnostics } from "../../test/consructeurs/ConstructeurDiagnostics.ts";
import { actions } from "../domaine/Actions.ts";

const entrepotDiagnosticsMemoire = new EntrepotDiagnosticsMemoire();
const premierDiagnostic = unDiagnostique().construis();
const deuxiemeDiagnostic = unDiagnostique().construis();
const troisiemeDiagnostic = unDiagnostique().construis();

const diagnostics = lesDiagnostics([
  premierDiagnostic,
  deuxiemeDiagnostic,
  troisiemeDiagnostic,
])
  .avecLesActions([actions.diagnostics().AFFICHER])
  .construis();
await entrepotDiagnosticsMemoire.persiste(diagnostics);

const meta = {
  title: "Liste diagnostics",
  component: ComposantDiagnostics,
  parameters: {
    layout: "fullscreen",
    reactRouter: {
      routePath: "/diagnostics",
    },
  },
  decorators: [
    withRouter,
    (story) => (
      <FournisseurEntrepots.Provider
        value={{
          diagnostique: () => ({}) as unknown as EntrepotDiagnostique,
          diagnostics: (): EntrepotDiagnostics => entrepotDiagnosticsMemoire,
        }}
      >
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </FournisseurEntrepots.Provider>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheLIsteDiagnostics: Story = {
  name: "Affiche une liste de diagnostics",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByRole("button", { name: /lancer un diagnostic/i }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole("link", { name: premierDiagnostic.identifiant }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole("link", { name: deuxiemeDiagnostic.identifiant }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole("link", { name: troisiemeDiagnostic.identifiant }),
      ),
    ).toBeInTheDocument();
  },
};
