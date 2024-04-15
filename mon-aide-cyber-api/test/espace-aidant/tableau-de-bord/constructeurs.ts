import { Aidant } from '../../../src/authentification/Aidant';
import { unDiagnosticEnRegionDansLeDepartementAvecSecteurActivite } from '../../constructeurs/constructeurDiagnostic';
import { EntrepotDiagnostic } from '../../../src/diagnostic/Diagnostic';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';

export const unDiagnosticInitiePar = async (
  region: string,
  departement: string,
  secteurActivite: string,
  aidant: Aidant,
  diagnosticEntrepot: EntrepotDiagnostic,
  adaptateurRelations: AdaptateurRelationsMAC,
) => {
  const diagnosticInitie =
    unDiagnosticEnRegionDansLeDepartementAvecSecteurActivite(
      region,
      departement,
      secteurActivite,
    ).construis();
  await diagnosticEntrepot.persiste(diagnosticInitie);
  await adaptateurRelations.aidantInitieDiagnostic(
    aidant.identifiant,
    diagnosticInitie.identifiant,
  );
  return diagnosticInitie;
};
