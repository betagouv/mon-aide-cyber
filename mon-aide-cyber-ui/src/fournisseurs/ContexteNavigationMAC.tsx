import { Action, Lien, Liens } from '../domaine/Lien.ts';
import { createContext, PropsWithChildren, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { useNavigate } from 'react-router-dom';

type ContexteNavigationMACType = {
  ajouteEtat(liens: Liens): void;
  etat: Liens;
  setEtat: (liens: Liens) => void;
  navigue: (
    moteurDeLiens: MoteurDeLiens,
    action: Action,
    exclusion?: Action[]
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
    action: Action,
    exclusion?: Action[]
  ) => {
    moteurDeLiens.trouve(
      action,
      (lien: Lien) => {
        navigate(lien.route!);
      },
      () => {
        navigate('/');
      }
    );
    setEtat(moteurDeLiens.extrais(exclusion));
  };

  const retourAccueil = () => window.location.replace('/');

  const ajouteEtat = (liens: Liens) => {
    setEtat((prev) => ({ ...prev, ...liens }));
  };

  return (
    <ContexteNavigationMAC.Provider
      value={{
        ajouteEtat,
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
