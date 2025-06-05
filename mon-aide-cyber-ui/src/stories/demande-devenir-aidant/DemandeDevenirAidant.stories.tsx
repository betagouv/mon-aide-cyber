import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DemandeDevenirAidant } from './DemandeDevenirAidant.tsx';

const meta = {
  title: 'Demande pour devenir Aidant',
  component: DemandeDevenirAidant,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DemandeDevenirAidant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DemandeDevenirAidantStory: Story = {
  args: {
    referentielDepartements: [{ nom: 'Gironde', code: '33' }],
  },
  name: 'Formulaire de demande pour devenir Aidant',
  play: async ({ canvasElement, step, userEvent }) => {
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
      expect(canvas.getByRole('button', { name: /envoyer/i })).toBeDisabled();
    });

    await step('Valide le prénom', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre prénom/i }),
        ' '
      );

      await expect(
        canvas.queryByText('Veuillez saisir un prénom valide')
      ).toBeInTheDocument();
    });

    await step('Valide le nom', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre nom/i }),
        ' '
      );

      await expect(
        canvas.queryByText('Veuillez saisir un nom valide')
      ).toBeInTheDocument();
    });

    await step('Valide l’adresse électronique', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre adresse électronique/i }),
        ' '
      );

      await expect(
        canvas.queryByText('Veuillez saisir un mail valide')
      ).toBeInTheDocument();
    });

    await step('Valide le département', async () => {
      const champDeSaisie = canvas.getByRole('textbox', {
        name: '',
      });
      await userEvent.clear(champDeSaisie);
      await userEvent.type(champDeSaisie, 'ais');

      await expect(
        canvas.queryByText('Veuillez sélectionner un département dans la liste')
      ).toBeInTheDocument();
    });

    await step('Valide les CGU', async () => {
      await userEvent.dblClick(canvas.getByRole('checkbox'));

      await expect(
        canvas.queryByText('Veuillez valider les CGU.')
      ).toBeInTheDocument();
    });

    await step('Le formulaire peut être envoyé', async () => {
      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre prénom/i }),
        'Marc'
      );

      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre nom/i }),
        'ETOURNEAU'
      );

      await userEvent.type(
        canvas.getByRole('textbox', { name: /votre adresse électronique/i }),
        'email'
      );

      const champDeSaisie = canvas.getByRole('textbox', {
        name: '',
      });
      await userEvent.clear(champDeSaisie);
      await userEvent.type(champDeSaisie, 'Gir');
      await userEvent.click(
        canvas.getByRole('button', { name: '33 - Gironde' })
      );

      await userEvent.click(canvas.getByRole('checkbox'));
      expect(canvas.getByRole('button', { name: /envoyer/i })).toBeEnabled();
    });
  },
};
