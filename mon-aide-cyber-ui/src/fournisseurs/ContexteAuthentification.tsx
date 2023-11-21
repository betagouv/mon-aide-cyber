import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';
import { useEntrepots } from './hooks.ts';

type ContexteAuthentificationType = {
  utilisateur: Utilisateur | null;
  authentifie: (utilisateur: Utilisateur) => void;
};

export const ContexteAuthentification =
  createContext<ContexteAuthentificationType>(
    {} as unknown as ContexteAuthentificationType,
  );

export const FournisseurAuthentification = ({
  children,
}: PropsWithChildren) => {
  const entrepots = useEntrepots();
  const [utilisateur, setUtilisateur] = useState<Utilisateur>(
    {} as unknown as Utilisateur,
  );

  useEffect(() => {
    entrepots
      .authentification()
      .utilisateurAuthentifie()
      .then((utilisateur) => setUtilisateur(utilisateur));
  }, [entrepots]);

  const authentifie = (utilisateur: Utilisateur) => {
    setUtilisateur(utilisateur);
  };

  const value = { utilisateur, authentifie };

  return (
    <ContexteAuthentification.Provider value={value}>
      {children}
    </ContexteAuthentification.Provider>
  );
};
