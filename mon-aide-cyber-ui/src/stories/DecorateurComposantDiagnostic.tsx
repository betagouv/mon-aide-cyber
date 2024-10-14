import { ContexteNavigationMAC } from '../fournisseurs/ContexteNavigationMAC.tsx';
import { Action, Liens } from '../domaine/Lien.ts';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { ComposantAffichageErreur } from '../composants/alertes/ComposantAffichageErreur.tsx';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

export const decorateurComposantDiagnostic = (
  story: any,
  identifiantDiagnostic: string
) => (
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
        },
        navigue: (
          _moteurDeLiens: MoteurDeLiens,
          _action: Action,
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
);
