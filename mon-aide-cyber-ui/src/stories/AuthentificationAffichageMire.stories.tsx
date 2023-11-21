import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { FournisseurEntrepots } from '../fournisseurs/FournisseurEntrepot.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { EntrepotDiagnosticsMemoire } from '../../test/infrastructure/entrepots/EntrepotsMemoire.ts';
import { EntrepotAuthentification, Utilisateur } from '../domaine/authentification/Authentification.ts';
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
  connexion(identifiants: { motDePasse: string; identifiant: string }): Promise<Utilisateur> {
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

export const AfficheLaMireDeConnexion: Story = {
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
  name: 'Affiche la mire de connexion',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque l’aidant clique sur "Se connecter"', async () => {
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
    });

    await step("Lorsque l'aidant clique en dehors de la modale", async () => {
      await userEvent.click(document.body);

      await waitFor(() =>
        expect(canvas.queryByText(/connectez vous/i)).not.toBeInTheDocument(),
      );
    });

    await step('Lorsque l’aidant clique sur le bouton "Annuler"', async () => {
      await userEvent.click(
        canvas.getByRole('link', { name: /Se connecter/i }),
      );

      await userEvent.click(canvas.getByRole('button', { name: /annuler/i }));

      await waitFor(() =>
        expect(canvas.queryByText(/connectez vous/i)).not.toBeInTheDocument(),
      );
    });
  },
};

