import { EntrepotDiagnostic } from '../domaine/diagnostic/Diagnostic.ts';
import { EntrepotDiagnostics } from '../domaine/diagnostic/Diagnostics.ts';
import { EntrepotAuthentification } from '../domaine/authentification/Authentification.ts';
import { EntrepotContact } from '../infrastructure/entrepots/APIEntrepotContact.ts';
import { EntrepotUtilisateur } from '../domaine/utilisateur/Utilisateur.ts';
import { Entrepots } from '../domaine/Entrepots.ts';

export const initialiseEntrepots = (entrepots: {
  entrepotDiagnostic?: EntrepotDiagnostic;
  entrepotDiagnostics?: EntrepotDiagnostics;
  entrepotAuthentification?: EntrepotAuthentification;
}): Entrepots => ({
  diagnostic: () =>
    entrepots.entrepotDiagnostic || ({} as unknown as EntrepotDiagnostic),
  diagnostics: (): EntrepotDiagnostics =>
    entrepots.entrepotDiagnostics || ({} as unknown as EntrepotDiagnostics),
  authentification: (): EntrepotAuthentification =>
    entrepots.entrepotAuthentification ||
    ({} as unknown as EntrepotAuthentification),
  contact: (): EntrepotContact => ({}) as unknown as EntrepotContact,
  utilisateur: (): EntrepotUtilisateur =>
    ({}) as unknown as EntrepotUtilisateur,
});
