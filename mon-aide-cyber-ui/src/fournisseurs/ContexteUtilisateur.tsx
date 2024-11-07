import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import {
  ReponseUtilisateur,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { useQuery } from '@tanstack/react-query';
import { useNavigationMAC } from './hooks.ts';
import { useMACAPI } from './api/useMACAPI.ts';
import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { ReponseHATEOAS } from '../domaine/Lien.ts';

type ErreurContexteUtilisateur = (Error & ReponseHATEOAS) | null;

type ContexteUtilisateurType = {
  estAuthentifie: boolean;
  setUtilisateurConnecte: (utilisateurConnecte: Utilisateur | null) => void;
  utilisateur?: Utilisateur;
  erreur?: ErreurContexteUtilisateur;
  verifieConnexion: () => void;
};
export const ContexteUtilisateur = createContext<ContexteUtilisateurType>(
  {} as unknown as ContexteUtilisateurType
);

export const FournisseurUtilisateur = ({ children }: PropsWithChildren) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const [utilisateurConnecte, setUtilisateurConnecte] =
    useState<Utilisateur | null>();

  const {
    data: ressourceUtilisateur,
    error,
    refetch: verifieConnexion,
  } = useQuery({
    queryKey: ['recupere-utilisateur'],
    retry: false,
    queryFn: () => {
      return macAPI.execute<ReponseUtilisateur, ReponseUtilisateur>(
        constructeurParametresAPI()
          .url('/api/utilisateur')
          .methode('GET')
          .construis(),
        (json) => json
      );
    },
  });

  const estAuthentifie = !!utilisateurConnecte;

  const erreur: ErreurContexteUtilisateur = error as ErreurContexteUtilisateur;

  useEffect(() => {
    if (ressourceUtilisateur) {
      setUtilisateurConnecte({ nomPrenom: ressourceUtilisateur.nomPrenom });
      navigationMAC.ajouteEtat(ressourceUtilisateur.liens);
    } else if (erreur) {
      setUtilisateurConnecte(null);
      navigationMAC.ajouteEtat(erreur.liens);
    }
  }, [ressourceUtilisateur, erreur]);

  const value: ContexteUtilisateurType = {
    estAuthentifie,
    setUtilisateurConnecte,
    ...(utilisateurConnecte && {
      utilisateur: utilisateurConnecte,
    }),
    erreur,
    verifieConnexion,
  };
  return (
    <ContexteUtilisateur.Provider value={value}>
      {children}
    </ContexteUtilisateur.Provider>
  );
};
