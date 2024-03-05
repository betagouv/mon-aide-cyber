import { createContext, PropsWithChildren } from 'react';
import { ParametresAPI } from './ConstructeurParametresAPI.ts';
import { appelleAPI } from './appelleAPI.ts';
import { useNavigationMAC } from '../hooks.ts';

type ContexteMacAPIType = {
  appelle: <REPONSE, CORPS = void>(
    parametresAPI: ParametresAPI<CORPS>,
    transcris: (contenu: Promise<any>) => Promise<REPONSE>,
  ) => Promise<REPONSE>;
};

export const ContexteMacAPI = createContext<ContexteMacAPIType>(
  {} as unknown as ContexteMacAPIType,
);

export const FournisseurMacAPI = ({ children }: PropsWithChildren) => {
  const navigationMAC = useNavigationMAC();

  const appelle = async <REPONSE, CORPS = void>(
    parametresAPI: ParametresAPI<CORPS>,
    transcris: (contenu: Promise<any>) => Promise<REPONSE>,
  ) => {
    try {
      return appelleAPI(parametresAPI, fetch, navigationMAC.navigue, transcris);
    } catch (erreur) {
      return await Promise.reject(erreur);
    }
  };

  const value = { appelle };

  return (
    <ContexteMacAPI.Provider value={value}>{children}</ContexteMacAPI.Provider>
  );
};
