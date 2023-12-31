import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import Accueil from './Accueil.tsx';
import './assets/styles/index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FournisseurEntrepots } from './fournisseurs/FournisseurEntrepot.ts';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import {
  APIEntrepotAuthentification,
  APIEntrepotDiagnostics,
} from './infrastructure/entrepots/EntrepotsAPI.ts';
import { ComposantAffichageErreur } from './composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { EntrepotDiagnostics } from './domaine/diagnostic/Diagnostics.ts';
import { ComposantDiagnostic } from './composants/diagnostic/ComposantDiagnostic.tsx';
import { ComposantDiagnostics } from './composants/ComposantDiagnostics.tsx';
import { APIEntrepotDiagnostic } from './infrastructure/entrepots/APIEntrepotDiagnostic.ts';
import { startReactDsfr } from '@codegouvfr/react-dsfr/spa';
import { EntrepotAuthentification } from './domaine/authentification/Authentification.ts';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { FournisseurAuthentification } from './fournisseurs/ContexteAuthentification.tsx';
import { PortailModale } from './composants/modale/PortailModale.tsx';
import { CharteAidant } from './vues/CharteAidant.tsx';
import { TableauDeBord } from './composants/TableauDeBord.tsx';

startReactDsfr({ defaultColorScheme: 'system' });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <FournisseurEntrepots.Provider
        value={{
          diagnostic: () => new APIEntrepotDiagnostic(),
          diagnostics: (): EntrepotDiagnostics => new APIEntrepotDiagnostics(),
          authentification: (): EntrepotAuthentification =>
            new APIEntrepotAuthentification(),
        }}
      >
        <FournisseurAuthentification>
          <PortailModale>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
                    <Accueil />
                  </ErrorBoundary>
                }
              />
              <Route path="/charte-aidant" element={<CharteAidant />} />
              <Route
                element={
                  <Suspense>
                    <RequiertAuthentification />
                  </Suspense>
                }
              >
                <Route
                  path="/tableau-de-bord"
                  element={<ComposantIntercepteur composant={TableauDeBord} />}
                ></Route>
                <Route
                  path="/diagnostics"
                  element={
                    <ComposantIntercepteur composant={ComposantDiagnostics} />
                  }
                ></Route>
                <Route
                  path="/diagnostic/:idDiagnostic"
                  element={
                    <ComposantIntercepteur composant={ComposantDiagnostic} />
                  }
                ></Route>
              </Route>
            </Routes>
          </PortailModale>
        </FournisseurAuthentification>
      </FournisseurEntrepots.Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
