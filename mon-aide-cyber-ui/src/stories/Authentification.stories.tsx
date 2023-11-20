import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { withRouter } from 'storybook-addon-react-router-v6';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { FournisseurEntrepots } from '../fournisseurs/FournisseurEntrepot.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { EntrepotDiagnosticsMemoire } from '../../test/infrastructure/entrepots/EntrepotsMemoire.ts';
import { EntrepotAuthentification } from '../domaine/authentification/Authentification.ts';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { EntrepotDiagnostic } from '../domaine/diagnostic/Diagnostic.ts';

class EntrepotAuthentificationMemoire implements EntrepotAuthentification {
  private aidants: {
    identifiant: string;
    motDePasse: string;
    nomPrenom: string;
  }[] = [];
  connexion(identifiants: { motDePasse: string; identifiant: string }): void {
    this.aidants.find(
      (aidant) =>
        aidant.identifiant === identifiants.identifiant &&
        aidant.motDePasse === identifiants.motDePasse,
    );
  }

  persiste(aidant: {
    identifiant: string;
    motDePasse: string;
    nomPrenom: string;
  }): void {
    this.aidants.push(aidant);
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
  decorators: [
    withRouter,
    (story) => (
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
    ),
  ],
} satisfies Meta<typeof SeConnecter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheLaMireDeConnexion: Story = {
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

export const ConnexionAMonAideCyber: Story = {
  name: 'Tente de se connecter à MonAideCyber',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Lorsque l'aidant se connecte", async () => {
      const aidant = {
        identifiant: 'jean.dupont@mail.fr',
        motDePasse: 'mot-de-passe',
        nomPrenom: 'Jean Dupont',
      };
      entrepoAuthentification.persiste(aidant);
      await userEvent.click(
        canvas.getByRole('link', { name: /Se connecter/i }),
      );

      const champsAdresseEmail = await waitFor(() =>
        canvas.getByRole('textbox', {
          name: /votre adresse email/i,
        }),
      );

      userEvent.type(champsAdresseEmail, aidant.identifiant);
      userEvent.type(
        canvas.getByText(/votre mot de passe/i),
        aidant.motDePasse,
      );
    });
  },
};
