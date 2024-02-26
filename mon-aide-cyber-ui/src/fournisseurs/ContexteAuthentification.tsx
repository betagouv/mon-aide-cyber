import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useReducer,
} from 'react';
import {
  ReponseAuthentification,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { useMACAPI } from './hooks.ts';
import { ReponseHATEOAS } from '../domaine/Actions.ts';

import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { Navigate, Outlet } from 'react-router-dom';

type ContexteAuthentificationType = {
  utilisateur?: Utilisateur;
  element: ReactElement | null;
  authentifie: (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) => Promise<ReponseHATEOAS>;
};

export const ContexteAuthentification =
  createContext<ContexteAuthentificationType>(
    {} as unknown as ContexteAuthentificationType
  );

export type Identifiants = {
  motDePasse: string;
  identifiant: string;
};

type EtatUtilisateurAuthentifie = {
  element: ReactElement | null;
  enAttenteDeChargement: boolean;
  utilisateur?: Utilisateur;
};

enum TypeActionUtilisateurAuthentifie {
  UTILISATEUR_CHARGE = 'UTILISATEUR_CHARGE',
  UTILISATEUR_NON_AUTHENTIFIE = 'UTILISATEUR_NON_AUTHENTIFIE',
}
type ActionUtilisateurAuthentifie =
  | {
      utilisateur: Utilisateur;
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE;
    }
  | {
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE;
    };
export const reducteurUtilisateurAuthentifie = (
  etat: EtatUtilisateurAuthentifie,
  action: ActionUtilisateurAuthentifie
): EtatUtilisateurAuthentifie => {
  switch (action.type) {
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE: {
      const nouvelEtat = { ...etat };
      delete nouvelEtat['utilisateur'];
      return {
        ...nouvelEtat,
        element: <Navigate to="/" />,
        enAttenteDeChargement: false,
      };
    }
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE:
      return {
        ...etat,
        utilisateur: action.utilisateur,
        element: <Outlet />,
        enAttenteDeChargement: false,
      };
  }
};

export const initialiseReducteurUtilisateurAuthentifie =
  (): EtatUtilisateurAuthentifie => {
    return {
      enAttenteDeChargement: true,
      element: null,
    };
  };

export const utilisateurCharge = (
  utilisateur: Utilisateur
): ActionUtilisateurAuthentifie => {
  return {
    type: TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE,
    utilisateur,
  };
};
export const utilisateurNonAuthentifie = (): ActionUtilisateurAuthentifie => {
  return {
    type: TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE,
  };
};

export const FournisseurAuthentification = ({
  children,
}: PropsWithChildren) => {
  const macapi = useMACAPI();

  const [etatUtilisateurAuthentifie, envoie] = useReducer(
    reducteurUtilisateurAuthentifie,
    initialiseReducteurUtilisateurAuthentifie()
  );

  const authentifie = (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) =>
    macapi
      .appelle<ReponseAuthentification, Identifiants>(
        constructeurParametresAPI<Identifiants>()
          .url(`/api/token`)
          .methode('POST')
          .corps({
            identifiant: identifiants.identifiant,
            motDePasse: identifiants.motDePasse,
          })
          .construis(),
        async (reponse) => {
          const aidant = (await reponse) as ReponseAuthentification;
          sessionStorage.setItem(
            'aidant',
            JSON.stringify({ nomPrenom: aidant.nomPrenom })
          );
          return aidant;
        }
      )
      .then((reponse) => {
        envoie(utilisateurCharge({ nomPrenom: reponse.nomPrenom }));
        return { liens: reponse.liens } as ReponseHATEOAS;
      });

  useEffect(() => {
    if (etatUtilisateurAuthentifie.enAttenteDeChargement) {
      macapi
        .appelle<Utilisateur>(
          constructeurParametresAPI()
            .url('/api/utilisateur')
            .methode('GET')
            .construis(),
          (json) => json
        )
        .then((utilisateur) => envoie(utilisateurCharge(utilisateur)))
        .catch(() => envoie(utilisateurNonAuthentifie()));
    }
  }, [etatUtilisateurAuthentifie.enAttenteDeChargement, macapi]);

  const value: ContexteAuthentificationType = {
    authentifie,
    element: etatUtilisateurAuthentifie.element,
    utilisateur: etatUtilisateurAuthentifie.utilisateur,
  };

  return (
    <ContexteAuthentification.Provider value={value}>
      {children}
    </ContexteAuthentification.Provider>
  );
};
