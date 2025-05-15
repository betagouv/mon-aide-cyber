import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  Temoignages,
  Verbatim,
} from '../../domaine/vitrine/temoignages/Temoignages.tsx';

const meta: Meta<typeof Temoignages> = {
  component: Temoignages,
};

export default meta;

type Story = StoryObj<typeof meta>;

const verbatimsATester: Verbatim[] = [
  {
    id: 1,
    auteur: 'Un Aidant cyber de la Réunion (974)',
    commentaire:
      "Encore merci pour cet outil qui, une fois la communauté d'aidants réunionnaise structurée et formée, nous aidera grandement dans le passage à l'échelle.",
  },
  {
    id: 2,
    auteur: 'Un Aidant, réserviste de la Police, du Rhône (69)',
    commentaire:
      'MonAideCyber remplit très bien sa mission, et le fait de pouvoir tout de suite donner un rapport aux interlocteurs est un réel atout.',
  },
  {
    id: 3,
    auteur: 'Un Aidant, réserviste de la Police, du Rhône (69)',
    commentaire:
      'MonAideCyber remplit très bien sa mission, et le fait de pouvoir tout de suite donner un rapport aux interlocteurs est un réel atout.',
  },
];

export const TemoignagesVides: Story = {
  args: {
    verbatims: [],
  },
  decorators: [
    (story) => {
      return <div>{story()}</div>;
    },
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Le composant ne s'affiche pas", async () => {
      await expect(
        canvas.queryByText('Témoignages de nos Aidants')
      ).not.toBeInTheDocument();
    });
  },
};

export const TemoignagesAUneSeulePage: Story = {
  args: {
    verbatims: verbatimsATester.slice(0, 2),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('La première page des verbatims est affichée', async () => {
      await expect(
        canvas.getByRole('button', {
          name: /Témoignages précédents/i,
        })
      ).toBeDisabled();
      await expect(
        canvas.getByRole('button', {
          name: /Témoignages suivants/i,
        })
      ).toBeDisabled();
    });

    await step('Va à la page suivante', async () => {
      await userEvent.click(
        canvas.getByRole('button', {
          name: /Témoignages suivants/i,
        })
      );
    });
  },
};

export const TemoignagesADeuxPages: Story = {
  args: {
    verbatims: verbatimsATester.slice(0, 4),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('La première page des verbatims est affichée', async () => {
      await expect(
        canvas.getByRole('button', {
          name: /Témoignages précédents/i,
        })
      ).toBeDisabled();
      await expect(
        canvas.getByRole('button', {
          name: /Témoignages suivants/i,
        })
      ).not.toBeDisabled();
    });

    await step('Va à la page suivante', async () => {
      await userEvent.click(
        canvas.getByRole('button', {
          name: /Témoignages suivants/i,
        })
      );

      await expect(
        canvas.getByRole('button', {
          name: /Témoignages précédents/i,
        })
      ).not.toBeDisabled();

      await expect(
        canvas.getByRole('button', {
          name: /Témoignages suivants/i,
        })
      ).toBeDisabled();
    });
  },
};
