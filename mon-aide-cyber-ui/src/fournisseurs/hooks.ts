import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { ContexteNavigationMAC } from './ContexteNavigationMAC.tsx';
import { ContexteUtilisateur } from './ContexteUtilisateur.tsx';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useNavigationMAC = () => useContext(ContexteNavigationMAC);
export const useUtilisateur = () => useContext(ContexteUtilisateur);
