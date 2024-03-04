import { Liens } from '../domaine/Lien.ts';
import { createContext, PropsWithChildren, useState } from 'react';

type ContexteNavigationMACType = {
  etat: Liens;
  setEtat: (liens: Liens) => void;
};
export const ContexteNavigationMAC = createContext<ContexteNavigationMACType>({
  etat: [],
} as unknown as ContexteNavigationMACType);
export const FournisseurNavigationMAC = ({ children }: PropsWithChildren) => {
  const [etat, setEtat] = useState<Liens>({});

  return (
    <ContexteNavigationMAC.Provider
      value={{
        etat,
        setEtat,
      }}
    >
      {children}
    </ContexteNavigationMAC.Provider>
  );
};
