import {
  ChoixUtilisation,
  Utilisation,
} from '../../../../gestion-demandes/parcours-aidant/choix-utilisation/ChoixUtilisation.tsx';
import { useNavigate } from 'react-router-dom';
import { ROUTE_MON_ESPACE } from '../../../../MoteurDeLiens.ts';

const ChoixUtilisationDuService = () => {
  const navigate = useNavigate();

  const surChoixUtilisation = (choix: Utilisation) => {
    switch (choix) {
      case 'InteretGeneral': {
        window.scrollTo({ top: 0 });
        return navigate(`${ROUTE_MON_ESPACE}/demande-devenir-aidant`);
      }
      case 'ActiviteProfessionnelle': {
        return navigate('/mon-espace/tableau-de-bord');
      }
    }
  };

  return (
    <div className="utilisation-du-service">
      <ChoixUtilisation
        key="choixUtilisation"
        choixPossibles={['ActiviteProfessionnelle', 'InteretGeneral']}
        surClick={surChoixUtilisation}
      />
    </div>
  );
};
export default ChoixUtilisationDuService;
