import { useCallback } from 'react';

import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../domaine/Lien.ts';
import { useNavigationMAC } from '../fournisseurs/hooks.ts';
import {
  constructeurParametresAPI,
  ParametresAPI,
} from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../fournisseurs/api/useMACAPI.ts';

export const useContexteNavigation = (appelMacAPI?: {
  execute: <REPONSE, REPONSEAPI, CORPS = void>(
    parametresAPI: ParametresAPI<CORPS>,
    transcris: (contenu: Promise<REPONSEAPI>) => Promise<REPONSE>
  ) => Promise<REPONSE>;
}) => {
  const navigationMAC = useNavigationMAC();
  const useAPI = useMACAPI();
  const appelAPI = appelMacAPI ? appelMacAPI : useAPI;

  const recupereContexteNavigation = useCallback(
    (parametres: { contexte: string }) => {
      return appelAPI
        .execute<ReponseHATEOAS, ReponseHATEOAS>(
          constructeurParametresAPI()
            .url(`/api/contexte?contexte=${parametres.contexte}`)
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
