import { useMoteurDeLiens } from './useMoteurDeLiens.ts';
import { useQuery } from '@tanstack/react-query';
import { ReponseDemandeInitiee } from '../domaine/gestion-demandes/devenir-aidant/DevenirAidant.ts';
import { constructeurParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../fournisseurs/api/useMACAPI.ts';

export const useRecupereLesInformationsLieesALaDemande = ():
  | ReponseDemandeInitiee
  | undefined => {
  const macAPI = useMACAPI();

  const {
    accedeALaRessource: peutDemandeDevenirAidant,
    ressource: actionDemandeDevenirAidant,
  } = useMoteurDeLiens('demande-devenir-aidant');

  const { data } = useQuery<ReponseDemandeInitiee>({
    enabled: peutDemandeDevenirAidant,
    queryKey: ['recuperer-departements'],
    queryFn: () => {
      return macAPI.execute<ReponseDemandeInitiee, ReponseDemandeInitiee>(
        constructeurParametresAPI()
          .url(actionDemandeDevenirAidant.url)
          .methode(actionDemandeDevenirAidant.methode!)
          .construis(),
        (corps) => corps
      );
    },
  });

  return data;
};
