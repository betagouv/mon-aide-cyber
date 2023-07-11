import { FormatLien, LienRoutage } from "./LienRoutage.ts";

export enum ActionsDiagnostics {
  AFFICHER = "details",
}

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
