import { Aidant } from '../../../src/espace-aidant/Aidant';
import { unDiagnosticDansLeDepartementAvecSecteurActivite } from '../../constructeurs/constructeurDiagnostic';
import { EntrepotDiagnostic } from '../../../src/diagnostic/Diagnostic';
import { unTupleAidantInitieDiagnostic } from '../../../src/diagnostic/tuples';
import { AdaptateurRelations } from '../../../src/relation/AdaptateurRelations';

export const unDiagnosticInitiePar = async (
  departement: string,
  secteurActivite: string,
  aidant: Aidant,
  diagnosticEntrepot: EntrepotDiagnostic,
  adaptateurRelations: AdaptateurRelations
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
