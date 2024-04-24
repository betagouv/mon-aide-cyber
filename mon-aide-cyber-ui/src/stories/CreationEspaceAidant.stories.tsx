import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { ContexteMacAPI } from '../fournisseurs/api/ContexteMacAPI.tsx';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { ComposantFormulaireCreationEspaceAidant } from '../composants/espace-aidant/creation-espace-aidant/ComposantFormulaireCreationEspaceAidant.tsx';

const meta = {
  title: "Création de l'espace Aidant",
  component: ComposantFormulaireCreationEspaceAidant,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ComposantFormulaireCreationEspaceAidant>;

export default meta;
type Story = StoryObj<typeof meta>;
let valeursSaisies = {};

export const CreationEspaceAidant: Story = {
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
              'creer-espace-aidant': {
                url: '/api/creer-espace-aidant',
                methode: 'POST',
              },
            },
            setEtat: () => {
              return;
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            ajouteEtat: () => {},
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
  name: "Crée l'espace de l'aidant",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Lorsque l'on arrive sur la page de création de l'aidant",
      async () => {
        expect(
          canvas.getByRole('textbox', {
            name: /saisissez votre mot de passe temporaire/i,
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
        expect(
          canvas.getByRole('checkbox', {
            name: /j'accepte les conditions générales d'utilisation/i,
          }),
        ).toBeInTheDocument();
      },
    );

    await step(
      "L'utilisateur clique sur Valider sans rien remplir",
      async () => {
        userEvent.click(canvas.getByRole('button', { name: /valider/i }));

        await waitFor(() =>
          expect(
            canvas.getByText(/vous devez saisir vos mots de passe./i),
          ).toBeInTheDocument(),
        );
        await waitFor(() =>
          expect(
            canvas.getByText(/veuillez accepter les cgu./i),
          ).toBeInTheDocument(),
        );
      },
    );

    await step("L'utilisateur se trompe dans la confirmation", async () => {
      const champMotDePasseTemporaire = canvas.getByRole('textbox', {
        name: /saisissez votre mot de passe temporaire/i,
      });
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      userEvent.type(champMotDePasseTemporaire, 'a');
      userEvent.type(champNouveauMotDePasse, 'b');
      userEvent.type(champConfirmationMotDePasse, 'c');

      userEvent.click(canvas.getByRole('button', { name: /valider/i }));

      await waitFor(() =>
        expect(
          canvas.getByText(
            /la confirmation de votre mot de passe ne correspond pas au mot de passe saisi./i,
          ),
        ).toBeInTheDocument(),
      );
      await waitFor(() =>
        expect(
          canvas.getByText(/veuillez accepter les cgu./i),
        ).toBeInTheDocument(),
      );
    });

    await step(
      "L'utilisateur saisit le même mot de passe que le temporaire",
      async () => {
        const champMotDePasseTemporaire = canvas.getByRole('textbox', {
          name: /saisissez votre mot de passe temporaire/i,
        });
        const champNouveauMotDePasse = canvas.getByRole('textbox', {
          name: /choisissez un nouveau mot de passe/i,
        });
        const champConfirmationMotDePasse = canvas.getByRole('textbox', {
          name: /confirmez votre nouveau mot de passe/i,
        });
        userEvent.clear(champMotDePasseTemporaire);
        userEvent.clear(champNouveauMotDePasse);
        userEvent.clear(champConfirmationMotDePasse);
        userEvent.type(champMotDePasseTemporaire, 'a');
        userEvent.type(champNouveauMotDePasse, 'a');
        userEvent.type(champConfirmationMotDePasse, 'a');

        userEvent.click(canvas.getByRole('button', { name: /valider/i }));

        await waitFor(() =>
          expect(
            canvas.getByText(
              /votre nouveau mot de passe doit être différent du mot de passe temporaire./i,
            ),
          ).toBeInTheDocument(),
        );
        await waitFor(() =>
          expect(
            canvas.getByText(/veuillez accepter les cgu./i),
          ).toBeInTheDocument(),
        );
      },
    );

    await step("L'utilisateur signe les CGU", async () => {
      const champMotDePasseTemporaire = canvas.getByRole('textbox', {
        name: /saisissez votre mot de passe temporaire/i,
      });
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      userEvent.clear(champMotDePasseTemporaire);
      userEvent.clear(champNouveauMotDePasse);
      userEvent.clear(champConfirmationMotDePasse);
      userEvent.type(champMotDePasseTemporaire, 'a');
      userEvent.type(champNouveauMotDePasse, 'a');
      userEvent.type(champConfirmationMotDePasse, 'a');

      userEvent.click(
        canvas.getByRole('checkbox', {
          name: /j'accepte les conditions générales d'utilisation/i,
        }),
      );
      userEvent.click(canvas.getByRole('button', { name: /valider/i }));

      await waitFor(() =>
        expect(
          canvas.getByText(
            /votre nouveau mot de passe doit être différent du mot de passe temporaire./i,
          ),
        ).toBeInTheDocument(),
      );
      await waitFor(() =>
        expect(
          canvas.queryByText(/veuillez accepter les cgu./i),
        ).not.toBeInTheDocument(),
      );
    });

    await step("L'utilisateur crée son espace aidant", async () => {
      const champMotDePasseTemporaire = canvas.getByRole('textbox', {
        name: /saisissez votre mot de passe temporaire/i,
      });
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      const champCGU = canvas.getByRole('checkbox', {
        name: /j'accepte les conditions générales d'utilisation/i,
      });
      userEvent.clear(champMotDePasseTemporaire);
      userEvent.clear(champNouveauMotDePasse);
      userEvent.clear(champConfirmationMotDePasse);
      userEvent.clear(champCGU);
      userEvent.type(champMotDePasseTemporaire, 'a');
      userEvent.type(champNouveauMotDePasse, 'b');
      userEvent.type(champConfirmationMotDePasse, 'b');
      userEvent.click(champCGU);

      userEvent.click(canvas.getByRole('button', { name: /valider/i }));

      await waitFor(() =>
        expect(
          canvas.queryByText(/veuillez accepter les cgu./i),
        ).not.toBeInTheDocument(),
      );
      await waitFor(() =>
        expect(valeursSaisies).toStrictEqual({
          cguSignees: true,
          motDePasse: 'b',
          motDePasseTemporaire: 'a',
        }),
      );
    });
  },
};
