import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { Action, Liens } from '../domaine/Lien.ts';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const decorateurComposantDiagnostic = (
  story: any,
  identifiantDiagnostic: string
) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <ContexteNavigationMAC.Provider
        value={{
          ajouteEtat: (_liens: Liens) => null,
          setEtat: (_liens: Liens) => null,
          etat: {
            ['modifier-diagnostic']: {
              url: `/diagnostic/${identifiantDiagnostic}`,
              route: '',
              methode: undefined,
              contentType: '',
            },
            'repondre-diagnostic': {
              url: `/diagnostic/${identifiantDiagnostic}`,
              methode: 'PATCH',
            },
          },
          navigue: (
            _route: string,
            _liens: Liens,
            _exclusion?: Action[]
          ) => ({}),
          retourAccueil: () => null,
        }}
      >
        <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
          {story()}
        </ErrorBoundary>
      </ContexteNavigationMAC.Provider>
    </MemoryRouter>
  </QueryClientProvider>
);
