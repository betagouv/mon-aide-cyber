import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useReducer,
} from 'react';
import {
  ReponseAuthentification,
  ReponseUtilisateur,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import {
  useContexteNavigationMAC,
  useMACAPI,
  useNavigationMAC,
} from './hooks.ts';

import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { Navigate, Outlet } from 'react-router-dom';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../domaine/Lien.ts';

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
    {} as unknown as ContexteAuthentificationType,
  );

export type Identifiants = {
  identifiant: string;
  motDePasse: string;
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
  action: ActionUtilisateurAuthentifie,
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
  utilisateur: Utilisateur,
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
  const navigationMAC = useNavigationMAC();
  const contexteNavigationMAC = useContexteNavigationMAC();

  const [etatUtilisateurAuthentifie, envoie] = useReducer(
    reducteurUtilisateurAuthentifie,
    initialiseReducteurUtilisateurAuthentifie(),
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
        async (reponse) => (await reponse) as ReponseAuthentification,
      )
      .then((reponse) => {
        envoie(utilisateurCharge({ nomPrenom: reponse.nomPrenom }));
        return { liens: reponse.liens } as ReponseHATEOAS;
      });

  useEffect(() => {
    if (etatUtilisateurAuthentifie.enAttenteDeChargement) {
      macapi
        .appelle<ReponseUtilisateur>(
          constructeurParametresAPI()
            .url('/api/utilisateur')
            .methode('GET')
            .construis(),
          (json) => json,
        )
        .then((utilisateur) => {
          envoie(utilisateurCharge(utilisateur));
          const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);
          const actionCreationEspaceAidant = moteurDeLiens.trouve(
            'creer-espace-aidant',
          );

          if (actionCreationEspaceAidant) {
            navigationMAC.navigue(moteurDeLiens, 'creer-espace-aidant');
          } else {
            contexteNavigationMAC.setEtat(moteurDeLiens.extrais());
          }
        })
        .catch(() => envoie(utilisateurNonAuthentifie()));
    }
  }, [
    contexteNavigationMAC,
    etatUtilisateurAuthentifie.enAttenteDeChargement,
    macapi,
    navigationMAC,
  ]);

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
