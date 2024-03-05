import { Action, Liens } from '../domaine/Lien.ts';
import { createContext, PropsWithChildren, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { useNavigate } from 'react-router-dom';

type ContexteNavigationMACType = {
  etat: Liens;
  setEtat: (liens: Liens) => void;
  navigue: (
    moteurDeLiens: MoteurDeLiens,
    action: string,
    exclusion?: Action[],
  ) => void;
  retourAccueil: () => void;
};
export const ContexteNavigationMAC = createContext<ContexteNavigationMACType>({
  etat: [],
} as unknown as ContexteNavigationMACType);
export const FournisseurNavigationMAC = ({ children }: PropsWithChildren) => {
  const [etat, setEtat] = useState<Liens>({});
  const navigate = useNavigate();

  const navigue = (
    moteurDeLiens: MoteurDeLiens,
    action: string,
    exclusion?: Action[],
  ) => {
    const route = moteurDeLiens.trouve(action).route;
    setEtat(moteurDeLiens.extrais(exclusion));
    navigate(route || '/');
  };
  const retourAccueil = () => window.location.replace('/');

  return (
    <ContexteNavigationMAC.Provider
      value={{
        etat,
        setEtat,
        navigue,
        retourAccueil,
      }}
    >
      {children}
    </ContexteNavigationMAC.Provider>
  );
};
