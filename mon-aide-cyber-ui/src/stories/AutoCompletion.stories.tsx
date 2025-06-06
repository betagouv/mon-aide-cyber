import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AutoCompletion } from '../composants/auto-completion/AutoCompletion.tsx';

const meta = {
  title: 'Composant d’auto complétion',
  component: AutoCompletion,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AutoCompletion>;

export default meta;
type Story = StoryObj<typeof meta>;
const valeursTextuelles = ['Ain', 'Aisne', 'Corrèze', 'Finistère', 'Gironde'];

export const AutoCompletionTexte: Story = {
  decorators: [
    (story) => {
      return (
        <div>
          <div>
            <div>Auto completion</div>
            <div>
              <label className="fr-label" htmlFor="faites-un-choix">
                <span>Faites un choix</span>
              </label>
            </div>
            {story({
              args: {
                nom: 'faites-un-choix',
                mappeur: (valeur) => valeur as string,
                suggestionsInitiales: valeursTextuelles,
                valeurSaisie: '',
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                surSaisie: () => {},
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                surSelection: () => {},
              },
            })}
          </div>
        </div>
      );
    },
  ],
  args: {
    nom: 'faites-un-choix',
    mappeur: (valeur) => valeur as string,
    suggestionsInitiales: valeursTextuelles,
    valeurSaisie: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSaisie: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSelection: () => {},
  },
  name: 'Propose l’auto complétion pour des mots',
  play: async ({ canvasElement, step, userEvent }) => {
    const canvas = within(canvasElement);

    await step(
      "Filtre les suggestions lorsque l'on saisit au clavier",
      async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toBeInTheDocument();

        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.type(champDeSaisie, 'a');

        await expect(
          canvas.getAllByRole('button').map((button) => button.innerText)
        ).toStrictEqual(['', 'Ain', 'Aisne']);
      }
    );

    await step(
      'Sélectionne une des suggestions lorsque l’on clique dessus',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'fin');

        await expect(
          canvas.getByRole('button', { name: 'Finistère' })
        ).toBeInTheDocument();

        await userEvent.click(
          canvas.getByRole('button', { name: 'Finistère' })
        );

        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toHaveValue('Finistère');
      }
    );

    await step(
      'Utilise la suggestion correspondante lorsque la saisie au clavier est égale à une des suggestions fournies',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'finistère');

        await expect(
          canvas.getByRole('button', { name: 'Finistère' })
        ).toBeInTheDocument();

        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toHaveValue('Finistère');
      }
    );

    await step(
      'Ferme la liste déroulante lorsque l’on clique en dehors',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'finistère');

        await expect(
          canvas.getByRole('button', { name: 'Finistère' })
        ).toBeInTheDocument();

        await userEvent.click(canvas.getByText(/auto completion/i));

        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toHaveValue('Finistère');

        await expect(
          canvas.queryByRole('button', { name: 'Finistère' })
        ).not.toBeInTheDocument();
      }
    );
  },
};

type Departement = {
  code: string;
  nom: string;
};
const valeursStructurees: Departement[] = [
  { code: '1', nom: 'Ain' },
  { code: '02', nom: 'Aisne' },
  { code: '19', nom: 'Corrèze' },
  { code: '29', nom: 'Finistère' },
  { code: '33', nom: 'Gironde' },
  { code: '25', nom: 'Doubs' },
  { code: '26', nom: 'Drôme' },
  { code: '36', nom: 'Indre' },
];

export const AutoCompletionObjet: Story = {
  decorators: [
    (story) => {
      return (
        <div>
          <div>
            <label className="fr-label" htmlFor="faites-un-choix">
              <span>Faites un choix</span>
            </label>
            {story({
              args: {
                nom: 'faites-un-choix',
                mappeur: (valeur) => (valeur as Departement).nom,
                suggestionsInitiales: valeursStructurees,
                valeurSaisie: '',
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                surSaisie: () => {},
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                surSelection: () => {},
              },
            })}
          </div>
        </div>
      );
    },
  ],
  args: {
    nom: 'faites-un-choix',
    mappeur: (valeur) => (valeur as Departement).nom,
    suggestionsInitiales: valeursStructurees,
    valeurSaisie: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSaisie: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSelection: () => {},
  },
  name: 'Propose l’auto complétion pour des suggestions structurées',
  play: async ({ canvasElement, step, userEvent }) => {
    const canvas = within(canvasElement);

    await step(
      "Filtre les suggestions lorsque l'on saisit au clavier",
      async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toBeInTheDocument();

        await userEvent.type(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          }),
          'a'
        );

        await expect(
          canvas.getAllByRole('button').map((b) => b.innerText)
        ).toStrictEqual(['', 'Ain', 'Aisne']);

        await expect(
          canvas.getByRole('button', { name: 'Aisne' })
        ).toBeInTheDocument();
      }
    );

    await step(
      'Sélectionne une des suggestions lorsque l’on clique dessus',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'ai');

        await expect(
          canvas.getByRole('button', { name: 'Aisne' })
        ).toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: 'Aisne' }));

        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toHaveValue('Aisne');
      }
    );

    await step(
      'Utilise la suggestion correspondante lorsque la saisie au clavier est égale à une des suggestions fournies',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'finistère');
        await expect(
          canvas.getByRole('button', { name: 'Finistère' })
        ).toBeInTheDocument();

        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toHaveValue('Finistère');
      }
    );

    await step(
      'Utilise la navigation clavier pour dérouler la liste vers le bas',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'd');
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.type(
          canvas.getByRole('button', { name: /doubs/i }),
          '{Enter}'
        );

        await expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          })
        ).toHaveValue('Doubs');
      }
    );

    await step(
      'On peut continuer à saisir dans le champ de saisie lorsque l’on utilise la navigation au clavier',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await userEvent.clear(champDeSaisie);
        await userEvent.type(champDeSaisie, 'ai');
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.keyboard('[ArrowDown]');
        await userEvent.type(champDeSaisie, 's');

        await expect(
          canvas.getAllByRole('button').map((b) => b.innerText)
        ).toStrictEqual(['', 'Aisne']);
      }
    );
  },
};
