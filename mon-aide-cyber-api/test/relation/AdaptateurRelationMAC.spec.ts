import { describe, it } from 'vitest';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';

describe('Adaptateur De Relation MAC', () => {
  it("retourne l'identifiant du diagnostic initié par l'aidant", async () => {
    const entrepots = new EntrepotsMemoire();
    const diagnostic = unDiagnostic().construis();
    await entrepots.diagnostic().persiste(diagnostic);
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
    );
    const aidant = unAidant().construis();
    await adaptateurRelationsMAC.aidantInitieDiagnostic(
      aidant.identifiant,
      diagnostic.identifiant,
    );

    const identifiantDiagnostics =
      await adaptateurRelationsMAC.diagnosticsInitiePar(aidant.identifiant);

    expect(identifiantDiagnostics[0]).toStrictEqual(diagnostic.identifiant);
  });

  it("retourne tous les identifiants des diagnostics initiés par l'aidant", async () => {
    const identifiantDiagnostic1 = crypto.randomUUID();
    const identifiantDiagnostic2 = crypto.randomUUID();
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
    );
    const identifiantAidant = crypto.randomUUID();
    await adaptateurRelationsMAC.aidantInitieDiagnostic(
      identifiantAidant,
      identifiantDiagnostic1,
    );
    await adaptateurRelationsMAC.aidantInitieDiagnostic(
      identifiantAidant,
      identifiantDiagnostic2,
    );

    const identifiantDiagnostics =
      await adaptateurRelationsMAC.diagnosticsInitiePar(identifiantAidant);

    expect(identifiantDiagnostics).toStrictEqual([
      identifiantDiagnostic1,
      identifiantDiagnostic2,
    ]);
  });

  it("ne retourne pas les identifiants des diagnostics non initiés par l'aidant", async () => {
    const diagnosticInitie = crypto.randomUUID();
    const autreDiagnostic = crypto.randomUUID();
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire(),
    );
    const identifiantAidant = crypto.randomUUID();
    await adaptateurRelationsMAC.aidantInitieDiagnostic(
      identifiantAidant,
      diagnosticInitie,
    );

    const identifiantAutreAidant = crypto.randomUUID();
    await adaptateurRelationsMAC.aidantInitieDiagnostic(
      identifiantAutreAidant,
      autreDiagnostic,
    );

    const identifiantDiagnostics =
      await adaptateurRelationsMAC.diagnosticsInitiePar(identifiantAidant);

    expect(identifiantDiagnostics).toStrictEqual([diagnosticInitie]);
  });
});
