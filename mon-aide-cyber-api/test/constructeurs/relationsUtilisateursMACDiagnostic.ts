import { Entrepots } from '../../src/domaine/Entrepots';
import { AdaptateurRelations } from '../../src/relation/AdaptateurRelations';
import crypto from 'crypto';
import {
  unAidant,
  unUtilisateurInscrit,
} from './constructeursAidantUtilisateurInscritUtilisateur';
import { unDiagnostic } from './constructeurDiagnostic';
import { aidantInitieDiagnostic } from '../../src/espace-aidant/tableau-de-bord/consommateursEvenements';
import { uneRechercheUtilisateursMAC } from '../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { fakerFR } from '@faker-js/faker';
import { DiagnosticLance } from '../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import { utilisateurInscritInitieDiagnostic } from '../../src/espace-utilisateur-inscrit/tableau-de-bord/consommateursEvenements';

type IdentifiantsRelation = {
  identifiantUtilisateur: crypto.UUID;
  identifiantDiagnostic: crypto.UUID;
};
export const relieUnAidantAUnDiagnostic = async (
  entrepots: Entrepots,
  adaptateurRelations: AdaptateurRelations
): Promise<IdentifiantsRelation> => {
  const aidant = unAidant().construis();
  const diagnostic = unDiagnostic().construis();
  await entrepots.aidants().persiste(aidant);
  await entrepots.diagnostic().persiste(diagnostic);
  await aidantInitieDiagnostic(
    adaptateurRelations,
    uneRechercheUtilisateursMAC(entrepots.utilisateursMAC())
  ).consomme<DiagnosticLance>({
    identifiant: aidant.identifiant,
    type: 'DIAGNOSTIC_LIBRE_ACCES_LANCE',
    date: fakerFR.date.anytime(),
    corps: {
      identifiantDiagnostic: diagnostic.identifiant,
      identifiantUtilisateur: aidant.identifiant,
    },
  });
  return {
    identifiantUtilisateur: aidant.identifiant,
    identifiantDiagnostic: diagnostic.identifiant,
  };
};

export const relieUnUtilisateurInscritAUnDiagnostic = async (
  entrepots: Entrepots,
  adaptateurRelations: AdaptateurRelations
): Promise<IdentifiantsRelation> => {
  const utilisateurInscrit = unUtilisateurInscrit().construis();
  const diagnostic = unDiagnostic().construis();
  await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);
  await entrepots.diagnostic().persiste(diagnostic);
  await utilisateurInscritInitieDiagnostic(
    adaptateurRelations,
    uneRechercheUtilisateursMAC(entrepots.utilisateursMAC())
  ).consomme<DiagnosticLance>({
    identifiant: utilisateurInscrit.identifiant,
    type: 'DIAGNOSTIC_LIBRE_ACCES_LANCE',
    date: fakerFR.date.anytime(),
    corps: {
      identifiantDiagnostic: diagnostic.identifiant,
      identifiantUtilisateur: utilisateurInscrit.identifiant,
    },
  });
  return {
    identifiantUtilisateur: utilisateurInscrit.identifiant,
    identifiantDiagnostic: diagnostic.identifiant,
  };
};
