import { Action, Lien, Liens } from './Lien.ts';

type ActionsStatiques = {
  [clef: string]: { applique: (lien: Lien) => string };
};

const actionsStatiques: ActionsStatiques = {
  'afficher-profil': { applique: (lien) => (lien.route = '/profil') },
  'afficher-tableau-de-bord': {
    applique: (lien) => (lien.route = '/tableau-de-bord'),
  },
  'lancer-diagnostic': {
    applique: (lien) => (lien.route = '/tableau-de-bord'),
  },
  'creer-espace-aidant': {
    applique: (lien) => (lien.route = '/finalise-creation-espace-aidant'),
  },
  'se-connecter': { applique: (lien) => (lien.route = '/connexion') },
};

export class MoteurDeLiens {
  constructor(private readonly liens: Liens) {
    Object.entries(liens).forEach(([action, lien]) => {
      Object.entries(actionsStatiques)
        .filter(([clef]) => clef === action)
        .forEach(([, valeur]) => valeur.applique(lien));
      if (action?.startsWith('afficher-diagnostic-')) {
        lien.route = `/diagnostic/${action
          .split('afficher-diagnostic-')
          .at(-1)}/restitution`;
      }
      if (action === 'modifier-diagnostic') {
        lien.route = `/diagnostic/${lien?.url.split('/').at(-1)}`;
      }
    });
  }

  trouve(
    lienATrouver: Action,
    enSucces?: (lien: Lien) => void,
    enErreur?: () => void
  ) {
    const lien = Object.entries(this.liens)
      .filter(([action]) => action === lienATrouver)
      .map(([, lien]) => lien)[0];

    if (lien && enSucces) {
      enSucces(lien);
    } else if (enErreur) {
      enErreur();
    }
  }

  extrais(exclusion?: (Action | string)[]): Liens {
    return Object.entries(this.liens)
      .filter(([lien]) => !exclusion?.includes(lien))
      .reduce(
        (accumulateur, [action, lien]) => ({
          ...accumulateur,
          [action]: lien,
        }),
        {}
      );
  }
}
