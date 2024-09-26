import { Meta, StoryObj } from '@storybook/react';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { expect, userEvent, within } from '@storybook/test';
import { ComposantCreationEspaceAidant } from '../domaine/espace-aidant/demande-aidant-creation-espace-aidant/FormulaireCreationEspaceAidant.tsx';

const meta = {
  title: "Création de l'espace Aidant suite à une demande devenir Aidant",
  component: ComposantCreationEspaceAidant,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ComposantCreationEspaceAidant>;

let valeursSaisies = {};
const macAPIMemoire = {
  execute: <T, U, V = void>(
    parametresAPI: ParametresAPI<V>,
    _transcris: (contenu: Promise<U>) => Promise<T>
  ) => {
    if (parametresAPI.corps) {
      valeursSaisies = parametresAPI.corps;
    }
    return Promise.resolve({
      liens: { 'finalise-creation-espace-aidant': { url: '' } },
    }) as Promise<T>;
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreationEspaceAidant: Story = {
  args: { token: 'aaaa', macAPI: macAPIMemoire },
  decorators: [
    (story) => (
      <ContexteNavigationMAC.Provider
        value={{
          etat: { 'finalise-creation-espace-aidant': { url: '' } },
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
    ),
  ],
  name: "Crée l'espace de l'aidant correspondant à la demande devenir Aidant",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Lorsque l'on arrive sur la page de création de l'aidant",
      async () => {
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
        expect(
          canvas.getByRole('checkbox', {
            name: /j'accepte les conditions générales d'utilisation/i,
          })
        ).toBeInTheDocument();
      }
    );

    await step(
      "L'utilisateur clique sur Valider sans rien remplir",
      async () => {
        await userEvent.click(canvas.getByRole('button', { name: /valider/i }));

        await expect(
          canvas.getByText(/vous devez saisir vos mots de passe./i)
        ).toBeInTheDocument();
        await expect(
          canvas.getByText(/veuillez accepter les cgu./i)
        ).toBeInTheDocument();
      }
    );

    await step("L'utilisateur se trompe dans la confirmation", async () => {
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      await userEvent.type(champNouveauMotDePasse, 'b');
      await userEvent.type(champConfirmationMotDePasse, 'c');

      await userEvent.click(canvas.getByRole('button', { name: /valider/i }));

      await expect(
        canvas.getByText(
          /la confirmation de votre mot de passe ne correspond pas au mot de passe saisi./i
        )
      ).toBeInTheDocument();

      await expect(
        canvas.getByText(/veuillez accepter les cgu./i)
      ).toBeInTheDocument();
    });

    await step("L'utilisateur signe les CGU", async () => {
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      await userEvent.clear(champNouveauMotDePasse);
      await userEvent.clear(champConfirmationMotDePasse);
      await userEvent.type(champNouveauMotDePasse, 'a');
      await userEvent.type(champConfirmationMotDePasse, 'b');

      await userEvent.click(
        canvas.getByRole('checkbox', {
          name: /j'accepte les conditions générales d'utilisation/i,
        })
      );
      await userEvent.click(canvas.getByRole('button', { name: /valider/i }));

      await expect(
        canvas.queryByText(/veuillez accepter les cgu./i)
      ).not.toBeInTheDocument();
    });

    await step("L'utilisateur crée son espace aidant", async () => {
      const champNouveauMotDePasse = canvas.getByRole('textbox', {
        name: /choisissez un nouveau mot de passe/i,
      });
      const champConfirmationMotDePasse = canvas.getByRole('textbox', {
        name: /confirmez votre nouveau mot de passe/i,
      });
      const champCGU = canvas.getByRole('checkbox', {
        name: /j'accepte les conditions générales d'utilisation/i,
      });

      await userEvent.clear(champNouveauMotDePasse);
      await userEvent.clear(champConfirmationMotDePasse);
      await userEvent.click(champCGU);
      await userEvent.type(champNouveauMotDePasse, 'b');
      await userEvent.type(champConfirmationMotDePasse, 'b');
      await userEvent.click(champCGU);

      await userEvent.click(canvas.getByRole('button', { name: /valider/i }));

      await expect(
        canvas.queryByText(/veuillez accepter les cgu./i)
      ).not.toBeInTheDocument();

      await expect(valeursSaisies).toStrictEqual({
        cguSignees: true,
        motDePasse: 'b',
        confirmationMotDePasse: 'b',
        token: 'aaaa',
      });

      await expect(
        canvas.getByText(/votre espace Aidant est disponible !/i)
      ).toBeInTheDocument();
    });
  },
};
