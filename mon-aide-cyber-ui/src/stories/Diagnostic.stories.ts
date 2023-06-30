import type { Meta, StoryObj } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { ComposantDiagnostic } from "../composants/ComposantDiagnostic.tsx";

const meta = {
  title: "Diagnostic",
  component: ComposantDiagnostic,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ComposantDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuestionDiagnostic: Story = {
  name: "Affiche une seule question du diagnostic",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      await waitFor(() =>
        canvas.getByLabelText("Entreprise privée (ex. TPE, PME, ETI)"),
      ),
    ).toBeInTheDocument();
  },
};
