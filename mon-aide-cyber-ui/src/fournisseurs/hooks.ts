import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { ContexteAuthentification } from './ContexteAuthentification.tsx';
import { ContexteActionsUtilisateurs } from './ContexteActionsUtilisateurs.tsx';
import { ContexteMacAPI } from './api/ContexteMacAPI.tsx';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useAuthentification = () => useContext(ContexteAuthentification);
export const useActionsUtilisateur = () =>
  useContext(ContexteActionsUtilisateurs);
export const useMACAPI = () => useContext(ContexteMacAPI);
