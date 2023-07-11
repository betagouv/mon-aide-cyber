import { createContext } from "react";
import { EntrepotDiagnostique } from "../domaine/diagnostique/Diagnostique.ts";
import { Entrepots } from "../domaine/Entrepots.ts";
import {
  APIEntrepotDiagnostics,
  APIEntrepotDiagnostique,
} from "../infrastructure/entrepots/EntrepotsAPI.ts";
import { EntrepotDiagnostics } from "../domaine/diagnostique/Diagnostics.ts";

export const FournisseurEntrepots = createContext<Entrepots>({
  diagnostics: (): EntrepotDiagnostics => new APIEntrepotDiagnostics(),
  diagnostique: (): EntrepotDiagnostique => new APIEntrepotDiagnostique(),
});
