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
import { useMACAPI, useNavigationMAC } from './hooks.ts';

import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
  utilisateurCharge,
  utilisateurNonAuthentifie,
} from './reducteurUtilisateurAuthentifie.tsx';
import { Lien, ReponseHATEOAS } from '../domaine/Lien.ts';

type Authentifie = (
  identifiants: {
    identifiant: string;
    motDePasse: string;
  },
  surErreur: (erreur: Error) => void
) => void;
type ContexteAuthentificationType = {
  utilisateur?: Utilisateur;
  element: ReactElement | null;
  appelleUtilisateur: () => Promise<ReponseUtilisateur>;
  authentifie: Authentifie;
};

export const ContexteAuthentification =
  createContext<ContexteAuthentificationType>(
    {} as unknown as ContexteAuthentificationType
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
    initialiseReducteurUtilisateurAuthentifie()
  );

  const authentifie: Authentifie = (
    identifiants: {
      identifiant: string;
      motDePasse: string;
    },
    surErreur: (erreur: Error) => void
  ) => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'se-connecter',
      (lien: Lien) => {
        macapi
          .appelle<ReponseAuthentification, Identifiants>(
            constructeurParametresAPI<Identifiants>()
              .url(lien.url)
              .methode(lien.methode!)
              .corps({
                identifiant: identifiants.identifiant,
                motDePasse: identifiants.motDePasse,
              })
              .construis(),
            async (reponse) => (await reponse) as ReponseAuthentification
          )
          .then((reponse) => {
            envoie(utilisateurCharge({ nomPrenom: reponse.nomPrenom }));
            const moteurDeLiens = new MoteurDeLiens({
              ...reponse.liens,
            });

            moteurDeLiens.trouve(
              'afficher-tableau-de-bord',
              () =>
                navigationMAC.navigue(
                  moteurDeLiens,
                  'afficher-tableau-de-bord'
                ),
              () =>
                moteurDeLiens.trouve('creer-espace-aidant', () =>
                  navigationMAC.navigue(moteurDeLiens, 'creer-espace-aidant')
                )
            );
          })
          .catch(surErreur);
      }
    );
  };

  const appelleUtilisateur = useCallback(() => {
    return macapi.appelle<ReponseUtilisateur>(
      constructeurParametresAPI()
        .url('/api/utilisateur')
        .methode('GET')
        .construis(),
      (json) => json
    );
  }, [macapi]);

  useEffect(() => {
    if (etatUtilisateurAuthentifie.enAttenteDeChargement) {
      appelleUtilisateur()
        .then((utilisateur) => {
          envoie(utilisateurCharge(utilisateur));
          const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);

          navigationMAC.ajouteEtat(moteurDeLiens.extrais());
        })
        .catch((erreur) => {
          navigationMAC.setEtat(
            new MoteurDeLiens((erreur as ReponseHATEOAS).liens).extrais()
          );
          envoie(utilisateurNonAuthentifie());
        });
    }
  }, [navigationMAC, etatUtilisateurAuthentifie.enAttenteDeChargement, macapi]);

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
