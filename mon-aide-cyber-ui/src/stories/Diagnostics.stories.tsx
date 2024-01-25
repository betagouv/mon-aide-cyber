import type { Meta, StoryObj } from '@storybook/react';
import { waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { FournisseurEntrepots } from '../fournisseurs/FournisseurEntrepot.ts';
import { EntrepotDiagnosticsMemoire } from '../../test/infrastructure/entrepots/EntrepotsMemoire.ts';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantDiagnostics } from '../composants/ComposantDiagnostics.tsx';
import { lesDiagnostics } from '../../test/constructeurs/ConstructeurDiagnostics.ts';
import { actions } from '../domaine/Actions.ts';
import { unDiagnostic } from '../../test/constructeurs/constructeurDiagnostic.ts';
import { EntrepotDiagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { EntrepotAuthentification } from '../domaine/authentification/Authentification.ts';
import { BrowserRouter } from 'react-router-dom';
import { EntrepotContact } from '../infrastructure/entrepots/APIEntrepotContact.ts';

const entrepotDiagnosticsMemoire = new EntrepotDiagnosticsMemoire();
const premierDiagnostic = unDiagnostic().construis();
const deuxiemeDiagnostic = unDiagnostic().construis();
const troisiemeDiagnostic = unDiagnostic().construis();

const diagnostics = lesDiagnostics([
  premierDiagnostic,
  deuxiemeDiagnostic,
  troisiemeDiagnostic,
])
  .avecLesActions([actions.diagnostics().AFFICHER])
  .construis();
await entrepotDiagnosticsMemoire.persiste(diagnostics);

const meta = {
  title: 'Liste diagnostics',
  component: ComposantDiagnostics,
  parameters: {
    layout: 'fullscreen',
    reactRouter: {
      routePath: '/diagnostics',
    },
  },
  decorators: [
    (story) => (
      <BrowserRouter>
        <FournisseurEntrepots.Provider
          value={{
            diagnostic: () => ({}) as unknown as EntrepotDiagnostic,
            diagnostics: (): EntrepotDiagnostics => entrepotDiagnosticsMemoire,
            authentification: (): EntrepotAuthentification =>
              ({}) as unknown as EntrepotAuthentification,
            contact: (): EntrepotContact => ({}) as unknown as EntrepotContact,
          }}
        >
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            {story()}
          </ErrorBoundary>
        </FournisseurEntrepots.Provider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheLIsteDiagnostics: Story = {
  name: 'Affiche une liste de diagnostics',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByRole('button', { name: /lancer un diagnostic/i }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole('link', { name: premierDiagnostic.identifiant }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole('link', { name: deuxiemeDiagnostic.identifiant }),
      ),
    ).toBeInTheDocument();
    expect(
      await waitFor(() =>
        canvas.getByRole('link', { name: troisiemeDiagnostic.identifiant }),
      ),
    ).toBeInTheDocument();
  },
};
