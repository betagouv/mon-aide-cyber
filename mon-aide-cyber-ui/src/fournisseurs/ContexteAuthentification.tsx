import { createContext, PropsWithChildren, useState } from 'react';
import {
  ReponseAuthentification,
  Utilisateur,
} from '../domaine/authentification/Authentification.ts';
import { useMACAPI } from './hooks.ts';
import { ReponseHATEOAS } from '../domaine/Actions.ts';

import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';

type ContexteAuthentificationType = {
  utilisateur: { nomPrenom: string } | null;
  authentifie: (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) => Promise<ReponseHATEOAS>;
};

export const ContexteAuthentification =
  createContext<ContexteAuthentificationType>(
    {} as unknown as ContexteAuthentificationType,
  );

const initialiseEtatUtilisateur = () => {
  const aidant = sessionStorage.getItem('aidant');
  if (aidant) {
    return JSON.parse(aidant) as unknown as Utilisateur;
  }
  return null;
};

export type Identifiants = {
  motDePasse: string;
  identifiant: string;
};
export const FournisseurAuthentification = ({
  children,
}: PropsWithChildren) => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(
    initialiseEtatUtilisateur(),
  );
  const macapi = useMACAPI();

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
            JSON.stringify({ nomPrenom: aidant.nomPrenom }),
          );
          return aidant;
        },
      )
      .then((reponse) => {
        setUtilisateur({ nomPrenom: reponse.nomPrenom });
        return { liens: reponse.liens } as ReponseHATEOAS;
      });

  const value = {
    utilisateur: { nomPrenom: utilisateur?.nomPrenom || '' },
    authentifie,
  };

  return (
    <ContexteAuthentification.Provider value={value}>
      {children}
    </ContexteAuthentification.Provider>
  );
};
