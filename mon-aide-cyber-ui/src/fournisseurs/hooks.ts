import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { ContexteAuthentification } from './ContexteAuthentification.tsx';
import { ContexteNavigationMAC } from './ContexteNavigationMAC.tsx';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useAuthentification = () => useContext(ContexteAuthentification);
export const useNavigationMAC = () => useContext(ContexteNavigationMAC);
