import { EntrepotAuthentification } from './authentification/Authentification.ts';

export interface Entrepots {
  authentification(): EntrepotAuthentification;
}
