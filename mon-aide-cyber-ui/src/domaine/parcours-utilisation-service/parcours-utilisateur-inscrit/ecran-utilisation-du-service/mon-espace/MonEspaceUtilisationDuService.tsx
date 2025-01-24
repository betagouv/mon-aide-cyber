import {
  ChoixUtilisation,
  Utilisation,
} from '../../../../gestion-demandes/parcours-aidant/choix-utilisation/ChoixUtilisation.tsx';
import { useNavigate } from 'react-router-dom';
import {
  ROUTE_MON_ESPACE_VALIDER_PROFIL,
  ROUTE_MON_ESPACE_VALIDER_PROFIL_UTILISATEUR_INSCRIT,
} from '../../../../MoteurDeLiens.ts';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks.ts';

export const MonEspaceUtilisationDuService = () => {
  const navigationMAC = useNavigationMAC();
  const navigate = useNavigate();

  const surClicChoixUtilisation = (choix: Utilisation) => {
    switch (choix) {
      case 'InteretGeneral': {
        window.scrollTo({ top: 0 });
        return navigate(`${ROUTE_MON_ESPACE_VALIDER_PROFIL}`);
      }
      case 'ActiviteProfessionnelle': {
        return navigationMAC.navigue(
          `${ROUTE_MON_ESPACE_VALIDER_PROFIL_UTILISATEUR_INSCRIT}`,
          navigationMAC.etat
        );
      }
    }
  };

  return (
    <div className="utilisation-du-service">
      <ChoixUtilisation
        key="choixUtilisation"
        surClick={surClicChoixUtilisation}
      />
    </div>
  );
};
