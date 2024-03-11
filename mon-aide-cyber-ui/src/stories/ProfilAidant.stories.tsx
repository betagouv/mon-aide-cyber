import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { ComposantFormulaireModificationMotDePasse } from '../composants/profil/ComposantFormulaireModificationMotDePasse.tsx';

const meta = {
  title: "Modification du mot de passe de l'Aidant",
  component: ComposantFormulaireModificationMotDePasse,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ComposantFormulaireModificationMotDePasse>;

export default meta;
type Story = StoryObj<typeof meta>;
let valeursSaisies = {};

export const ModificationMotDePasseAidant: Story = {
  decorators: [
    (story) => (
      <ContexteMacAPI.Provider
        value={{
          appelle: async <T = any, V = void>(
            parametresAPI: ParametresAPI<V>,
            _: (contenu: Promise<any>) => Promise<T>,
          ) => {
            valeursSaisies = parametresAPI.corps!;
            return Promise.resolve({ liens: { url: '' } }) as Promise<T>;
          },
        }}
      >
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            navigue: (_moteurDeLiens, _action, _exclusion) => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            retourAccueil: () => {},
          }}
        >
          {story()}
        </ContexteNavigationMAC.Provider>
      </ContexteMacAPI.Provider>
    ),
  ],
  name: 'Modifie le mot de passe',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Lorsque l'on arrive sur la page de création de l'aidant",
      async () => {
        expect(
          canvas.getByRole('textbox', {
            name: /saisissez votre ancien mot de passe/i,
          }),
        ).toBeInTheDocument();
        expect(
          canvas.getByRole('textbox', {
            name: /choisissez un nouveau mot de passe/i,
          }),
        ).toBeInTheDocument();
        expect(
          canvas.getByRole('textbox', {
            name: /confirmez votre nouveau mot de passe/i,
          }),
        ).toBeInTheDocument();
      },
    );

    await step(
      "L'Aidant clique sur Modifier le mot de passe sans rien remplir",
      async () => {
        userEvent.click(
          canvas.getByRole('button', { name: /modifier le mot de passe/i }),
        );

        await waitFor(() =>
          expect(
            canvas.getByText(/vous devez saisir vos mots de passe./i),
          ).toBeInTheDocument(),
        );
      },
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
      userEvent.type(champAncienMotDePasse, 'a');
      userEvent.type(champNouveauMotDePasse, 'b');
      userEvent.type(champConfirmationMotDePasse, 'c');

      userEvent.click(
        canvas.getByRole('button', { name: /modifier le mot de passe/i }),
      );

      await waitFor(() =>
        expect(
          canvas.getByText(
            /la confirmation de votre mot de passe ne correspond pas au mot de passe saisi./i,
          ),
        ).toBeInTheDocument(),
      );
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
        userEvent.clear(champAncienMotDePasse);
        userEvent.clear(champNouveauMotDePasse);
        userEvent.clear(champConfirmationMotDePasse);
        userEvent.type(champAncienMotDePasse, 'a');
        userEvent.type(champNouveauMotDePasse, 'a');
        userEvent.type(champConfirmationMotDePasse, 'a');

        userEvent.click(
          canvas.getByRole('button', { name: /modifier le mot de passe/i }),
        );

        await waitFor(() =>
          expect(
            canvas.getByText(
              /votre nouveau mot de passe doit être différent de votre ancien mot de passe./i,
            ),
          ).toBeInTheDocument(),
        );
      },
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
      userEvent.clear(champAncienMotDePasse);
      userEvent.clear(champNouveauMotDePasse);
      userEvent.clear(champConfirmationMotDePasse);
      userEvent.type(champAncienMotDePasse, 'a');
      userEvent.type(champNouveauMotDePasse, 'b');
      userEvent.type(champConfirmationMotDePasse, 'b');

      userEvent.click(
        canvas.getByRole('button', { name: /modifier le mot de passe/i }),
      );

      await waitFor(() =>
        expect(
          canvas.queryByText(/mot de passe modifié avec succès/i),
        ).not.toBeInTheDocument(),
      );
      await waitFor(() =>
        expect(valeursSaisies).toStrictEqual({
          ancienMotDePasse: 'a',
          motDePasse: 'b',
          confirmationMotDePasse: 'b',
        }),
      );
    });
  },
};
