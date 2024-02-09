import { createContext, PropsWithChildren, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Liens } from '../domaine/Actions.ts';

export const ContexteActionsUtilisateurs = createContext<LiensHATEOAS>(
  {} as Liens,
);

export const FournisseurContexteActionsUtilisateur = ({
  children,
}: PropsWithChildren) => {
  const location = useLocation();
  const [actionsUtilisateurs] = useState<Liens>({
    ...location.state,
  });

  return (
    <ContexteActionsUtilisateurs.Provider value={actionsUtilisateurs}>
      {children}
    </ContexteActionsUtilisateurs.Provider>
  );
};
