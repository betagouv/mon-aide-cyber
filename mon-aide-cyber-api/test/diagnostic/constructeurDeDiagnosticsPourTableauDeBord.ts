import crypto from 'crypto';
import { ServiceDiagnosticDeTest } from './ServiceDiagnosticDeTest';
import { unContexte } from './ConstructeurContexte';
import {
  Contexte,
  ServiceDiagnostic,
} from '../../src/diagnostic/ServiceDiagnostic';

type DiagnosticsRelies = {
  identifiantUtilisateur: crypto.UUID;
  relations: Map<string, string[]>;
  serviceDiagnostic: ServiceDiagnostic;
  diagnosticsCrees: { identifiant: crypto.UUID; contexte: Contexte }[];
};

export const uneListeDeDiagnosticsPourTableauDeBordReliesAUnUtilisateur = (
  dates: string[]
): DiagnosticsRelies => {
  const identifiantUtilisateur = crypto.randomUUID();
  const contextes = dates.reduce((precedent, date) => {
    precedent.add({
      identifiant: crypto.randomUUID(),
      contexte: unContexte()
        .enRegion('Corse')
        .avecLeDepartement('Corse-du-Sud')
        .avecSecteurActivite('enseignement')
        .avecDateCreation(new Date(Date.parse(date)))
        .construis(),
    });
    return precedent;
  }, new Set<{ identifiant: crypto.UUID; contexte: Contexte }>());
  const serviceDiagnosticTest = new ServiceDiagnosticDeTest(
    [...contextes].reduce((precedent, courant) => {
      precedent.set(courant.identifiant, courant.contexte);
      return precedent;
    }, new Map<string, Contexte>())
  );
  return {
    identifiantUtilisateur: identifiantUtilisateur,
    relations: new Map<string, string[]>([
      [identifiantUtilisateur, [...contextes].map((val) => val.identifiant)],
    ]),
    serviceDiagnostic: serviceDiagnosticTest,
    diagnosticsCrees: [...contextes].map((val) => ({
      identifiant: val.identifiant,
      contexte: val.contexte,
    })),
  };
};
