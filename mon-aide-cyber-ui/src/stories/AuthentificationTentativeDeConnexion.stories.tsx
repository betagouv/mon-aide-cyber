import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { ReponseAuthentification } from '../domaine/authentification/Authentification.ts';
import { expect } from '@storybook/jest';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';
import { FournisseurAuthentification } from '../fournisseurs/ContexteAuthentification.tsx';
import { RequiertAuthentification } from '../fournisseurs/RequiertAuthentification.tsx';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';

const meta = {
  title: 'Authentification',
  component: SeConnecter,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SeConnecter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConnexionAMonAideCyber: Story = {
  decorators: [
    (story) => (
      <BrowserRouter>
        <ContexteMacAPI.Provider
          value={{
            appelle: async <T = Diagnostic, V = void>(
              _parametresAPI: ParametresAPI<V>,
              _: (contenu: Promise<any>) => Promise<T>,
            ) => {
              const reponseAuthentification: ReponseAuthentification = {
                nomPrenom: 'Jean Dupont',
                liens: {},
              };
              return reponseAuthentification as T;
            },
          }}
        >
          <ContexteNavigationMAC.Provider
            value={{
              etat: { 'se-connecter': { url: '' } },
              setEtat: () => {
                return;
              },
            }}
          >
            <FournisseurAuthentification>
              <RequiertAuthentification />
              <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
                <PortailModale>{story()}</PortailModale>
              </ErrorBoundary>
            </FournisseurAuthentification>
          </ContexteNavigationMAC.Provider>
        </ContexteMacAPI.Provider>
      </BrowserRouter>
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
        canvas.getByRole('link', { name: /Se connecter/i }),
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

      await waitFor(() =>
        expect(canvas.queryByText(/connectez vous/i)).not.toBeInTheDocument(),
      );
    });
  },
};
