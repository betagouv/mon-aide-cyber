import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { EcranCharteAidant } from './vues/EcranCharteAidant.tsx';
import { ComposantCGU } from './vues/ComposantCGU.tsx';
import { MentionsLegales } from './vues/MentionsLegales.tsx';
import { KitDeCommunication } from './composants/a-propos/KitDeCommunication.tsx';
import { LayoutPublic } from './composants/layout/LayoutPublic.tsx';
import { EcranCreationEspaceAidant as ComposantDemandeAidantCreationEspaceAidant } from './domaine/espace-aidant/demande-aidant-creation-espace-aidant/EcranCreationEspaceAidant.tsx';
import { LayoutCreationEspaceAidant } from './composants/layout/LayoutCreationEspaceAidant.tsx';
import { EcranDevenirAidant } from './domaine/vitrine/ecran-devenir-aidant/EcranDevenirAidant.tsx';
import { EcranAccessibilite } from './vues/EcranAccessibilite.tsx';
import { EcranStatistiques } from './domaine/vitrine/ecran-statistiques/EcranStatistiques.tsx';
import { EcranBeneficierDuDispositif } from './domaine/vitrine/ecran-beneficier-du-dispositif/EcranBeneficierDuDispositif.tsx';
import { EcranAnnuaire } from './domaine/vitrine/ecran-annuaire/EcranAnnuaire.tsx';
import { EcranConnexion } from './domaine/connexion/EcranConnexion.tsx';
import { EcranAidant } from './domaine/vitrine/ecran-annuaire/ecran-aidant/EcranAidant.tsx';
import { EcranMotDePasseOublie } from './domaine/vitrine/mot-de-passe-oublie/EcranMotDePasseOublie.tsx';
import { EcranReinitialiserMotDePasse } from './domaine/vitrine/reinitialiser-mot-de-passe/EcranReinitialiserMotDePasse.tsx';
import { LayoutDiagnostic } from './composants/layout/LayoutDiagnostic.tsx';
import { EcranDiagnosticLibreAcces } from './composants/diagnostic/EcranDiagnosticAidant.tsx';
import { ComposantRestitutionLibreAcces } from './composants/diagnostic/ComposantRestitution/ComposantRestitution.tsx';
import { EcranDemandeAutodiagnostic } from './domaine/auto-diagnostic/EcranDemandeAutodiagnostic.tsx';
import { EcranDemandeDevenirAidant } from './domaine/gestion-demandes/parcours-aidant/EcranDemandeDevenirAidant.tsx';

export const RouteurPublic = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublic />}>
        <Route index element={<Accueil />} />
        <Route path="accessibilite" element={<EcranAccessibilite />} />
        <Route path="cgu" element={<ComposantCGU />} />
        <Route path="charte-aidant" element={<EcranCharteAidant />} />
        <Route path="beneficier-du-dispositif">
          <Route path="annuaire">
            <Route index element={<EcranAnnuaire />} />
            <Route path="solliciter" element={<EcranAidant />} />
          </Route>
          <Route path="etre-aide" element={<EcranBeneficierDuDispositif />} />
        </Route>
        <Route path="a-propos">
          <Route path="statistiques" element={<EcranStatistiques />} />
          <Route path="kit-de-communication" element={<KitDeCommunication />} />
        </Route>
        <Route path="devenir-aidant" element={<EcranDevenirAidant />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
      </Route>
      <Route
        path="/demandes/devenir-aidant"
        element={<LayoutPublic afficheNavigation={false} enteteSimple={true} />}
      >
        <Route index element={<EcranDemandeDevenirAidant />} />
      </Route>
      <Route
        path="/connexion"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route index element={<EcranConnexion />} />
      </Route>
      <Route
        path="/diagnostic-libre-acces"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route index element={<EcranDemandeAutodiagnostic />} />
      </Route>
      <Route path="diagnostic" element={<LayoutDiagnostic />}>
        <Route
          path=":idDiagnostic"
          element={
            <ComposantIntercepteur composant={EcranDiagnosticLibreAcces} />
          }
        ></Route>
        <Route
          path=":idDiagnostic/restitution"
          element={
            <ComposantIntercepteur composant={ComposantRestitutionLibreAcces} />
          }
        ></Route>
      </Route>
      <Route
        path="/utilisateur"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route path="mot-de-passe-oublie" element={<EcranMotDePasseOublie />} />
        <Route
          path="reinitialiser-mot-de-passe"
          element={<EcranReinitialiserMotDePasse />}
        />
      </Route>

      <Route element={<LayoutCreationEspaceAidant />}>
        <Route
          path="demandes/devenir-aidant/finalise"
          element={
            <ComposantIntercepteur
              composant={ComposantDemandeAidantCreationEspaceAidant}
            />
          }
        />
      </Route>
    </Routes>
  );
};
