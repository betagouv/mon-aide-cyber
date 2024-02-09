import { createContext, PropsWithChildren, useState } from 'react';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';
import { useEntrepots } from './hooks.ts';
import { ReponseHATEOAS } from '../domaine/Actions.ts';

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

export const FournisseurAuthentification = ({
  children,
}: PropsWithChildren) => {
  const entrepots = useEntrepots();
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(
    entrepots.authentification().utilisateurAuthentifieSync(),
  );

  const authentifie = (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) =>
    entrepots
      .authentification()
      .connexion({
        identifiant: identifiants.identifiant,
        motDePasse: identifiants.motDePasse,
      })
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
