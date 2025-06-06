import {
  ChoixUtilisation,
  Utilisation,
} from '../../../../gestion-demandes/parcours-aidant/choix-utilisation/ChoixUtilisation.tsx';
import { useNavigate } from 'react-router-dom';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
  ROUTE_MON_ESPACE_VALIDER_PROFIL,
  ROUTE_MON_ESPACE_VALIDER_PROFIL_UTILISATEUR_INSCRIT,
} from '../../../../MoteurDeLiens.ts';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks.ts';

export const MonEspaceUtilisationDuService = () => {
  const navigationMAC = useNavigationMAC();
  const navigate = useNavigate();

  const surClicChoixUtilisation = (choix: Utilisation) => {
    const peutDemandeDevenirAidant = new MoteurDeLiens(
      navigationMAC.etat
    ).existe('demande-devenir-aidant');

    switch (choix) {
      case 'InteretGeneral': {
        window.scrollTo({ top: 0 });
        if (!peutDemandeDevenirAidant) {
          return navigate(`${ROUTE_MON_ESPACE_VALIDER_PROFIL}`);
        } else {
          return navigate(`${ROUTE_MON_ESPACE}/demande-devenir-aidant`);
        }
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
        choixPossibles={['ActiviteProfessionnelle', 'InteretGeneral']}
        surClick={surClicChoixUtilisation}
      />
    </div>
  );
};
