import { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../../composants/atomes/Button/Button';
import { expect, waitFor, within } from 'storybook/test';

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
  decorators: [(story) => <div>{story()}</div>],
  name: 'Toto',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Clique dessus', async () => {
      await waitFor(() =>
        expect(canvas.getByText(/Button/i)).toBeInTheDocument()
      );
    });
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
