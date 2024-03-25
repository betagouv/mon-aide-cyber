import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { ComposantAffichageErreur } from './composants/alertes/ComposantAffichageErreur.tsx';
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
import { RequiertAidantSansEspace } from './fournisseurs/RequiertAidantSansEspace.tsx';
import { RequiertEspaceAidant } from './fournisseurs/RequiertEspaceAidant.tsx';
import { ComposantParcoursCGUAide } from './composants/parcours-cgu-aide/ComposantParcoursCGUAide.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
      <BrowserRouter>
        <FournisseurMacAPI>
          <FournisseurNavigationMAC>
            <FournisseurAuthentification>
              <PortailModale>
                <Routes>
                  <Route path="/" element={<Accueil />} />
                  <Route path="/cgu" element={<CGU />} />
                  <Route path="/charte-aidant" element={<CharteAidant />} />
                  <Route
                    path="/demande-aide"
                    element={<ComposantParcoursCGUAide />}
                  />
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
                      element={
                        <Suspense>
                          <RequiertAidantSansEspace />
                        </Suspense>
                      }
                    >
                      <Route
                        path="/finalise-creation-espace-aidant"
                        element={<ComposantCreationEspaceAidant />}
                      ></Route>
                    </Route>
                    <Route
                      element={
                        <Suspense>
                          <RequiertEspaceAidant />
                        </Suspense>
                      }
                    >
                      <Route
                        path="/tableau-de-bord"
                        element={<TableauDeBord />}
                      ></Route>
                      /
                      <Route
                        path="/diagnostics"
                        element={<ComposantDiagnostics />}
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
                      <Route
                        path="/profil"
                        element={<ComposantProfil />}
                      ></Route>
                    </Route>
                  </Route>
                </Routes>
              </PortailModale>
            </FournisseurAuthentification>
          </FournisseurNavigationMAC>
        </FournisseurMacAPI>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
