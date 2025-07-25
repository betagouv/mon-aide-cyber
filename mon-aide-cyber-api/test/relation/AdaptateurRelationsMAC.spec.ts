import { describe, expect, it } from 'vitest';
import { unDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { unTupleAidantInitieDiagnostic } from '../../src/diagnostic/tuples';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { Tuple } from '../../src/relation/Tuple';

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
      await adaptateurRelationsMAC.diagnosticsFaitsParUtilisateurMAC(
        aidant.identifiant
      );

    expect(identifiantDiagnostics[0]).toStrictEqual(diagnostic.identifiant);
  });

  it('retourne le tuple pour une demande attribuée', async () => {
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const identifiantDemande = crypto.randomUUID();
    const identifiantAidant = crypto.randomUUID();
    await adaptateurRelationsMAC.attribueDemandeAAidant(
      identifiantDemande,
      identifiantAidant
    );

    const demandeAttribueeRecue =
      await adaptateurRelationsMAC.demandeAttribuee(identifiantDemande);

    expect(demandeAttribueeRecue).toStrictEqual<Tuple>({
      identifiant: expect.any(String),
      utilisateur: {
        type: 'aidant',
        identifiant: identifiantAidant,
      },
      relation: 'demandeAttribuee',
      objet: {
        type: 'demandeAide',
        identifiant: identifiantDemande,
      },
    });
  });

  it('remonte une erreur si la demande n‘est pas attribuée', async () => {
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const identifiantDemande = crypto.randomUUID();

    expect(
      adaptateurRelationsMAC.demandeAttribuee(identifiantDemande)
    ).rejects.toThrow(
      `La demande '${identifiantDemande}' n’est pas attribuée.`
    );
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
      await adaptateurRelationsMAC.diagnosticsFaitsParUtilisateurMAC(
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
      await adaptateurRelationsMAC.diagnosticsFaitsParUtilisateurMAC(
        identifiantAidant
      );

    expect(identifiantDiagnostics).toStrictEqual([diagnosticInitie]);
  });

  it('remonte une erreur si le diagnostic de l’Aidé n’est pas trouvé', async () => {
    const identifiantDiagnostic = crypto.randomUUID();
    const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );

    expect(
      adaptateurRelationsMAC.diagnosticDeLAide(identifiantDiagnostic)
    ).rejects.toThrow(
      `Le diagnostic '${identifiantDiagnostic}' n’est relié à aucune entité Aidée.`
    );
  });
});
