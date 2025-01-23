import { describe, it } from 'vitest';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { unTupleAidantInitieDiagnostic } from '../../src/diagnostic/tuples';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

describe('Adaptateur De Relation MAC', () => {
  it("retourne l'identifiant du diagnostic initié par l'aidant", async () => {
    const entrepots = new EntrepotsMemoire();
    const diagnostic = unDiagnostic().construis();
    await entrepots.diagnostic().persiste(diagnostic);
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const aidant = unAidant().construis();
    const tuple = unTupleAidantInitieDiagnostic(
      aidant.identifiant,
      diagnostic.identifiant
    );
    await adaptateurRelationsMAC.creeTuple(tuple);

    const identifiantDiagnostics =
      await adaptateurRelationsMAC.identifiantsObjetsLiesAUtilisateur(
        aidant.identifiant
      );

    expect(identifiantDiagnostics[0]).toStrictEqual(diagnostic.identifiant);
  });

  it("retourne tous les identifiants des diagnostics initiés par l'aidant", async () => {
    const identifiantDiagnostic1 = crypto.randomUUID();
    const identifiantDiagnostic2 = crypto.randomUUID();
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const identifiantAidant = crypto.randomUUID();
    const tuple1 = unTupleAidantInitieDiagnostic(
      identifiantAidant,
      identifiantDiagnostic1
    );
    const tuple2 = unTupleAidantInitieDiagnostic(
      identifiantAidant,
      identifiantDiagnostic2
    );
    await adaptateurRelationsMAC.creeTuple(tuple1);
    await adaptateurRelationsMAC.creeTuple(tuple2);

    const identifiantDiagnostics =
      await adaptateurRelationsMAC.identifiantsObjetsLiesAUtilisateur(
        identifiantAidant
      );

    expect(identifiantDiagnostics).toStrictEqual([
      identifiantDiagnostic1,
      identifiantDiagnostic2,
    ]);
  });

  it("ne retourne pas les identifiants des diagnostics non initiés par l'aidant", async () => {
    const diagnosticInitie = crypto.randomUUID();
    const autreDiagnostic = crypto.randomUUID();
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const identifiantAidant = crypto.randomUUID();
    const tuple = unTupleAidantInitieDiagnostic(
      identifiantAidant,
      diagnosticInitie
    );

    await adaptateurRelationsMAC.creeTuple(tuple);

    const identifiantAutreAidant = crypto.randomUUID();
    unTupleAidantInitieDiagnostic(identifiantAutreAidant, autreDiagnostic);
    await adaptateurRelationsMAC.creeTuple(tuple);

    const identifiantDiagnostics =
      await adaptateurRelationsMAC.identifiantsObjetsLiesAUtilisateur(
        identifiantAidant
      );

    expect(identifiantDiagnostics).toStrictEqual([diagnosticInitie]);
  });
});
