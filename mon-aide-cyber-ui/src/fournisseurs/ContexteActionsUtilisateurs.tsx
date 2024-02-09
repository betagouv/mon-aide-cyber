import { createContext, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { Liens } from '../domaine/Actions.ts';

export const ContexteActionsUtilisateurs = createContext<Liens>({} as Liens);

export const FournisseurContexteActionsUtilisateur = ({
  children,
}: PropsWithChildren) => {
  const { state } = useLocation();
  return (
    <ContexteActionsUtilisateurs.Provider value={{ ...state }}>
      {children}
    </ContexteActionsUtilisateurs.Provider>
  );
};
