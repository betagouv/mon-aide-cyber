import { useContext } from 'react';
import { ActionsModale, ContexteModale } from './ContexteModale.ts';
import { Entrepots } from '../domaine/Entrepots.ts';
import { FournisseurEntrepots } from './FournisseurEntrepot.ts';

export const useModale = (): ActionsModale => useContext(ContexteModale);
export const useEntrepots = (): Entrepots => useContext(FournisseurEntrepots);
