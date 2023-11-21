import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
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

export const ConnexionAMonAideCyber: Story = {
  decorators: [
    (story) => (
      <BrowserRouter>
        <FournisseurEntrepots.Provider
          value={{
            diagnostic: () => ({}) as unknown as EntrepotDiagnostic,
            diagnostics: (): EntrepotDiagnostics =>
              new EntrepotDiagnosticsMemoire(),
            authentification: (): EntrepotAuthentification =>
              new EntrepotAuthentificationMemoire(),
          }}
        >
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            <PortailModale>{story()}</PortailModale>
          </ErrorBoundary>
        </FournisseurEntrepots.Provider>
      </BrowserRouter>
    ),
  ],
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
