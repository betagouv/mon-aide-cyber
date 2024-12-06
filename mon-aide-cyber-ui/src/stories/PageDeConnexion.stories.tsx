import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { ReponseAuthentification } from '../domaine/authentification/Authentification.ts';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Suspense } from 'react';
import { RequiertAuthentification } from '../fournisseurs/RequiertAuthentification.tsx';
import { ComposantIntercepteur } from '../composants/intercepteurs/ComposantIntercepteur.tsx';
import { TableauDeBord } from '../composants/espace-aidant/tableau-de-bord/TableauDeBord.tsx';
import { FournisseurNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { ComposantAuthentification } from '../domaine/authentification/FormulaireAuthentification.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta = {
  title: 'Connexion',
  component: ComposantAuthentification,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ComposantAuthentification>;

const macAPIMemoire = {
  execute: <T, U, V = void>(
    _parametresAPI: ParametresAPI<V>,
    _transcris: (contenu: Promise<U>) => Promise<T>
  ) => {
    if (_parametresAPI.url.includes('contexte')) {
      return Promise.resolve({
        liens: { 'se-connecter': { url: '', methode: 'POST' } },
      } as T);
    }
    const reponseAuthentification: ReponseAuthentification = {
      nomPrenom: 'Jean Dupont',
      liens: {},
    };
    return Promise.resolve(reponseAuthentification as T);
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const PageDeConnexion: Story = {
  args: { macAPI: macAPIMemoire },
  decorators: [
    (story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FournisseurNavigationMAC>
            <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
              <Routes>
                <Route
                  path="/connexion"
                  element={<ComposantAuthentification macAPI={macAPIMemoire} />}
                />
                <Route
                  element={
                    <Suspense>
                      <RequiertAuthentification />
                    </Suspense>
                  }
                >
                  <Route
                    path="/tableau-de-bord"
                    element={
                      <ComposantIntercepteur composant={TableauDeBord} />
                    }
                  ></Route>
                </Route>
              </Routes>
              {story()}
            </ErrorBoundary>
          </FournisseurNavigationMAC>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  name: 'Page de connexion',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Affiche la page de connexion', async () => {
      expect(
        await waitFor(() =>
          canvas.getByRole('textbox', { name: /votre adresse électronique/i })
        )
      ).toBeInTheDocument();

      expect(
        await canvas.findByLabelText(/votre mot de passe/i)
      ).toBeInTheDocument();

      expect(
        await waitFor(() =>
          canvas.getByRole('button', { name: /se connecter/i })
        )
      ).toBeInTheDocument();
    });

    await step(
      'Affiche "Veuillez saisir votre identifiant." lorsque l’aidant saisi un caractère vide',
      async () => {
        const champsAdresseEmail = await waitFor(() =>
          canvas.getByRole('textbox', {
            name: /votre adresse électronique/i,
          })
        );
        await userEvent.type(champsAdresseEmail, 'identifiant');
        await userEvent.clear(champsAdresseEmail);

        await waitFor(() =>
          expect(
            canvas.queryByText(
              /veuillez saisir votre identifiant de connexion./i
            )
          ).toBeInTheDocument()
        );
      }
    );

    await step(
      'Affiche "Veuillez saisir votre mot de passe." lorsque l’aidant saisi un caractère vide',
      async () => {
        const champsMotDePasse = await waitFor(() =>
          canvas.getByRole('textbox', {
            name: /votre mot de passe/i,
          })
        );
        await userEvent.type(champsMotDePasse, 'mdp');
        await userEvent.clear(champsMotDePasse);

        await waitFor(() =>
          expect(
            canvas.queryByText(/veuillez saisir votre mot de passe./i)
          ).toBeInTheDocument()
        );
      }
    );
  },
};
