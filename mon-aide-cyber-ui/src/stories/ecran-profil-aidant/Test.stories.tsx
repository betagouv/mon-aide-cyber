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
    title: 'Button',
  },
};
export const Primary: Story = {
  args: {
    variant: 'primary',
    title: 'Button',
  },
};
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    title: 'Button',
  },
};
export const Link: Story = {
  args: {
    variant: 'link',
    title: 'Button',
  },
};
export const Text: Story = {
  args: {
    variant: 'text',
    title: 'Button',
  },
};
