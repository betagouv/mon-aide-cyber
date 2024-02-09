import { FormatLien, LienRoutage } from './LienRoutage.ts';
import { ParametresAPI } from './diagnostic/ParametresAPI.ts';

export enum ActionsDiagnostics {
  AFFICHER = 'details',
}

export type Lien = { url: string; methode?: string; contentType?: string };
type Suite = { suite: Lien };
export type Liens = Suite & Record<string, Lien>;
export type ReponseHATEOAS = {
  liens: Liens;
};

export const actions = {
  diagnostics: () => ActionsDiagnostics,
};

export const routage = {
  pour: (actions: { [clef: string]: string }[], action: ActionsDiagnostics) => {
    const lienAPI = actions.find(
      (actionDisponible) => actionDisponible[action] !== undefined,
    )?.[action];
    const lien = () => new LienRoutage(lienAPI as FormatLien).route();
    return {
      lien,
    };
  },
};
export const trouveParmiLesLiens = (liens: Liens, lienATrouver: string) =>
  Object.entries(liens)
    .filter(([action]) => action === lienATrouver)
    .map(([, restitution]) => restitution as ParametresAPI)[0];
export const extraisLesActions = (liens: Liens) =>
  Object.entries(liens)
    .filter(([action]) => action !== 'suite')
    .reduce(
      (accumulateur, [action, lien]) => ({
        ...accumulateur,
        [action]: lien,
      }),
      {},
    );
