import { Suspense } from 'react';
import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { ComposantDiagnostic } from './composants/diagnostic/ComposantDiagnostic.tsx';
import { RequiertAuthentification } from './fournisseurs/RequiertAuthentification.tsx';
import { CharteAidant } from './vues/CharteAidant.tsx';
import { ComposantRestitution } from './composants/diagnostic/ComposantRestitution/ComposantRestitution.tsx';
import { ComposantCGU } from './vues/ComposantCGU.tsx';
import { MentionsLegales } from './vues/MentionsLegales.tsx';
import { ComposantProfil } from './composants/profil/ComposantProfil.tsx';
import { RequiertAidantSansEspace } from './fournisseurs/RequiertAidantSansEspace.tsx';
import { RequiertEspaceAidant } from './fournisseurs/RequiertEspaceAidant.tsx';
import { ComposantConnexion } from './composants/connexion/ComposantConnexion.tsx';
import { TableauDeBord } from './composants/espace-aidant/tableau-de-bord/TableauDeBord.tsx';
import { ComposantCreationEspaceAidant } from './composants/espace-aidant/creation-espace-aidant/ComposantCreationEspaceAidant.tsx';
import { ComposantDemandeDevenirAidant } from './composants/gestion-demandes/devenir-aidant/ComposantDemandeDevenirAidant.tsx';
import { KitDeCommunication } from './composants/a-propos/KitDeCommunication.tsx';
import { LayoutPublic } from './composants/layout/LayoutPublic.tsx';
import { ComposantDemandeEtreAide } from './composants/gestion-demandes/etre-aide/ComposantDemandeEtreAide.tsx';
import { LayoutAidant } from './composants/layout/LayoutAidant.tsx';
import { LayoutDiagnostic } from './composants/layout/LayoutDiagnostic.tsx';

export const AppRouteur = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublic />}>
        <Route index element={<Accueil />} />
        <Route path="/cgu" element={<ComposantCGU />} />
        <Route path="/charte-aidant" element={<CharteAidant />} />
        <Route
          path="/demandes/etre-aide"
          element={<ComposantDemandeEtreAide />}
        />
        <Route path="/a-propos">
          <Route path="kit-de-communication" element={<KitDeCommunication />} />
        </Route>
        <Route
          path="/demandes/devenir-aidant"
          element={<ComposantDemandeDevenirAidant />}
        />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/connexion" element={<ComposantConnexion />} />
      </Route>

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
          <Route path="/" element={<LayoutDiagnostic />}>
            <Route
              path="/diagnostic/:idDiagnostic"
              element={
                <ComposantIntercepteur composant={ComposantDiagnostic} />
              }
            ></Route>
          </Route>
          <Route path="/" element={<LayoutAidant />}>
            <Route path="/tableau-de-bord" element={<TableauDeBord />}></Route>

            <Route
              path="/diagnostic/:idDiagnostic/restitution"
              element={
                <ComposantIntercepteur composant={ComposantRestitution} />
              }
            ></Route>
            <Route path="/profil" element={<ComposantProfil />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};