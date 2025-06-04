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
  identifiantUtilisateurInscrit: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionUtilisateurInscritInitieDiagnostic>(
    definitionUtilisateurInscritInitieDiagnostic
  )
    .avecUtilisateur(identifiantUtilisateurInscrit)
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

export type DefinitionEntiteAideeBeneficieDiagnostic = DefinitionTuple & {
  relation: 'destinataire';
  typeObjet: 'diagnostic';
  typeUtilisateur: 'entiteAidee';
};

export const definitionEntiteAideeBeneficieDiagnostic: {
  definition: DefinitionEntiteAideeBeneficieDiagnostic;
} = {
  definition: {
    relation: 'destinataire',
    typeObjet: 'diagnostic',
    typeUtilisateur: 'entiteAidee',
  },
};

export type DefinitionAttributionDemandeAideAAidant = DefinitionTuple & {
  relation: 'demandeAttribuee';
  typeObjet: 'demandeAide';
  typeUtilisateur: 'aidant';
};
export const definitionAttributionDemandeAideAAidant: {
  definition: DefinitionAttributionDemandeAideAAidant;
} = {
  definition: {
    relation: 'demandeAttribuee',
    typeObjet: 'demandeAide',
    typeUtilisateur: 'aidant',
  },
};

export const unTupleAttributionDemandeAideAAidant = (
  identifiantDemande: crypto.UUID,
  identifiantAidant: crypto.UUID
): Tuple =>
  unTuple<DefinitionAttributionDemandeAideAAidant>(
    definitionAttributionDemandeAideAAidant
  )
    .avecUtilisateur(identifiantAidant)
    .avecObjet(identifiantDemande)
    .construis();
