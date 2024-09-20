import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.scss';
import { BrowserRouter } from 'react-router-dom';
import { ComposantAffichageErreur } from './composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { FournisseurAuthentification } from './fournisseurs/ContexteAuthentification.tsx';
import { PortailModale } from './composants/modale/PortailModale.tsx';
import { FournisseurNavigationMAC } from './fournisseurs/ContexteNavigationMAC.tsx';
import { FournisseurMatomo } from './fournisseurs/ContexteMatomo.tsx';
import { RouteurPrive } from './RouteurPrive.tsx';
import { RouteurPublic } from './RouteurPublic.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FournisseurMatomo>
      <BrowserRouter>
        <FournisseurNavigationMAC>
          <FournisseurAuthentification>
            <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
              <PortailModale>
                <RouteurPublic />
                <RouteurPrive />
              </PortailModale>
            </ErrorBoundary>
          </FournisseurAuthentification>
        </FournisseurNavigationMAC>
      </BrowserRouter>
    </FournisseurMatomo>
  </React.StrictMode>
);
