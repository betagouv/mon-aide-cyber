import type { Preview } from "@storybook/react";
import "../src/assets/styles/index.scss";
import "../public/dsfr/utility/icons/icons.min.css";
import "../public/dsfr/dsfr/dsfr.min.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <main role="main">
        <div className="fr-container">
          <div className="fr-grid-row">
            <Story />
          </div>
        </div>
      </main>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
