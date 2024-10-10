import { Meta, StoryObj } from '@storybook/react';
import { FormulaireModificationMotDePasse } from '../../domaine/espace-aidant/mon-compte/ecran-mes-informations/composants/formulaire-modification-mot-de-passe/FormulaireModificationMotDePasse.tsx';
import { ContexteNavigationMAC } from '../../fournisseurs/ContexteNavigationMAC.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantAffichageErreur } from '../../composants/alertes/ComposantAffichageErreur.tsx';
import { Liens } from '../../domaine/Lien.ts';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { ParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';

const meta: Meta<typeof FormulaireModificationMotDePasse> = {
  component: FormulaireModificationMotDePasse,
  parameters: {
    layout: 'fullscreen',
  },
};

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

export default meta;

type Story = StoryObj<typeof meta>;

export const StoryFormulaireModificationMotDePasse: Story = {
  name: 'Modifie le mot de passe',
  args: {
    macAPI: macAPIMemoire,
    lienModificationMotDePasse: {
      url: '/api/profil/modifier-mot-de-passe',
      methode: 'POST',
    },
  },
  decorators: [
    (story) => (
      <ContexteNavigationMAC.Provider
        value={{
          etat: {
            'modifier-mot-de-passe': {
              url: '/api/modifier-mot-de-passe',
              methode: 'POST',
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "L'Aidant clique sur Modifier le mot de passe sans rien remplir",
      async () => {
        userEvent.click(
          canvas.getByRole('button', { name: /modifier le mot de passe/i })
        );

        await waitFor(() =>
          expect(
            canvas.getByText(/vous devez saisir vos mots de passe./i)
          ).toBeInTheDocument()
        );
      }
    );

    await step("L'Aidant se trompe dans la confirmation", async () => {
      const champAncienMotDePasse = canvas.getByRole('textbox', {
        name: /saisissez votre ancien mot de passe/i,
      });
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      await userEvent.type(champAncienMotDePasse, 'a');
      await userEvent.type(champNouveauMotDePasse, 'b');
      await userEvent.type(champConfirmationMotDePasse, 'c');

      await userEvent.click(
        canvas.getByRole('button', { name: /modifier le mot de passe/i })
      );

      await expect(
        canvas.getByText(
          /la confirmation de votre mot de passe ne correspond pas au mot de passe saisi./i
        )
      ).toBeInTheDocument();
    });

    await step(
      "L'utilisateur saisit le même mot de passe que l'ancien mot de passe",
      async () => {
        const champAncienMotDePasse = canvas.getByRole('textbox', {
          name: /saisissez votre ancien mot de passe/i,
        });
        const champNouveauMotDePasse = canvas.getByRole('textbox', {
          name: /choisissez un nouveau mot de passe/i,
        });
        const champConfirmationMotDePasse = canvas.getByRole('textbox', {
          name: /confirmez votre nouveau mot de passe/i,
        });
        await userEvent.clear(champAncienMotDePasse);
        await userEvent.clear(champNouveauMotDePasse);
        await userEvent.clear(champConfirmationMotDePasse);
        await userEvent.type(champAncienMotDePasse, 'a');
        await userEvent.type(champNouveauMotDePasse, 'a');
        await userEvent.type(champConfirmationMotDePasse, 'a');

        await userEvent.click(
          canvas.getByRole('button', { name: /modifier le mot de passe/i })
        );

        await expect(
          canvas.getByText(
            /votre nouveau mot de passe doit être différent de votre ancien mot de passe./i
          )
        ).toBeInTheDocument();
      }
    );

    await step("L'Aidant modifie son mot de passe", async () => {
      const champAncienMotDePasse = canvas.getByRole('textbox', {
        name: /saisissez votre ancien mot de passe/i,
      });
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      await userEvent.clear(champAncienMotDePasse);
      await userEvent.clear(champNouveauMotDePasse);
      await userEvent.clear(champConfirmationMotDePasse);
      await userEvent.type(champAncienMotDePasse, 'a');
      await userEvent.type(champNouveauMotDePasse, 'b');
      await userEvent.type(champConfirmationMotDePasse, 'b');

      await userEvent.click(
        canvas.getByRole('button', { name: /modifier le mot de passe/i })
      );

      await expect(
        canvas.queryByText(/mot de passe modifié avec succès/i)
      ).toBeInTheDocument();

      await expect(valeursSaisies).toStrictEqual({
        ancienMotDePasse: 'a',
        motDePasse: 'b',
        confirmationMotDePasse: 'b',
      });
    });
  },
};
