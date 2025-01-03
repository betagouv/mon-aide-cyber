import { Meta, StoryObj } from '@storybook/react';
import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { expect, userEvent, within } from '@storybook/test';
import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { FormulaireDevenirAidant } from '../domaine/gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Demande pour devenir Aidant',
  component: FormulaireDevenirAidant,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FormulaireDevenirAidant>;

export default meta;
type Story = StoryObj<typeof meta>;

const macAPIMemoire = {
  execute: <T, U, V = void>(
    parametresAPI: ParametresAPI<V>,
    _transcris: (contenu: Promise<U>) => Promise<T>
  ) => {
    const reponse = {
      departements: [
        {
          nom: 'Ain',
          code: '1',
        },
        {
          nom: 'Aisne',
          code: '2',
        },
      ],
      liens: {},
    };
    if (parametresAPI.url.includes('devenir-aidant')) {
      return Promise.resolve(reponse as T);
    }
    return Promise.resolve({} as T);
  },
};

export const DemandeDevenirAidant: Story = {
  args: { macAPI: macAPIMemoire },
  decorators: [
    (story) => (
      <MemoryRouter>
        <ContexteNavigationMAC.Provider
          value={{
            etat: {},
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
          <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
            {story()}
          </ErrorBoundary>
        </ContexteNavigationMAC.Provider>
      </MemoryRouter>
    ),
  ],
  name: 'Formulaire de demande pour devenir Aidant',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Affiche le formulaire', async () => {
      expect(
        canvas.getByRole('textbox', { name: /votre prénom/i })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole('textbox', { name: /votre nom/i })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole('textbox', { name: /votre adresse électronique/i })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole('textbox', {
          name: '',
        })
      ).toBeInTheDocument();
      expect(canvas.getByRole('checkbox')).toBeInTheDocument();
    });

    await step(
      'Affiche les messages d’erreurs lorsque l’on clique sur Envoyer',
      async () => {
        await userEvent.click(canvas.getByRole('button', { name: /envoyer/i }));

        expect(
          canvas.getByText('Veuillez saisir un prénom valide')
        ).toBeInTheDocument();
        expect(
          canvas.getByText('Veuillez saisir un nom valide')
        ).toBeInTheDocument();
        expect(
          canvas.getByText('Veuillez saisir un mail valide')
        ).toBeInTheDocument();
        expect(
          canvas.getByText('Veuillez sélectionner un département dans la liste')
        ).toBeInTheDocument();
        expect(
          canvas.getByText('Veuillez valider les CGU.')
        ).toBeInTheDocument();
      }
    );

    await step('Valide le prénom', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre prénom/i }),
        'Jean'
      );

      await expect(
        canvas.queryByText('Veuillez saisir un prénom valide')
      ).not.toBeInTheDocument();
    });

    await step('Valide le nom', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre nom/i }),
        'Jean'
      );

      await expect(
        canvas.queryByText('Veuillez saisir un nom valide')
      ).not.toBeInTheDocument();
    });

    await step('Valide l’adresse électronique', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre adresse électronique/i }),
        'jean.dujardin@email.com'
      );

      await expect(
        canvas.queryByText('Veuillez saisir un mail valide')
      ).not.toBeInTheDocument();
    });

    // await step('Valide le département', async () => {
    //   const champDeSaisie = canvas.getByRole('textbox', {
    //     name: '',
    //   });
    //   await userEvent.clear(champDeSaisie);
    //   await userEvent.type(champDeSaisie, 'ais');
    //
    //   await userEvent.click(canvas.getByRole('button', { name: '2 - Aisne' }));
    //
    //   await expect(
    //     canvas.queryByText('Veuillez sélectionner un département dans la liste')
    //   ).not.toBeInTheDocument();
    // });

    await step('Valide les CGU', async () => {
      await userEvent.click(canvas.getByRole('checkbox'));

      await expect(
        canvas.queryByText('Veuillez valider les CGU.')
      ).not.toBeInTheDocument();
    });

    // await step('Envoie la demande', async () => {
    //   // await userEvent.click(canvas.getByRole('button', { name: /envoyer/i }));
    //
    //   expect(valeursSaisies).toStrictEqual({
    //     nom: 'Jean',
    //     prenom: 'Dujardin',
    //     mail: 'jean.dujardin@email.com',
    //     departement: 'Aisne',
    //     cguValidees: true,
    //   });
    // });
  },
};
