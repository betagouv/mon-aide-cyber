import { createContext } from "react";
import { Entrepots } from "../domaine/Entrepots.ts";
import { EntrepotDiagnostic } from "../domaine/diagnostic/Diagnostic.ts";
import { APIEntrepotDiagnostic } from "../infrastructure/entrepots/EntrepotsAPI.ts";

export const FournisseurEntrepots = createContext<Entrepots>({
  diagnostic: (): EntrepotDiagnostic => new APIEntrepotDiagnostic(),
});
