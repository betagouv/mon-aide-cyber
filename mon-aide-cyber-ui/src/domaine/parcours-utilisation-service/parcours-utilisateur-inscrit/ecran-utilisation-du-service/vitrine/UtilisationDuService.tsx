import {
  ChoixUtilisation,
  Utilisation,
} from '../../../../gestion-demandes/parcours-aidant/choix-utilisation/ChoixUtilisation.tsx';
import { useNavigate } from 'react-router-dom';

export const UtilisationDuService = () => {
  const navigate = useNavigate();

  const surClicChoixUtilisation = (choix: Utilisation) => {
    switch (choix) {
      case 'InteretGeneral': {
        return navigate('/demandes/devenir-aidant');
      }
      case 'ActiviteProfessionnelle': {
        return navigate('/connexion');
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
