import { useEffect } from 'react';
import { Action, ReponseHATEOAS } from '../domaine/Lien';
import { useMACAPI } from '../fournisseurs/api/useMACAPI';
import { useContexteNavigation } from './useContexteNavigation';
import { useNavigationMAC } from '../fournisseurs/hooks';
import { useQuery } from '@tanstack/react-query';

export const useRecupereContexteNavigation = (contexte: Action | string) => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const navigationUtilisateur = useContexteNavigation(macAPI);

  const { data: contexteRecuperee, isLoading: estEnCoursDeChargement } =
    useQuery({
      queryKey: ['recupere-contexte', contexte],
      queryFn: () =>
        navigationUtilisateur.recupereContexteNavigation({
          contexte: contexte,
        }),
    });

  useEffect(() => {
    if (contexteRecuperee)
      navigationMAC.ajouteEtat((contexteRecuperee as ReponseHATEOAS).liens);
  }, [contexteRecuperee]);

  return { contexteRecuperee, estEnCoursDeChargement };
};
