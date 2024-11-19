import { Suspense } from 'react';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { RequiertAidantSansEspace } from './fournisseurs/RequiertAidantSansEspace.tsx';
import { RequiertEspaceAidant } from './fournisseurs/RequiertEspaceAidant.tsx';
import { LayoutAidant } from './composants/layout/layout-aidant/LayoutAidant.tsx';
import { EcranCreationEspaceAidant } from './domaine/espace-aidant/creation-espace-aidant/EcranCreationEspaceAidant.tsx';
import { EcranDiagnostics } from './domaine/espace-aidant/ecran-diagnostics/EcranDiagnostics.tsx';
import { EcranMesPreferences } from './domaine/espace-aidant/mon-compte/ecran-mes-preferences/EcranMesPreferences.tsx';
import { EcranMesInformations } from './domaine/espace-aidant/mon-compte/ecran-mes-informations/EcranMesInformations.tsx';
import { LayoutDiagnostic } from './composants/layout/LayoutDiagnostic.tsx';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { EcranDiagnosticAidant } from './composants/diagnostic/EcranDiagnosticAidant.tsx';
import { ComposantRestitution } from './composants/diagnostic/ComposantRestitution/ComposantRestitution.tsx';

export const RouteurPrive = () => {
  return (
    <Routes>
      <Route
        path="/aidant"
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
            path="finalise-creation-espace-aidant"
            element={<EcranCreationEspaceAidant />}
          ></Route>
        </Route>
        <Route
          element={
            <Suspense>
              <RequiertEspaceAidant />
            </Suspense>
          }
        >
          <Route path="diagnostic" element={<LayoutDiagnostic />}>
            <Route
              path=":idDiagnostic"
              element={
                <ComposantIntercepteur composant={EcranDiagnosticAidant} />
              }
            ></Route>
            <Route
              path=":idDiagnostic/restitution"
              element={
                <ComposantIntercepteur composant={ComposantRestitution} />
              }
            ></Route>
          </Route>
          <Route element={<LayoutAidant />}>
            {/* @todo remettre cette route quand TDB développé <Route path="/tableau-de-bord" element={<TableauDeBord />}></Route>*/}
            <Route
              path="tableau-de-bord"
              element={<EcranDiagnostics />}
            ></Route>
            <Route path="diagnostics" element={<EcranDiagnostics />}></Route>

            <Route
              path="mes-informations"
              element={<EcranMesInformations />}
            ></Route>
            <Route
              path="mes-preferences"
              element={<EcranMesPreferences />}
            ></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
