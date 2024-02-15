import { EntrepotAuthentification } from '../domaine/authentification/Authentification.ts';
import { Entrepots } from '../domaine/Entrepots.ts';

export const initialiseEntrepots = (entrepots: {
  entrepotAuthentification?: EntrepotAuthentification;
}): Entrepots => ({
  authentification: (): EntrepotAuthentification =>
    entrepots.entrepotAuthentification ||
    ({} as unknown as EntrepotAuthentification),
});
