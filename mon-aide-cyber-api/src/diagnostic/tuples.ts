import crypto from 'crypto';
import { DefinitionTuple, Tuple, unTuple } from '../relation/Tuple';

export const unTupleAidantInitieDiagnostic = (
  identifiantAidant: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionAidantInitieDiagnostic>(definitionAidantInitieDiagnostic)
    .avecUtilisateur(identifiantAidant)
    .avecObjet(identifiantDiagnostic)
    .construis();

export type DefinitionAidantInitieDiagnostic = DefinitionTuple & {
  relation: 'initiateur';
  typeObjet: 'diagnostic';
  typeUtilisateur: 'aidant';
};

export const definitionAidantInitieDiagnostic: {
  definition: DefinitionAidantInitieDiagnostic;
} = {
  definition: {
    relation: 'initiateur',
    typeObjet: 'diagnostic',
    typeUtilisateur: 'aidant',
  },
};

export const unTupleUtilisateurInscritInitieDiagnostic = (
  identifiantAidant: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionUtilisateurInscritInitieDiagnostic>(
    definitionUtilisateurInscritInitieDiagnostic
  )
    .avecUtilisateur(identifiantAidant)
    .avecObjet(identifiantDiagnostic)
    .construis();

export type DefinitionUtilisateurInscritInitieDiagnostic = DefinitionTuple & {
  relation: 'initiateur';
  typeObjet: 'diagnostic';
  typeUtilisateur: 'utilisateurInscrit';
};

export const definitionUtilisateurInscritInitieDiagnostic: {
  definition: DefinitionUtilisateurInscritInitieDiagnostic;
} = {
  definition: {
    relation: 'initiateur',
    typeObjet: 'diagnostic',
    typeUtilisateur: 'utilisateurInscrit',
  },
};
