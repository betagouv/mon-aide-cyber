import { Action, Lien, Liens } from './Lien.ts';

const ACTIONS: Map<Action | string, string> = new Map<Action | string, string>([
  ['afficher-accueil', '/'],
  ['afficher-profil', '/profil'],
  ['afficher-tableau-de-bord', '/tableau-de-bord'],
  ['creer-espace-aidant', '/finalise-creation-espace-aidant'],
  ['lancer-diagnostic', '/tableau-de-bord'],
  ['modifier-diagnostic', '/diagnostic/{DYNAMIQUE}'],
]);
export class MoteurDeLiens {
  constructor(private readonly liens: Liens) {
    Object.entries(liens)
      .filter(([action]) => ACTIONS.get(action))
      .forEach(([action, lien]) => {
        const route = ACTIONS.get(action);
        if (route?.includes('{DYNAMIQUE}')) {
          return (lien.route = route.replace(
            '{DYNAMIQUE}',
            lien.url.split('/').at(-1) || '',
          ));
        }
        return (lien.route = route);
      });
  }

  trouve(
    lienATrouver: string,
    enSucces?: (lien: Lien) => void,
    enErreur?: () => void,
  ): Lien {
    const lien = Object.entries(this.liens)
      .filter(([action]) => action === lienATrouver)
      .map(([, restitution]) => restitution)[0];
    if (lien && enSucces) {
      enSucces(lien);
    } else if (enErreur) {
      enErreur();
    }
    return lien;
  }

  extrais(exclusion?: (Action | string)[]): Liens {
    return Object.entries(this.liens)
      .filter(([action]) => action !== 'suite')
      .filter(([lien]) => !exclusion?.includes(lien))
      .reduce(
        (accumulateur, [action, lien]) => ({
          ...accumulateur,
          [action]: lien,
        }),
        {},
      );
  }
}
