import { Suspense } from 'react';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { ComposantDiagnostic } from './composants/diagnostic/ComposantDiagnostic.tsx';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { ComposantRestitution } from './composants/diagnostic/ComposantRestitution/ComposantRestitution.tsx';
import { ComposantProfil } from './composants/profil/ComposantProfil.tsx';
import { RequiertAidantSansEspace } from './fournisseurs/RequiertAidantSansEspace.tsx';
import { RequiertEspaceAidant } from './fournisseurs/RequiertEspaceAidant.tsx';
import { LayoutAidant } from './composants/layout/LayoutAidant.tsx';
import { LayoutDiagnostic } from './composants/layout/LayoutDiagnostic.tsx';
import { EcranCreationEspaceAidant } from './domaine/espace-aidant/creation-espace-aidant/EcranCreationEspaceAidant.tsx';
import { EcranDiagnostics } from './domaine/espace-aidant/ecran-diagnostics/EcranDiagnostics.tsx';

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
          <Route element={<LayoutDiagnostic />}>
            <Route
              path="diagnostic/:idDiagnostic"
              element={
                <ComposantIntercepteur composant={ComposantDiagnostic} />
              }
            ></Route>
            <Route
              path="diagnostic/:idDiagnostic/restitution"
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

            <Route path="profil" element={<ComposantProfil />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
