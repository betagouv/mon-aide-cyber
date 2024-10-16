import { useQuery } from '@tanstack/react-query';
import { constructeurParametresAPI } from '../../../../../fournisseurs/api/ConstructeurParametresAPI';
import { UUID } from '../../../../../types/Types';
import { ReponseHATEOAS } from '../../../../Lien';
import { MoteurDeLiens } from '../../../../MoteurDeLiens';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks';
import { useMACAPI } from '../../../../../fournisseurs/api/useMACAPI';
import { useEffect, useState } from 'react';

export type AidantAnnuaire = {
  identifiant: UUID;
  nomPrenom: string;
};

export type ReponseAnnuaire = {
  aidants?: AidantAnnuaire[];
  departements: string[];
  nombreAidants: number;
};

export type ReponseAidantAnnuaire = ReponseAnnuaire & ReponseHATEOAS;

export const useListeAidants = () => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();

  const [departementARechercher, setDepartementARechercher] =
    useState<string>('');

  const {
    data: ressourceAnnuaireAidant,
    isLoading: enCoursDeChargement,
    isError: enErreur,
    refetch: relanceLaRecherche,
  } = useQuery<ReponseAidantAnnuaire>({
    queryKey: ['afficher-annuaire-aidants', departementARechercher],
    enabled: new MoteurDeLiens(navigationMAC.etat).existe(
      'afficher-annuaire-aidants'
    ),
    refetchOnWindowFocus: false,
    queryFn: () => {
      const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
        'afficher-annuaire-aidants'
      );

      if (!!departementARechercher && departementARechercher !== '') {
        lien.url = `${lien.url}?departement=${departementARechercher}`;
      }
      return macAPI.execute<ReponseAidantAnnuaire, ReponseAidantAnnuaire>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        (reponse) => reponse
      );
    },
  });

  const aidants = ressourceAnnuaireAidant?.aidants;
  const referentielDepartements = ressourceAnnuaireAidant?.departements;

  useEffect(() => {
    if (ressourceAnnuaireAidant?.liens) {
      navigationMAC.ajouteEtat(ressourceAnnuaireAidant?.liens);
    }
  }, [ressourceAnnuaireAidant]);

  const selectionneDepartement = (departement: string) => {
    setDepartementARechercher(departement);
  };

  return {
    aidants,
    nombreAidants: ressourceAnnuaireAidant?.nombreAidants,
    enCoursDeChargement,
    enErreur,
    relanceLaRecherche,
    referentielDepartements,
    selectionneDepartement,
  };
};
