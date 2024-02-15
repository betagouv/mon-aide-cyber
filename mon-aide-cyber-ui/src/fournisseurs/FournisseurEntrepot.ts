import { createContext } from 'react';
import { Entrepots } from '../domaine/Entrepots.ts';
import { EntrepotAuthentificationSession } from '../infrastructure/entrepots/EntrepotsAPI.ts';
import { EntrepotAuthentification } from '../domaine/authentification/Authentification.ts';

export const FournisseurEntrepots = createContext<Entrepots>({
  authentification: (): EntrepotAuthentification =>
    new EntrepotAuthentificationSession(),
});
