import {
  ChoixUtilisation,
  Utilisation,
} from '../../../../gestion-demandes/parcours-aidant/choix-utilisation/ChoixUtilisation.tsx';
import { useNavigate } from 'react-router-dom';

const ChoixUtilisationDuService = () => {
  const navigate = useNavigate();

  const surChoixUtilisation = (choix: Utilisation) => {
    switch (choix) {
      case 'ActiviteProfessionnelle': {
        return navigate('/mon-espace/tableau-de-bord');
      }
    }
  };

  return (
    <div className="utilisation-du-service">
      <ChoixUtilisation
        key="choixUtilisation"
        choixPossibles={['ActiviteProfessionnelle']}
        surClick={surChoixUtilisation}
      />
    </div>
  );
};
export default ChoixUtilisationDuService;
