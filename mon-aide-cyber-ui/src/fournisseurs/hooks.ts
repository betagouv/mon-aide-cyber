import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { ContexteAuthentification } from './ContexteAuthentification.tsx';
import { ContexteActionsUtilisateurs } from './ContexteActionsUtilisateurs.tsx';
import { ContexteMacAPI } from './api/ContexteMacAPI.tsx';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';
import { constructeurParametresAPI } from './api/ConstructeurParametresAPI.ts';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useAuthentification = () => useContext(ContexteAuthentification);
export const useActionsUtilisateur = () =>
  useContext(ContexteActionsUtilisateurs);
export const useMACAPI = () => useContext(ContexteMacAPI);

export const useUtilisateurAuthentifie = (): Promise<Utilisateur> => {
  const macapi = useMACAPI();

  return macapi.appelle<Utilisateur>(
    constructeurParametresAPI()
      .url('/api/utilisateur')
      .methode('GET')
      .construis(),
    (json) => json,
  );
};
