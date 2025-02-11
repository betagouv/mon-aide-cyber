import { Meta, StoryObj } from '@storybook/react';
import Button from '../../composants/atomes/Button/Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Défaut',
  },
};
export const Primary: Story = {
  args: {
    variant: 'primary',
    title: 'Primaire',
  },
};
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    title: 'Secondaire',
  },
};
export const Link: Story = {
  args: {
    variant: 'link',
    title: 'Lien',
  },
};
export const Text: Story = {
  args: {
    variant: 'text',
    title: 'Textuel',
  },
};

export const Icon: Story = {
  args: {
    variant: 'primary',
    title: 'Avec une icone',
    icon: 'fr-icon-arrow-right-line',
  },
};

export const IconLeft: Story = {
  args: {
    variant: 'primary',
    title: 'Avec une icone à gauche',
    iconPos: 'left',
    icon: 'fr-icon-arrow-right-line',
  },
};
