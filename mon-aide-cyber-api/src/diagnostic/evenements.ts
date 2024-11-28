import { Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { MesurePriorisee } from './Diagnostic';
import { CorpsReponseQuestionATiroir } from './CapteurSagaAjoutReponse';

export type DiagnosticLance = Evenement<{
  identifiantDiagnostic: crypto.UUID;
  origine: { identifiant: crypto.UUID; type: 'AIDANT' | 'AIDÉ' };
}>;
export type RestitutionLancee = Evenement<{
  identifiantDiagnostic: crypto.UUID;
  indicateurs?: { [thematique: string]: { moyennePonderee: number } };
  mesures?: MesurePriorisee[];
}>;
export type ReponseAjoutee = Evenement<{
  identifiantDiagnostic: crypto.UUID;
  thematique: string;
  identifiantQuestion: string;
  reponse: string | string[] | CorpsReponseQuestionATiroir;
}>;
