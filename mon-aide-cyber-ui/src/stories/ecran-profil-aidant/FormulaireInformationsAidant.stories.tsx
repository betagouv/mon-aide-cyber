import { Meta, StoryObj } from '@storybook/react';
import { expect, waitFor, within } from '@storybook/test';
import { ParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ContexteNavigationMAC } from '../../fournisseurs/ContexteNavigationMAC.tsx';
import { ComposantAffichageErreur } from '../../composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { Liens } from '../../domaine/Lien.ts';
import { FormulaireInformationsAidant } from '../../domaine/espace-aidant/mon-compte/ecran-mes-informations/composants/formulaire-informations-aidant/FormulaireInformationsAidant.tsx';

const meta: Meta<typeof FormulaireInformationsAidant> = {
  title: "Information sur le profil de l'Aidant",
  component: FormulaireInformationsAidant,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

let valeursSaisies = {};

const macAPIMemoire = {
  execute: <T, U, V = void>(
    parametresAPI: ParametresAPI<V>,
    _transcris: (contenu: Promise<U>) => Promise<T>
  ) => {
    valeursSaisies = parametresAPI.corps!;
    return Promise.resolve({
      nomPrenom: 'Jean Dupont',
      dateSignatureCGU: '11.03.2024',
      consentementAnnuaire: true,
      identifiantConnexion: 'j.dup@mail.com',
      liens: {
        'lancer-diagnostic': {
          url: '/api/diagnostic',
          methode: 'POST',
        },
        'modifier-mot-de-passe': {
          url: '/api/profil/modifier-mot-de-passe',
          methode: 'POST',
        },
        'se-deconnecter': {
          url: '/api/token',
          methode: 'DELETE',
        },
      },
    } as T);
  },
};

export const StoryFormulaireInformationsAidant: Story = {
  args: { macAPI: macAPIMemoire },
  decorators: [
    (story) => (
      <ContexteNavigationMAC.Provider
        value={{
          etat: {
            'afficher-profil': {
              url: '/api/afficher-profil',
              methode: 'GET',
            },
          },
          setEtat: () => {
            return;
          },
          ajouteEtat: (_liens: Liens) => {
            return;
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          navigue: (_moteurDeLiens, _action, _exclusion) => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          retourAccueil: () => {},
        }}
      >
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </ContexteNavigationMAC.Provider>
    ),
  ],
  name: "Affiche la page profil de l'Aidant",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Avec les informations de l'Aidant", async () => {
      await waitFor(() =>
        expect(
          canvas.getByText(/compte crée le 11.03.2024/i)
        ).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(
          canvas.getByRole('button', { name: /mes diagnostics/i })
        ).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(canvas.getByDisplayValue(/jean/i)).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(canvas.getByDisplayValue(/dupont/i)).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(canvas.getByDisplayValue(/j.dup@mail.com/i)).toBeInTheDocument()
      );
    });

    await step(
      "Avec le formulaire de modification de mot de passe de l'Aidant",
      async () => {
        expect(
          canvas.getByRole('textbox', {
            name: /saisissez votre ancien mot de passe/i,
          })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole('textbox', {
            name: /choisissez un nouveau mot de passe/i,
          })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole('textbox', {
            name: /confirmez votre nouveau mot de passe/i,
          })
        ).toBeInTheDocument();
      }
    );
  },
};
