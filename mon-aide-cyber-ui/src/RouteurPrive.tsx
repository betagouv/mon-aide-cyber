import { Suspense } from 'react';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { NecessiteValidationCGU } from './fournisseurs/NecessiteValidationCGU.tsx';
import { RequiertValidationCGU } from './fournisseurs/RequiertValidationCGU.tsx';
import { LayoutAidant } from './composants/layout/layout-aidant/LayoutAidant.tsx';
import { EcranDiagnostics } from './domaine/espace-aidant/ecran-diagnostics/EcranDiagnostics.tsx';
import { EcranMesPreferences } from './domaine/espace-aidant/mon-compte/ecran-mes-preferences/EcranMesPreferences.tsx';
import { EcranMesInformations } from './domaine/espace-aidant/mon-compte/ecran-mes-informations/EcranMesInformations.tsx';
import { LayoutDiagnostic } from './composants/layout/LayoutDiagnostic.tsx';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { EcranDiagnosticAidant } from './composants/diagnostic/EcranDiagnosticAidant.tsx';
import { ComposantRestitutionAidant } from './composants/diagnostic/ComposantRestitution/ComposantRestitution.tsx';
import { EcranValidationSignatureCGU } from './domaine/validation-cgu/EcranValidationSignatureCGU.tsx';
import { ROUTE_MON_ESPACE } from './domaine/MoteurDeLiens.ts';
import { EcranMettreAJourDemandeDevenirAidant } from './domaine/gestion-demandes/parcours-aidant/EcranMettreAJourDemandeDevenirAidant.tsx';
import { EcranMonEspaceUtilisationDuService } from './domaine/parcours-utilisation-service/parcours-utilisateur-inscrit/ecran-utilisation-du-service/EcranMonEspaceUtilisationDuService.tsx';

export const RouteurPrive = () => {
  return (
    <Routes>
      <Route
        path={ROUTE_MON_ESPACE}
        element={
          <Suspense>
            <RequiertAuthentification />
          </Suspense>
        }
      >
        <Route element={<LayoutAidant afficheSideBar={false} />}>
          <Route
            path="mon-utilisation-du-service"
            element={<EcranMonEspaceUtilisationDuService />}
          />
        </Route>
        <Route element={<LayoutAidant afficheSideBar={false} />}>
          <Route
            path="valider-mon-profil"
            element={<EcranMettreAJourDemandeDevenirAidant />}
          />
        </Route>

        <Route
          element={
            <Suspense>
              <NecessiteValidationCGU />
            </Suspense>
          }
        >
          <Route
            path="valide-signature-cgu"
            element={<EcranValidationSignatureCGU />}
          ></Route>
        </Route>
        <Route
          element={
            <Suspense>
              <RequiertValidationCGU />
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
                <ComposantIntercepteur composant={ComposantRestitutionAidant} />
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
