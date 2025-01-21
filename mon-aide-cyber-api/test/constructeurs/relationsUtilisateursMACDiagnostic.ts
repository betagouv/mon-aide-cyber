import { Entrepots } from '../../src/domaine/Entrepots';
import { AdaptateurRelations } from '../../src/relation/AdaptateurRelations';
import crypto from 'crypto';
import { unAidant } from './constructeursAidantUtilisateur';
import { unDiagnostic } from './constructeurDiagnostic';
import { aidantInitieDiagnostic } from '../../src/espace-aidant/tableau-de-bord/consommateursEvenements';
import { uneRechercheUtilisateursMAC } from '../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { fakerFR } from '@faker-js/faker';
import { DiagnosticLance } from '../../src/diagnostic/CapteurCommandeLanceDiagnostic';

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
