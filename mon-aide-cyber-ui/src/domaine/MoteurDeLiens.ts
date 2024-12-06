import { Action, Lien, Liens } from './Lien.ts';

type ActionsStatiques = {
  [clef: string]: { applique: (lien: Lien) => string };
};

export const ROUTE_AIDANT = '/aidant';

const actionsStatiques: ActionsStatiques = {
  'afficher-profil': {
    applique: (lien) => (lien.route = `${ROUTE_AIDANT}/mes-informations`),
  },
  'afficher-tableau-de-bord': {
    applique: (lien) => (lien.route = `${ROUTE_AIDANT}/tableau-de-bord`),
  },
  'lancer-diagnostic': {
    applique: (lien) => (lien.route = `${ROUTE_AIDANT}/tableau-de-bord`),
  },
  'creer-espace-aidant': {
    applique: (lien) =>
      (lien.route = `${ROUTE_AIDANT}/finalise-creation-espace-aidant`),
  },
  'se-connecter': { applique: (lien) => (lien.route = '/connexion') },
};

export class MoteurDeLiens {
  constructor(private readonly liens: Liens) {
    Object.entries(liens).forEach(([action, lien]) => {
      Object.entries(actionsStatiques)
        .filter(([clef]) => clef === action)
        .forEach(([, valeur]) => valeur.applique(lien));
    });
  }

  existe(lienATrouver: Action) {
    const lien = Object.entries(this.liens)
      .filter(([action]) => action === lienATrouver)
      .map(([, lien]) => lien)[0];
    return !!lien;
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
    } else {
      if (enErreur) {
        enErreur();
      }
    }
  }

  trouveEtRenvoie(lienATrouver: Action): Lien {
    const lien = Object.entries(this.liens)
      .filter(([action]) => action === lienATrouver)
      .map(([, lien]) => lien)[0];

    return lien;
  }
}
