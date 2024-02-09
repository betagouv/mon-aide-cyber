import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { FournisseurEntrepots } from '../fournisseurs/FournisseurEntrepot.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { EntrepotDiagnosticsMemoire } from '../../test/infrastructure/entrepots/EntrepotsMemoire.ts';
import {
  EntrepotAuthentification,
  ReponseAuthentification,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { expect } from '@storybook/jest';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { EntrepotDiagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { BrowserRouter } from 'react-router-dom';
import { FournisseurAuthentification } from '../fournisseurs/ContexteAuthentification.tsx';
import { RequiertAuthentification } from '../fournisseurs/RequiertAuthentification.tsx';
import { EntrepotContact } from '../infrastructure/entrepots/APIEntrepotContact.ts';

class EntrepotAuthentificationMemoire implements EntrepotAuthentification {
  private aidants: {
    identifiant: string;
    motDePasse: string;
    nomPrenom: string;
  }[] = [];

  connexion(identifiants: {
    motDePasse: string;
    identifiant: string;
  }): Promise<ReponseAuthentification> {
    const aidantTrouve = this.aidants.find(
      (aidant) =>
        aidant.identifiant === identifiants.identifiant &&
        aidant.motDePasse === identifiants.motDePasse,
    );

    if (aidantTrouve === undefined) {
      return Promise.reject();
    }

    return Promise.resolve({
      nomPrenom: aidantTrouve.nomPrenom,
      liens: { suite: { url: '', methode: '' } },
    });
  }

  persiste(aidant: {
    identifiant: string;
    motDePasse: string;
    nomPrenom: string;
  }): Promise<void> {
    this.aidants.push(aidant);
    return Promise.resolve();
  }

  utilisateurAuthentifie(): Promise<Utilisateur> {
    return Promise.resolve(this.aidants[0]);
  }

  utilisateurAuthentifieSync(): Utilisateur | null {
    return this.aidants[0] || null;
  }
}

const entrepotAuthentification: EntrepotAuthentificationMemoire =
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
              entrepotAuthentification,
            contact: (): EntrepotContact => ({}) as unknown as EntrepotContact,
          }}
        >
          <FournisseurAuthentification>
            <RequiertAuthentification />
            <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
              <PortailModale>{story()}</PortailModale>
            </ErrorBoundary>
          </FournisseurAuthentification>
        </FournisseurEntrepots.Provider>
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
    await entrepotAuthentification.persiste(aidant);
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
