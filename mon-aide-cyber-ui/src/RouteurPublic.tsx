import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { CharteAidant } from './vues/CharteAidant.tsx';
import { ComposantCGU } from './vues/ComposantCGU.tsx';
import { MentionsLegales } from './vues/MentionsLegales.tsx';
import { ComposantConnexion } from './composants/connexion/ComposantConnexion.tsx';
import { ComposantDemandeDevenirAidant } from './composants/gestion-demandes/devenir-aidant/ComposantDemandeDevenirAidant.tsx';
import { KitDeCommunication } from './composants/a-propos/KitDeCommunication.tsx';
import { LayoutPublic } from './composants/layout/LayoutPublic.tsx';
import { EcranCreationEspaceAidant as ComposantDemandeAidantCreationEspaceAidant } from './domaine/espace-aidant/demande-aidant-creation-espace-aidant/EcranCreationEspaceAidant.tsx';
import { LayoutCreationEspaceAidant } from './composants/layout/LayoutCreationEspaceAidant.tsx';
import { EcranDevenirAidant } from './domaine/vitrine/ecran-devenir-aidant/EcranDevenirAidant.tsx';
import { EcranAccessibilite } from './vues/EcranAccessibilite.tsx';
import { EcranStatistiques } from './domaine/vitrine/ecran-statistiques/EcranStatistiques.tsx';
import { EcranBeneficierDuDispositif } from './domaine/vitrine/ecran-beneficier-du-dispositif/EcranBeneficierDuDispositif.tsx';
import { EcranAnnuaire } from './domaine/vitrine/ecran-annuaire/EcranAnnuaire.tsx';

export const RouteurPublic = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublic />}>
        <Route index element={<Accueil />} />
        <Route path="accessibilite" element={<EcranAccessibilite />} />
        <Route path="cgu" element={<ComposantCGU />} />
        <Route path="charte-aidant" element={<CharteAidant />} />
        <Route path="beneficier-du-dispositif">
          <Route path="annuaire" element={<EcranAnnuaire />} />
          <Route path="etre-aide" element={<EcranBeneficierDuDispositif />} />
        </Route>
        <Route path="a-propos">
          <Route path="statistiques" element={<EcranStatistiques />} />
          <Route path="kit-de-communication" element={<KitDeCommunication />} />
        </Route>
        <Route path="devenir-aidant" element={<EcranDevenirAidant />} />
        <Route
          path="demandes/devenir-aidant"
          element={<ComposantDemandeDevenirAidant />}
        />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="connexion" element={<ComposantConnexion />} />
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
