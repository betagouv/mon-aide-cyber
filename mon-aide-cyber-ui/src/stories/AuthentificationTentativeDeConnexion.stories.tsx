import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';
import { FournisseurEntrepots } from '../fournisseurs/FournisseurEntrepot.ts';
import {
  EntrepotAuthentification,
  ReponseAuthentification,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { expect } from '@storybook/jest';
import { ComposantAffichageErreur } from '../composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';
import { FournisseurAuthentification } from '../fournisseurs/ContexteAuthentification.tsx';
import { RequiertAuthentification } from '../fournisseurs/RequiertAuthentification.tsx';
import { initialiseEntrepots } from './InitialiseEntrepots.tsx';
import { Diagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

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
          value={initialiseEntrepots({
            entrepotAuthentification,
          })}
        >
          <ContexteMacAPI.Provider
            value={{
              appelle: async <T = Diagnostic, V = void>(
                _parametresAPI: ParametresAPI<V>,
                _: (contenu: Promise<any>) => Promise<T>,
              ) => {
                const reponseAuthentification: ReponseAuthentification = {
                  nomPrenom: 'Jean Dupont',
                  liens: { suite: { url: '', methode: '' } },
                };
                return reponseAuthentification as T;
              },
            }}
          >
            <FournisseurAuthentification>
              <RequiertAuthentification />
              <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
                <PortailModale>{story()}</PortailModale>
              </ErrorBoundary>
            </FournisseurAuthentification>
          </ContexteMacAPI.Provider>
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
