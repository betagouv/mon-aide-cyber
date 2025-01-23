import {
  ChoixUtilisation,
  Utilisation,
} from '../../../gestion-demandes/parcours-aidant/choix-utilisation/ChoixUtilisation.tsx';
import { useNavigate } from 'react-router-dom';
import { ROUTE_AIDANT } from '../../../MoteurDeLiens.ts';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';

export const MonEspaceUtilisationDuService = () => {
  const navigationMAC = useNavigationMAC();
  const navigate = useNavigate();

  const surClicChoixUtilisation = (choix: Utilisation) => {
    switch (choix) {
      case 'InteretGeneral': {
        window.scrollTo({ top: 0 });
        return navigate(`/aidant/devenir-aidant/mise-a-jour`);
      }
      case 'ActiviteProfessionnelle': {
        return navigationMAC.navigue(
          `${ROUTE_AIDANT}/valide-signature-cgu`,
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
