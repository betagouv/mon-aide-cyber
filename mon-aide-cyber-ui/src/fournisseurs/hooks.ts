import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { Entrepots } from '../domaine/Entrepots.ts';
import { FournisseurEntrepots } from './FournisseurEntrepot.ts';
import { ContexteAuthentification } from './ContexteAuthentification.tsx';
import { ContexteActionsUtilisateurs } from './ContexteActionsUtilisateurs.tsx';
import { ContexteMacAPI } from './api/ContexteMacAPI.tsx';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useEntrepots = (): Entrepots => useContext(FournisseurEntrepots);
export const useAuthentification = () => useContext(ContexteAuthentification);
export const useActionsUtilisateur = () =>
  useContext(ContexteActionsUtilisateurs);
export const useMACAPI = () => useContext(ContexteMacAPI);
