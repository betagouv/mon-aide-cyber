import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { ReponseAuthentification } from '../domaine/authentification/Authentification.ts';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ComposantConnexion } from '../composants/connexion/ComposantConnexion.tsx';
import { Suspense } from 'react';
import { RequiertAuthentification } from '../fournisseurs/RequiertAuthentification.tsx';
import { ComposantIntercepteur } from '../composants/intercepteurs/ComposantIntercepteur.tsx';
import { TableauDeBord } from '../composants/espace-aidant/tableau-de-bord/TableauDeBord.tsx';

const meta = {
  title: 'Connexion',
  component: ComposantConnexion,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ComposantConnexion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageDeConnexion: Story = {
  decorators: [
    (story) => (
      <MemoryRouter>
        <ContexteMacAPI.Provider
          value={{
            appelle: async <T = Diagnostic, V = void>(
              _parametresAPI: ParametresAPI<V>,
              _: (contenu: Promise<any>) => Promise<T>
            ) => {
              const reponseAuthentification: ReponseAuthentification = {
                nomPrenom: 'Jean Dupont',
                liens: {},
              };
              return reponseAuthentification as T;
            },
          }}
        >
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            <Routes>
              <Route path="/connexion" element={<ComposantConnexion />} />
              <Route
                element={
                  <Suspense>
                    <RequiertAuthentification />
                  </Suspense>
                }
              >
                <Route
                  path="/tableau-de-bord"
                  element={<ComposantIntercepteur composant={TableauDeBord} />}
                ></Route>
              </Route>
            </Routes>
            {story()}
          </ErrorBoundary>
        </ContexteMacAPI.Provider>
      </MemoryRouter>
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
        userEvent.type(champsAdresseEmail, 'identifiant');
        userEvent.clear(champsAdresseEmail);

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
        userEvent.type(champsMotDePasse, 'mdp');
        userEvent.clear(champsMotDePasse);

        await waitFor(() =>
          expect(
            canvas.queryByText(/veuillez saisir votre mot de passe./i)
          ).toBeInTheDocument()
        );
      }
    );
  },
};
