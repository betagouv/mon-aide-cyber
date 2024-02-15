import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FournisseurEntrepots } from './fournisseurs/FournisseurEntrepot.ts';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { EntrepotAuthentificationSession } from './infrastructure/entrepots/EntrepotsAPI.ts';
import { ComposantAffichageErreur } from './composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantDiagnostic } from './composants/diagnostic/ComposantDiagnostic.tsx';
import { ComposantDiagnostics } from './composants/ComposantDiagnostics.tsx';
import { EntrepotAuthentification } from './domaine/authentification/Authentification.ts';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { FournisseurAuthentification } from './fournisseurs/ContexteAuthentification.tsx';
import { PortailModale } from './composants/modale/PortailModale.tsx';
import { CharteAidant } from './vues/CharteAidant.tsx';
import { TableauDeBord } from './composants/TableauDeBord.tsx';
import { ComposantRestitution } from './composants/diagnostic/ComposantRestitution.tsx';
import { CGU } from './vues/CGU.tsx';
import { MentionsLegales } from './vues/MentionsLegales.tsx';
import { FournisseurContexteActionsUtilisateur } from './fournisseurs/ContexteActionsUtilisateurs.tsx';
import { ComposantFinalisationCreationCompte } from './composants/parcoursCGU/ComposantFinalisationCreationCompte.tsx';
import { FournisseurMacAPI } from './fournisseurs/api/ContexteMacAPI.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <FournisseurEntrepots.Provider
        value={{
          authentification: (): EntrepotAuthentification =>
            new EntrepotAuthentificationSession(),
        }}
      >
        <FournisseurMacAPI>
          <FournisseurAuthentification>
            <FournisseurContexteActionsUtilisateur>
              <PortailModale>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ErrorBoundary
                        FallbackComponent={ComposantAffichageErreur}
                      >
                        <Accueil />
                      </ErrorBoundary>
                    }
                  />
                  <Route path="/cgu" element={<CGU />} />
                  <Route path="/charte-aidant" element={<CharteAidant />} />
                  <Route
                    path="/mentions-legales"
                    element={<MentionsLegales />}
                  />
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
                          composant={ComposantFinalisationCreationCompte}
                        />
                      }
                    ></Route>
                    <Route
                      path="/diagnostics"
                      element={
                        <ComposantIntercepteur
                          composant={ComposantDiagnostics}
                        />
                      }
                    ></Route>
                    <Route
                      path="/diagnostic/:idDiagnostic"
                      element={
                        <ComposantIntercepteur
                          composant={ComposantDiagnostic}
                        />
                      }
                    ></Route>
                    <Route
                      path="/diagnostic/:idDiagnostic/restitution"
                      element={
                        <ComposantIntercepteur
                          composant={ComposantRestitution}
                        />
                      }
                    ></Route>
                  </Route>
                </Routes>
              </PortailModale>
            </FournisseurContexteActionsUtilisateur>
          </FournisseurAuthentification>
        </FournisseurMacAPI>
      </FournisseurEntrepots.Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
