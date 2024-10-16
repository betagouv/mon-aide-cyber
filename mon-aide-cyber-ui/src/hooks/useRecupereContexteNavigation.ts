import { useEffect, useState } from 'react';
import { ReponseHATEOAS } from '../domaine/Lien';
import { useMACAPI } from '../fournisseurs/api/useMACAPI';
import { useContexteNavigation } from './useContexteNavigation';
import { useNavigationMAC } from '../fournisseurs/hooks';

export const useRecupereContexteNavigation = (contexte: string) => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const navigationUtilisateur = useContexteNavigation(macAPI);
  const [contexteRecupere, setContexteRecupere] = useState(false);

  useEffect(() => {
    if (contexteRecupere) return;
    navigationUtilisateur
      .recupereContexteNavigation({
        contexte: contexte,
      })
      .then((reponse) =>
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens)
      )
      .catch()
      .finally(() => {
        setContexteRecupere(true);
      });
  }, [...contexte]);

  return { contexteRecupere };
};
