import { createContext } from "react";
import { EntrepotDiagnostique } from "../domaine/diagnostique/Diagnostique.ts";
import { Entrepots } from "../domaine/Entrepots.ts";
import { APIEntrepotDiagnostique } from "../infrastructure/entrepots/EntrepotsAPI.ts";

export const FournisseurEntrepots = createContext<Entrepots>({
  diagnostique: (): EntrepotDiagnostique => new APIEntrepotDiagnostique(),
});
