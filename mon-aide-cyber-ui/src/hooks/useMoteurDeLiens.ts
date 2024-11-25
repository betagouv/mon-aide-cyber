import { useEffect, useMemo } from 'react';
import { useNavigationMAC } from '../fournisseurs/hooks';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens';
import { Action, ReponseHATEOAS } from '../domaine/Lien';
import { useQuery } from '@tanstack/react-query';
import { useMACAPI } from '../fournisseurs/api/useMACAPI.ts';
import { constructeurParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

export function useMoteurDeLiens(clef: Action) {
  const { etat } = useNavigationMAC();

  const accedeALaRessource = useMemo(() => {
    return new MoteurDeLiens(etat).existe(clef);
  }, [clef, etat]);

  return { accedeALaRessource };
}

export function useRecupereLiensNavigation(clef: Action, actif: boolean) {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  const { data: liens } = useQuery({
    enabled: !!clef && actif,
    queryKey: ['recupere-liens-navigation'],
    queryFn: async () => {
      const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(clef);

      const reponse = await macAPI.execute<ReponseHATEOAS, ReponseHATEOAS>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        (json) => json
      );
      return reponse.liens;
    },
  });

  useEffect(() => {
    if (!liens) return;

    navigationMAC.ajouteEtat(liens);
  }, [liens]);

  return { liens };
}
