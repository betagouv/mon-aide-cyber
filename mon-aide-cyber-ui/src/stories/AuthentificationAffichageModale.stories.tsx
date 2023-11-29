import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { FournisseurEntrepots } from '../fournisseurs/FournisseurEntrepot.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { EntrepotDiagnosticsMemoire } from '../../test/infrastructure/entrepots/EntrepotsMemoire.ts';
import {
  EntrepotAuthentification,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { EntrepotDiagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { BrowserRouter } from 'react-router-dom';

class EntrepotAuthentificationMemoire implements EntrepotAuthentification {
  private aidants: {
    identifiant: string;
    motDePasse: string;
    nomPrenom: string;
  }[] = [];
  connexion(identifiants: {
    motDePasse: string;
    identifiant: string;
  }): Promise<Utilisateur> {
    const aidantTrouve = this.aidants.find(
      (aidant) =>
        aidant.identifiant === identifiants.identifiant &&
        aidant.motDePasse === identifiants.motDePasse,
    );

    if (aidantTrouve === undefined) {
      return Promise.reject();
    }

    return Promise.resolve(aidantTrouve);
  }

  persiste(aidant: {
    identifiant: string;
    motDePasse: string;
    nomPrenom: string;
  }): void {
    this.aidants.push(aidant);
  }

  utilisateurAuthentifie(): Promise<Utilisateur> {
    return Promise.resolve(this.aidants[0]);
  }

  utilisateurAuthentifieSync(): Utilisateur | null {
    return this.aidants[0] || null;
  }
}
const entrepoAuthentification: EntrepotAuthentificationMemoire =
  new EntrepotAuthentificationMemoire();

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
        <FournisseurEntrepots.Provider
          value={{
            diagnostic: () => ({}) as unknown as EntrepotDiagnostic,
            diagnostics: (): EntrepotDiagnostics =>
              new EntrepotDiagnosticsMemoire(),
            authentification: (): EntrepotAuthentification =>
              entrepoAuthentification,
          }}
        >
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            <PortailModale>{story()}</PortailModale>
          </ErrorBoundary>
        </FournisseurEntrepots.Provider>
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
