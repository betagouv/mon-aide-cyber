import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { ReponseAuthentification } from '../domaine/authentification/Authentification.ts';
import { expect } from '@storybook/jest';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FournisseurAuthentification } from '../fournisseurs/ContexteAuthentification.tsx';
import { RequiertAuthentification } from '../fournisseurs/RequiertAuthentification.tsx';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { Suspense } from 'react';
import { ComposantIntercepteur } from '../composants/intercepteurs/ComposantIntercepteur.tsx';
import { TableauDeBord } from '../composants/TableauDeBord.tsx';
import { Header } from '../composants/Header.tsx';

const meta = {
  title: 'Authentification',
  component: SeConnecter,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SeConnecter>;

export default meta;
type Story = StoryObj<typeof meta>;

let estConnecte = false;
export const ConnexionAMonAideCyber: Story = {
  decorators: [
    (story) => (
      <MemoryRouter>
        <ContexteMacAPI.Provider
          value={{
            appelle: async <T = Diagnostic, V = void>(
              parametresAPI: ParametresAPI<V>,
              _: (contenu: Promise<any>) => Promise<T>,
            ) => {
              const reponseAuthentification: ReponseAuthentification = {
                nomPrenom: 'Jean Dupont',
                liens: {
                  'lancer-diagnostic': {
                    url: '/api/diagnostic',
                    route: '/tableau-de-bord',
                  },
                },
              };
              if (parametresAPI.url === '/api/utilisateur' && estConnecte) {
                return reponseAuthentification as T;
              }
              if (
                parametresAPI.url === '/api/token' &&
                parametresAPI.methode === 'POST'
              ) {
                return reponseAuthentification as T;
              }
              return Promise.reject({
                liens: {
                  'se-connecter': { url: '/api/token', methode: 'POST' },
                },
              });
            },
          }}
        >
          <ContexteNavigationMAC.Provider
            value={{
              etat: {
                'se-connecter': { url: '/api/token', methode: 'POST' },
                'lancer-diagnsotic': {
                  url: '/api/diagnostic',
                  methode: 'POST',
                },
              },
              setEtat: () => {
                return;
              },
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              navigue: (_moteurDeLiens, _action, _exclusion) => {},
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              retourAccueil: () => {},
            }}
          >
            <FournisseurAuthentification>
              <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
                <PortailModale>
                  <Routes>
                    <Route path="/" element={<Header />} />
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
                </PortailModale>
              </ErrorBoundary>
            </FournisseurAuthentification>
          </ContexteNavigationMAC.Provider>
        </ContexteMacAPI.Provider>
      </MemoryRouter>
    ),
  ],
  name: 'Tente de se connecter à MonAideCyber',
  play: async ({ canvasElement, step }) => {
    const aidant = {
      identifiant: 'jean.dupont@mail.fr',
      motDePasse: 'mot-de-passe',
      nomPrenom: 'Jean Dupont',
    };
    const canvas = within(canvasElement);

    await step("Lorsque l'aidant se connecte", async () => {
      await userEvent.click(
        canvas.getAllByRole('link', { name: /Se connecter/i })[1],
      );
      await waitFor(() =>
        expect(canvas.getByText(/connectez vous/i)).toBeInTheDocument(),
      );
      const champsAdresseEmail = await waitFor(() =>
        canvas.getByRole('textbox', {
          name: /votre adresse email/i,
        }),
      );
      const champsMotDePasse = await waitFor(() =>
        canvas.getByRole('textbox', {
          name: /votre mot de passe/i,
        }),
      );

      userEvent.type(champsAdresseEmail, aidant.identifiant);
      userEvent.type(champsMotDePasse, aidant.motDePasse);
      userEvent.click(canvas.getByRole('button', { name: /se connecter/i }));
      estConnecte = true;

      await waitFor(() =>
        expect(
          canvas.queryByRole('button', {
            name: /se connnecter/i,
          }),
        ).not.toBeInTheDocument(),
      );
      await waitFor(() =>
        expect(canvas.queryByText(/Jean D\./i)).toBeInTheDocument(),
      );
    });
  },
};
