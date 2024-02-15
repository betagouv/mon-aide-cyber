import { createContext, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParametresAPI } from './ConstructeurParametresAPI.ts';
import { appelleAPI } from './appelleAPI.ts';

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
  const navigate = useNavigate();

  const appelle = async <REPONSE, CORPS = void>(
    parametresAPI: ParametresAPI<CORPS>,
    transcris: (contenu: Promise<any>) => Promise<REPONSE>,
  ) => {
    try {
      return appelleAPI(parametresAPI, fetch, navigate, transcris);
    } catch (erreur) {
      return await Promise.reject(erreur);
    }
  };

  const value = { appelle };

  return (
    <ContexteMacAPI.Provider value={value}>{children}</ContexteMacAPI.Provider>
  );
};
