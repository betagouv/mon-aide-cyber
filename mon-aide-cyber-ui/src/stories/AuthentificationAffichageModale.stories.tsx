import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { ReponseAuthentification } from '../domaine/authentification/Authentification.ts';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

const meta = {
  title: 'Authentification',
  component: SeConnecter,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SeConnecter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ModaleDeConnexion: Story = {
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
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            <PortailModale>{story()}</PortailModale>
          </ErrorBoundary>
        </ContexteMacAPI.Provider>
      </BrowserRouter>
    ),
  ],
  name: 'Modale de connexion',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      'Affiche la modale lorsque l’aidant clique sur "Se connecter"',
      async () => {
        await userEvent.click(
          canvas.getByRole('link', { name: /Se connecter/i }),
        );

        expect(
          await waitFor(() =>
            canvas.getByRole('textbox', { name: /votre adresse email/i }),
          ),
        ).toBeInTheDocument();

        expect(
          await canvas.findByLabelText(/votre mot de passe/i),
        ).toBeInTheDocument();

        expect(
          await waitFor(() => canvas.getByRole('button', { name: /annuler/i })),
        ).toBeInTheDocument();

        expect(
          await waitFor(() =>
            canvas.getByRole('button', { name: /se connecter/i }),
          ),
        ).toBeInTheDocument();
      },
    );

    await step(
      "La modale disparaît lorsque l'aidant clique en dehors de la modale",
      async () => {
        await userEvent.click(document.body);

        await waitFor(() =>
          expect(canvas.queryByText(/connectez vous/i)).not.toBeInTheDocument(),
        );
      },
    );

    await step(
      'La modale disparaît lorsque l’aidant clique sur le bouton "Annuler"',
      async () => {
        await userEvent.click(
          canvas.getByRole('link', { name: /Se connecter/i }),
        );

        await userEvent.click(canvas.getByRole('button', { name: /annuler/i }));

        await waitFor(() =>
          expect(canvas.queryByText(/connectez vous/i)).not.toBeInTheDocument(),
        );
      },
    );

    await step(
      'Affiche "Veuillez saisir votre identifiant." lorsque l’aidant saisi un caractère vide',
      async () => {
        await userEvent.click(
          canvas.getByRole('link', { name: /Se connecter/i }),
        );

        const champsAdresseEmail = await waitFor(() =>
          canvas.getByRole('textbox', {
            name: /votre adresse email/i,
          }),
        );
        userEvent.type(champsAdresseEmail, 'identifiant');
        userEvent.clear(champsAdresseEmail);

        await waitFor(() =>
          expect(
            canvas.queryByText(
              /veuillez saisir votre identifiant de connexion./i,
            ),
          ).toBeInTheDocument(),
        );
      },
    );

    await step(
      'Affiche "Veuillez saisir votre mot de passe." lorsque l’aidant saisi un caractère vide',
      async () => {
        await userEvent.click(
          canvas.getByRole('link', { name: /Se connecter/i }),
        );

        const champsMotDePasse = await waitFor(() =>
          canvas.getByRole('textbox', {
            name: /votre mot de passe/i,
          }),
        );
        userEvent.type(champsMotDePasse, 'mdp');
        userEvent.clear(champsMotDePasse);

        await waitFor(() =>
          expect(
            canvas.queryByText(/veuillez saisir votre mot de passe./i),
          ).toBeInTheDocument(),
        );
      },
    );
  },
};
