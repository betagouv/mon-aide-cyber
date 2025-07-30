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
import { EcranValiderMonProfil } from './domaine/gestion-demandes/parcours-aidant/EcranValiderMonProfil.tsx';
import { EcranMonEspaceUtilisationDuService } from './domaine/parcours-utilisation-service/parcours-utilisateur-inscrit/ecran-utilisation-du-service/mon-espace/EcranMonEspaceUtilisationDuService.tsx';
import { EcranValiderProfilUtilisateurInscrit } from './domaine/parcours-utilisation-service/parcours-utilisateur-inscrit/ecran-utilisation-du-service/EcranValiderProfilUtilisateurInscrit.tsx';
import { EcranMonEspaceDemandeDevenirAidant } from './domaine/parcours-utilisation-service/parcours-mon-espace-demande-devenir-aidant/ecran-mon-espace-demande-devenir-aidant/EcranMonEspaceDemandeDevenirAidant.tsx';
import { EcranDevenirAidant } from './domaine/espace-aidant/ecran-devenir-aidant/EcranDevenirAidant.tsx';
import EcranMonEspaceInscription from './domaine/espace-aidant/parcours-inscription/ecran-inscription/EcranMonEspaceInscription.tsx';
import EcranRessources from './domaine/espace-aidant/ecran-ressources/EcranRessources.tsx';

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
          <Route path="inscription" element={<EcranMonEspaceInscription />} />
        </Route>
        <Route element={<LayoutAidant afficheSideBar={false} />}>
          <Route
            path="valider-mon-profil"
            element={<EcranValiderMonProfil />}
          />
          <Route
            path="demande-devenir-aidant"
            element={<EcranMonEspaceDemandeDevenirAidant />}
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
          />
          <Route element={<LayoutAidant afficheSideBar={false} />}>
            <Route
              path="valider-mon-profil-utilisateur"
              element={<EcranValiderProfilUtilisateurInscrit />}
            />
          </Route>
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
            <Route
              path="tableau-de-bord"
              element={<EcranDiagnostics />}
            ></Route>
            <Route path="diagnostics" element={<EcranDiagnostics />}></Route>
            <Route path="devenir-aidant" element={<EcranDevenirAidant />} />
            <Route path="ressources" element={<EcranRessources />} />
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
