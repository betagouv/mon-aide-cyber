import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
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
            <label className="fr-label" htmlFor="faites-un-choix">
              <span>Faites un choix</span>
            </label>
            {story({
              args: {
                nom: 'faites-un-choix',
                mappeur: (valeur) => valeur as string,
                valeurs: valeursTextuelles,
                valeur: '',
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
    valeurs: valeursTextuelles,
    valeur: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSaisie: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSelection: () => {},
  },
  name: 'Propose l’auto complétion pour des valeurs textuelles',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Filtre les valeurs lorsque l'on saisit au clavier",
      async () => {
        expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          }),
        ).toBeInTheDocument();

        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        userEvent.type(champDeSaisie, 'a');

        await waitFor(() =>
          expect(canvas.getAllByRole('option')).toHaveLength(2),
        );
        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Ain' }),
          ).toBeInTheDocument(),
        );
        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Aisne' }),
          ).toBeInTheDocument(),
        );
      },
    );

    await step(
      'Sélectionne une des valeurs lorsque l’on clique dessus',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await waitFor(() => userEvent.clear(champDeSaisie));
        userEvent.type(champDeSaisie, 'fin');

        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Finistère' }),
          ).toBeInTheDocument(),
        );
        userEvent.click(canvas.getByRole('option', { name: 'Finistère' }));

        await waitFor(() =>
          expect(
            canvas.getByRole('textbox', {
              name: /faites un choix/i,
            }),
          ).toHaveValue('Finistère'),
        );
      },
    );

    await step(
      'Utilise la valeur correspondante lorsque la saisie au clavier est égale à une des valeurs fournies',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await waitFor(() => userEvent.clear(champDeSaisie));

        userEvent.type(champDeSaisie, 'finistère');
        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Finistère' }),
          ).toBeInTheDocument(),
        );

        await waitFor(() =>
          expect(
            canvas.getByRole('textbox', {
              name: /faites un choix/i,
            }),
          ).toHaveValue('Finistère'),
        );
      },
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
                valeurs: valeursStructurees,
                valeur: '',
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
    valeurs: valeursStructurees,
    valeur: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSaisie: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    surSelection: () => {},
  },
  name: 'Propose l’auto complétion pour des valeurs structurées',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Filtre les valeurs lorsque l'on saisit au clavier",
      async () => {
        expect(
          canvas.getByRole('textbox', {
            name: /faites un choix/i,
          }),
        ).toBeInTheDocument();

        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        userEvent.type(champDeSaisie, 'a');

        await waitFor(() =>
          expect(canvas.getAllByRole('option')).toHaveLength(2),
        );
        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Ain' }),
          ).toBeInTheDocument(),
        );
        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Aisne' }),
          ).toBeInTheDocument(),
        );
      },
    );

    await step(
      'Sélectionne une des valeurs lorsque l’on clique dessus',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await waitFor(() => userEvent.clear(champDeSaisie));
        userEvent.type(champDeSaisie, 'fin');

        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Finistère' }),
          ).toBeInTheDocument(),
        );
        userEvent.click(canvas.getByRole('option', { name: 'Finistère' }));

        await waitFor(() =>
          expect(
            canvas.getByRole('textbox', {
              name: /faites un choix/i,
            }),
          ).toHaveValue('Finistère'),
        );
      },
    );

    await step(
      'Utilise la valeur correspondante lorsque la saisie au clavier est égale à une des valeurs fournies',
      async () => {
        const champDeSaisie = canvas.getByRole('textbox', {
          name: /faites un choix/i,
        });
        await waitFor(() => userEvent.clear(champDeSaisie));

        userEvent.type(champDeSaisie, 'finistère');
        await waitFor(() =>
          expect(
            canvas.getByRole('option', { name: 'Finistère' }),
          ).toBeInTheDocument(),
        );

        await waitFor(() =>
          expect(
            canvas.getByRole('textbox', {
              name: /faites un choix/i,
            }),
          ).toHaveValue('Finistère'),
        );
      },
    );
  },
};
