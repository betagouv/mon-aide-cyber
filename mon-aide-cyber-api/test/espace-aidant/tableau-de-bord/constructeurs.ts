import { Aidant } from '../../../src/authentification/Aidant';
import { unDiagnosticDansLeDepartementAvecSecteurActivite } from '../../constructeurs/constructeurDiagnostic';
import { EntrepotDiagnostic } from '../../../src/diagnostic/Diagnostic';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { unTupleAidantInitieDiagnostic } from '../../../src/diagnostic/tuples';

export const unDiagnosticInitiePar = async (
  departement: string,
  secteurActivite: string,
  aidant: Aidant,
  diagnosticEntrepot: EntrepotDiagnostic,
  adaptateurRelations: AdaptateurRelationsMAC
) => {
  const diagnosticInitie = unDiagnosticDansLeDepartementAvecSecteurActivite(
    departement,
    secteurActivite
  ).construis();
  await diagnosticEntrepot.persiste(diagnosticInitie);
  const tuple = unTupleAidantInitieDiagnostic(
    aidant.identifiant,
    diagnosticInitie.identifiant
  );
  await adaptateurRelations.creeTuple(tuple);
  return diagnosticInitie;
};
