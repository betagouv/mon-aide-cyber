import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { ContexteAuthentification } from './ContexteAuthentification.tsx';
import { ContexteMacAPI } from './api/ContexteMacAPI.tsx';
import { ContexteNavigationMAC } from './ContexteNavigationMAC.tsx';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { Action } from '../domaine/Lien.ts';
import { useNavigate } from 'react-router-dom';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useAuthentification = () => useContext(ContexteAuthentification);
export const useMACAPI = () => useContext(ContexteMacAPI);

export const useContexteNavigationMAC = () => useContext(ContexteNavigationMAC);
export const useNavigationMAC = () => {
  const contexte = useContexteNavigationMAC();
  const navigate = useNavigate();

  return {
    navigue: (
      moteurDeLiens: MoteurDeLiens,
      action: string,
      exclusion?: Action[],
    ) => {
      const route = moteurDeLiens.trouve(action).route;
      contexte.setEtat(moteurDeLiens.extrais(exclusion));
      navigate(route || '/');
    },
  };
};
