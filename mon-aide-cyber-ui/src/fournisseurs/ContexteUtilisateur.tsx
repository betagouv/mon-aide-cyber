import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ReponseUtilisateur,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { useQuery } from '@tanstack/react-query';
import { useNavigationMAC } from './hooks.ts';
import { useMACAPI } from './api/useMACAPI.ts';
import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { ReponseHATEOAS } from '../domaine/Lien.ts';
import { Navigate } from 'react-router-dom';

type ErreurContexteUtilisateur = (Error & ReponseHATEOAS) | null;

type ContexteUtilisateurType = {
  estAuthentifie: boolean;
  setUtilisateurConnecte: (utilisateurConnecte: Utilisateur | null) => void;
  utilisateur?: Utilisateur;
  erreur?: ErreurContexteUtilisateur;
  verifieConnexion: () => void;
  affiche: (outlet: ReactElement | null) => ReactElement | null;
};
export const ContexteUtilisateur = createContext<ContexteUtilisateurType>(
  {} as unknown as ContexteUtilisateurType
);

export const FournisseurUtilisateur = ({ children }: PropsWithChildren) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const [utilisateurConnecte, setUtilisateurConnecte] =
    useState<Utilisateur | null>();
  const [chargeUtilisateur, setChargeUtilisateur] = useState(true);

  const {
    data: ressourceUtilisateur,
    isLoading,
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

  const affiche = useCallback(
    (outlet: ReactElement | null) => {
      if (isLoading || chargeUtilisateur) {
        return <div>Chargement...</div>;
      }
      if (utilisateurConnecte) {
        return outlet;
      } else {
        return <Navigate to="/connexion" />;
      }
    },
    [isLoading, chargeUtilisateur, utilisateurConnecte]
  );

  const estAuthentifie = !!utilisateurConnecte;

  const erreur: ErreurContexteUtilisateur = error as ErreurContexteUtilisateur;

  useEffect(() => {
    if (ressourceUtilisateur) {
      setUtilisateurConnecte({ nomPrenom: ressourceUtilisateur.nomPrenom });
      setChargeUtilisateur(false);
      navigationMAC.ajouteEtat(ressourceUtilisateur.liens);
    } else if (erreur) {
      setUtilisateurConnecte(null);
      setChargeUtilisateur(false);
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
    affiche,
  };
  return (
    <ContexteUtilisateur.Provider value={value}>
      {children}
    </ContexteUtilisateur.Provider>
  );
};
