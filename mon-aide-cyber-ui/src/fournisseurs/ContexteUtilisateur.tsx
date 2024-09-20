import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';

type ContexteUtilisateurType = {
  setUtilisateur: (utilisateur: Utilisateur) => void;
  utilisateur?: Utilisateur;
};
export const ContexteUtilisateur = createContext<ContexteUtilisateurType>(
  {} as unknown as ContexteUtilisateurType
);

export const FournisseurUtilisateur = ({ children }: PropsWithChildren) => {
  const [etatUtilisateur, setEtatUtilisateur] = useState<Utilisateur>();

  const setUtilisateur = useCallback((utilisateur: Utilisateur) => {
    setEtatUtilisateur(utilisateur);
  }, []);
  const value: ContexteUtilisateurType = {
    setUtilisateur,
    utilisateur: etatUtilisateur,
  };
  return (
    <ContexteUtilisateur.Provider value={value}>
      {children}
    </ContexteUtilisateur.Provider>
  );
};
