import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { ComposantAffichageErreur } from './composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantDiagnostic } from './composants/diagnostic/ComposantDiagnostic.tsx';
import { ComposantDiagnostics } from './composants/ComposantDiagnostics.tsx';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { FournisseurAuthentification } from './fournisseurs/ContexteAuthentification.tsx';
import { PortailModale } from './composants/modale/PortailModale.tsx';
import { CharteAidant } from './vues/CharteAidant.tsx';
import { TableauDeBord } from './composants/TableauDeBord.tsx';
import { ComposantRestitution } from './composants/diagnostic/ComposantRestitution.tsx';
import { CGU } from './vues/CGU.tsx';
import { MentionsLegales } from './vues/MentionsLegales.tsx';
import { ComposantCreationEspaceAidant } from './composants/espace-aidant/ComposantCreationEspaceAidant.tsx';
import { FournisseurMacAPI } from './fournisseurs/api/ContexteMacAPI.tsx';
import { FournisseurNavigationMAC } from './fournisseurs/ContexteNavigationMAC.tsx';
import { ComposantProfil } from './composants/profil/ComposantProfil.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <FournisseurMacAPI>
        <FournisseurNavigationMAC>
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
                <Route path="/cgu" element={<CGU />} />
                <Route path="/charte-aidant" element={<CharteAidant />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route
                  element={
                    <Suspense>
                      <RequiertAuthentification />
                    </Suspense>
                  }
                >
                  <Route
                    path="/tableau-de-bord"
                    element={
                      <ComposantIntercepteur composant={TableauDeBord} />
                    }
                  ></Route>
                  <Route
                    path="/finalise-creation-compte"
                    element={
                      <ComposantIntercepteur
                        composant={ComposantCreationEspaceAidant}
                      />
                    }
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
                  <Route
                    path="/diagnostic/:idDiagnostic/restitution"
                    element={
                      <ComposantIntercepteur composant={ComposantRestitution} />
                    }
                  ></Route>
                  <Route
                    path="/profil"
                    element={
                      <ComposantIntercepteur composant={ComposantProfil} />
                    }
                  ></Route>
                </Route>
              </Routes>
            </PortailModale>
          </FournisseurAuthentification>
        </FournisseurNavigationMAC>
      </FournisseurMacAPI>
    </BrowserRouter>
  </React.StrictMode>,
);
