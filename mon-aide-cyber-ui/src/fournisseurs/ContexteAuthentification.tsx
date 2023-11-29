import { createContext, PropsWithChildren, useState } from 'react';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';
import { useEntrepots } from './hooks.ts';

type ContexteAuthentificationType = {
  utilisateur: Utilisateur | null;
  authentifie: (identifiants: {
    identifiant: string;
    motDePasse: string;
  }) => Promise<void>;
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
      .then((utilisateur) => {
        setUtilisateur(utilisateur);
      });

  const value = { utilisateur, authentifie };

  return (
    <ContexteAuthentification.Provider value={value}>
      {children}
    </ContexteAuthentification.Provider>
  );
};
