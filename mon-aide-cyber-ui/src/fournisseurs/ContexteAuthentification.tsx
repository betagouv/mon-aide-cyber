import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {
  ReponseAuthentification,
  ReponseUtilisateur,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { useNavigationMAC, useMACAPI } from './hooks.ts';

import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../domaine/Lien.ts';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
  utilisateurCharge,
  utilisateurNonAuthentifie,
} from './reducteurUtilisateurAuthentifie.tsx';

type ContexteAuthentificationType = {
  utilisateur?: Utilisateur;
  element: ReactElement | null;
  appelleUtilisateur: () => Promise<ReponseUtilisateur>;
  authentifie: (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) => Promise<ReponseHATEOAS>;
};

export const ContexteAuthentification =
  createContext<ContexteAuthentificationType>(
    {} as unknown as ContexteAuthentificationType,
  );

export type Identifiants = {
  identifiant: string;
  motDePasse: string;
};

export const FournisseurAuthentification = ({
  children,
}: PropsWithChildren) => {
  const macapi = useMACAPI();
  const navigationMAC = useNavigationMAC();

  const [etatUtilisateurAuthentifie, envoie] = useReducer(
    reducteurUtilisateurAuthentifie,
    initialiseReducteurUtilisateurAuthentifie(),
  );

  const authentifie = (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) => {
    const lienSeConnecter = new MoteurDeLiens(navigationMAC.etat).trouve(
      'se-connecter',
    );
    return macapi
      .appelle<ReponseAuthentification, Identifiants>(
        constructeurParametresAPI<Identifiants>()
          .url(lienSeConnecter.url)
          .methode(lienSeConnecter.methode!)
          .corps({
            identifiant: identifiants.identifiant,
            motDePasse: identifiants.motDePasse,
          })
          .construis(),
        async (reponse) => (await reponse) as ReponseAuthentification,
      )
      .then((reponse) => {
        envoie(utilisateurCharge({ nomPrenom: reponse.nomPrenom }));
        return { liens: reponse.liens } as ReponseHATEOAS;
      });
  };

  const appelleUtilisateur = useCallback(() => {
    return macapi.appelle<ReponseUtilisateur>(
      constructeurParametresAPI()
        .url('/api/utilisateur')
        .methode('GET')
        .construis(),
      (json) => json,
    );
  }, [macapi]);

  useEffect(() => {
    if (etatUtilisateurAuthentifie.enAttenteDeChargement) {
      appelleUtilisateur()
        .then((utilisateur) => {
          envoie(utilisateurCharge(utilisateur));
          const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);
          const actionCreationEspaceAidant = moteurDeLiens.trouve(
            'creer-espace-aidant',
          );

          if (actionCreationEspaceAidant) {
            navigationMAC.navigue(moteurDeLiens, 'creer-espace-aidant');
          } else {
            navigationMAC.setEtat(moteurDeLiens.extrais());
          }
        })
        .catch((erreur) => {
          navigationMAC.setEtat(
            new MoteurDeLiens((erreur as ReponseHATEOAS).liens).extrais(),
          );
          envoie(utilisateurNonAuthentifie());
        });
    }
  }, [
    navigationMAC,
    etatUtilisateurAuthentifie.enAttenteDeChargement,
    macapi,
    appelleUtilisateur,
  ]);

  const value: ContexteAuthentificationType = {
    authentifie,
    appelleUtilisateur,
    element: etatUtilisateurAuthentifie.element,
    utilisateur: etatUtilisateurAuthentifie.utilisateur,
  };

  return (
    <ContexteAuthentification.Provider value={value}>
      {children}
    </ContexteAuthentification.Provider>
  );
};
