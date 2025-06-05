import type { Preview } from '@storybook/react-vite';
import '../src/assets/styles/index.scss';
import '@gouvfr/dsfr/dist/dsfr.min.css';

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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
