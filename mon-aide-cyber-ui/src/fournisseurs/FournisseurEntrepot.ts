import { createContext } from 'react';
import { Entrepots } from '../domaine/Entrepots.ts';
import { EntrepotDiagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import {
  APIEntrepotAuthentification,
  APIEntrepotDiagnostics,
} from '../infrastructure/entrepots/EntrepotsAPI.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { APIEntrepotDiagnostic } from '../infrastructure/entrepots/APIEntrepotDiagnostic.ts';
import { EntrepotAuthentification } from '../domaine/authentification/Authentification.ts';
import {
  APIEntrepotContact,
  EntrepotContact,
} from '../infrastructure/entrepots/APIEntrepotContact.ts';

export const FournisseurEntrepots = createContext<Entrepots>({
  diagnostic: (): EntrepotDiagnostic => new APIEntrepotDiagnostic(),
  diagnostics: (): EntrepotDiagnostics => new APIEntrepotDiagnostics(),
  authentification: (): EntrepotAuthentification =>
    new APIEntrepotAuthentification(),
  contact: (): EntrepotContact => new APIEntrepotContact(),
});
