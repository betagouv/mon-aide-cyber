import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { withRouter } from 'storybook-addon-react-router-v6';
import { SeConnecter } from '../composants/authentification/SeConnecter.tsx';
import { PortailModale } from '../composants/modale/PortailModale.tsx';

const meta = {
  title: "Authentification",
  component: SeConnecter,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    withRouter,
    (story) => (
      <PortailModale>
        {story()}
      </PortailModale>
    ),
  ],
} satisfies Meta<typeof SeConnecter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfficheLaMireDeConnexion: Story = {
  name: "Affiche la mire de connexion",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Lorsque l’aidant clique sur "Se connecter"', async () => {
      await userEvent.click(canvas.getByRole('link', { name: /Se connecter/i }));

      expect(
        await waitFor(() => canvas.getByRole('textbox', { name: /votre adresse email/i }))
      ).toBeInTheDocument();

      expect(
        await waitFor(() => canvas.getByRole('textbox', { name: /votre mot de passe/i }))
      ).toBeInTheDocument();

      expect(
        await waitFor(() => canvas.getByRole('button', { name: /annuler/i }))
      ).toBeInTheDocument();

      expect(
        await waitFor(() => canvas.getByRole('button', { name: /se connecter/i }))
      ).toBeInTheDocument();
    });
  },
};
