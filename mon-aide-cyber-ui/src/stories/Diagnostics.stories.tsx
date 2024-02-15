import type { Meta, StoryObj } from '@storybook/react';
import { waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantDiagnostics } from '../composants/ComposantDiagnostics.tsx';
import { lesDiagnostics } from '../../test/constructeurs/ConstructeurDiagnostics.ts';
import { actions } from '../domaine/Actions.ts';
import { unDiagnostic } from '../../test/constructeurs/constructeurDiagnostic.ts';
import { BrowserRouter } from 'react-router-dom';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

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
        <ContexteMacAPI.Provider
          value={{
            appelle: async <T = Diagnostic, V = void>(
              _parametresAPI: ParametresAPI<V>,
              _: (contenu: Promise<any>) => Promise<T>,
            ) => {
              return diagnostics as T;
            },
          }}
        >
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            {story()}
          </ErrorBoundary>
        </ContexteMacAPI.Provider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ComposantDiagnostics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheListeDiagnostics: Story = {
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
