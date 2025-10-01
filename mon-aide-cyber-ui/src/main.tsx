import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.scss';
import { BrowserRouter } from 'react-router-dom';
import { ComposantAffichageErreur } from './composants/alertes/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { PortailModale } from './composants/modale/PortailModale.tsx';
import { FournisseurNavigationMAC } from './fournisseurs/ContexteNavigationMAC.tsx';
import { FournisseurMatomo } from './fournisseurs/ContexteMatomo.tsx';
import { RouteurPrive } from './RouteurPrive.tsx';
import { RouteurPublic } from './RouteurPublic.tsx';
import { FournisseurUtilisateur } from './fournisseurs/ContexteUtilisateur.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VisualiseurDeNavigationHATEOAS } from './domaine/hateoas/VisualiseurDeNavigationHATEOAS.tsx';
import { FournisseurDeToast } from './fournisseurs/ToastProvider/FournisseurDeToast.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const afficheLeDebugHATEOAS =
  import.meta.env['VITE_VISUALISEUR_HATEOAS'] === 'true';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FournisseurMatomo>
        <BrowserRouter>
          <FournisseurNavigationMAC>
            <FournisseurUtilisateur>
              <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
                <FournisseurDeToast>
                  <PortailModale>
                    <RouteurPublic />
                    <RouteurPrive />
                    {afficheLeDebugHATEOAS ? (
                      <VisualiseurDeNavigationHATEOAS />
                    ) : null}
                  </PortailModale>
                </FournisseurDeToast>
              </ErrorBoundary>
            </FournisseurUtilisateur>
          </FournisseurNavigationMAC>
        </BrowserRouter>
      </FournisseurMatomo>
    </QueryClientProvider>
  </React.StrictMode>
);
