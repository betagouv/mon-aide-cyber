import { useMoteurDeLiens } from './useMoteurDeLiens.ts';
import { useQuery } from '@tanstack/react-query';
import { ReponseDemandeInitiee } from '../domaine/gestion-demandes/devenir-aidant/DevenirAidant.ts';
import { constructeurParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../fournisseurs/api/useMACAPI.ts';

export function useRecupereDepartements() {
  const macAPI = useMACAPI();

  const {
    accedeALaRessource: peutDemandeDevenirAidant,
    ressource: actionDemandeDevenirAidant,
  } = useMoteurDeLiens('demande-devenir-aidant');

  const {
    accedeALaRessource: peutNouvelleDemandeDevenirAidant,
    ressource: actionNouvelleDemandeDevenirAidant,
  } = useMoteurDeLiens('nouvelle-demande-devenir-aidant');

  const { data } = useQuery({
    enabled: peutDemandeDevenirAidant || peutNouvelleDemandeDevenirAidant,
    queryKey: ['recuperer-departements'],
    queryFn: () => {
      const action = peutNouvelleDemandeDevenirAidant
        ? actionNouvelleDemandeDevenirAidant
        : actionDemandeDevenirAidant;

      return macAPI.execute<ReponseDemandeInitiee, ReponseDemandeInitiee>(
        constructeurParametresAPI()
          .url(action.url)
          .methode(action.methode!)
          .construis(),
        (corps) => corps
      );
    },
  });

  const referentielDepartements = data?.departements;
  return referentielDepartements;
}
