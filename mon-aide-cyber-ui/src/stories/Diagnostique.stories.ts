import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { ComposantDiagnostique } from "../composants/ComposantDiagnostique.tsx";
import { expect } from "@storybook/jest";

const meta = {
  title: "Diagnostique",
  component: ComposantDiagnostique,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ComposantDiagnostique>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuestionDiagnostique: Story = {
  name: "Affiche une seule question du diagnostique",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByLabelText("Entreprise privée (ex. TPE, PME, ETI)"),
      ),
    ).toBeInTheDocument();
  },
};
