import { useCallback } from 'react';

import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../domaine/Lien.ts';
import { useNavigationMAC } from '../fournisseurs/hooks.ts';
import { macAPI } from '../fournisseurs/api/macAPI.ts';
import { constructeurParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';

export const useContexteNavigation = () => {
  const navigationMAC = useNavigationMAC();

  const recupereContexteNavigation = useCallback(
    (parametres: { contexte: string }) => {
      return macAPI
        .execute<void | ReponseHATEOAS, ReponseHATEOAS>(
          constructeurParametresAPI()
            .url(`/api/utilisateur?contexte=${parametres.contexte}`)
            .methode('GET')
            .construis(),
          (json) => json
        )
        .catch((erreur) => {
          navigationMAC.setEtat(
            new MoteurDeLiens((erreur as ReponseHATEOAS).liens).extrais()
          );
        });
    },
    []
  );

  return { recupereContexteNavigation };
};
