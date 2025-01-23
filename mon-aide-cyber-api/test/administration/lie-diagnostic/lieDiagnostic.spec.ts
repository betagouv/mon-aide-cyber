import { describe, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import crypto from 'crypto';
import {
  lieDiagnostic,
  Relation,
} from '../../../src/administration/lie-diagnostic/lieDiagnostic';
import {
  EntrepotAidantMemoire,
  EntrepotDiagnosticMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unDiagnostic } from '../../constructeurs/constructeurDiagnostic';
import { AdaptateurRelationsEnErreur } from './AdaptateurRelationsEnErreur';
import { unTupleAidantInitieDiagnostic } from '../../../src/diagnostic/tuples';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

describe('Lie un diagnostic', () => {
  it("créé une nouvelle relation lorsque le diagnostic n'est pas encore lié", async () => {
    const adaptateurRelations = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const aidant = unAidant().construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);
    const identifiantAidant = aidant.identifiant;
    const diagnostic = unDiagnostic().construis();
    const entrepotDiagnostic = new EntrepotDiagnosticMemoire();
    await entrepotDiagnostic.persiste(diagnostic);
    const identifiantDiagnostic = diagnostic.identifiant;

    const relation = await lieDiagnostic(
      adaptateurRelations,
      entrepotDiagnostic,
      entrepotAidant,
      {
        mailAidant: aidant.email,
        identifiantAidant,
        identifiantDiagnostic,
        estPersiste: false,
      }
    );

    expect(
      await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
        aidant.identifiant
      )
    ).toStrictEqual([identifiantDiagnostic]);
    expect(relation).toStrictEqual<Relation>({
      mailAidant: aidant.email,
      identifiantDiagnostic,
      identifiantAidant,
      estPersiste: true,
    });
  });

  it('ne recréé pas de nouvelle relation si le diagnostic est déjà lié', async () => {
    const adaptateurRelations = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );
    const entrepotDiagnostic = new EntrepotDiagnosticMemoire();
    const diagnostic = unDiagnostic().construis();
    await entrepotDiagnostic.persiste(diagnostic);
    const aidant = unAidant().construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);
    const tuple = unTupleAidantInitieDiagnostic(
      aidant.identifiant,
      diagnostic.identifiant
    );
    await adaptateurRelations.creeTuple(tuple);

    const relation = await lieDiagnostic(
      adaptateurRelations,
      entrepotDiagnostic,
      entrepotAidant,
      {
        mailAidant: aidant.email,
        identifiantAidant: aidant.identifiant,
        identifiantDiagnostic: diagnostic.identifiant,
        estPersiste: false,
      }
    );

    expect(
      await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
        aidant.identifiant
      )
    ).toStrictEqual([diagnostic.identifiant]);
    expect(relation).toStrictEqual<Relation>({
      ...relation,
      estPersiste: true,
    });
  });

  describe('si une erreur survient pendant la persistence de la relation', () => {
    it("ne lie pas le diagnostic à l'aidant et indique l'erreur", async () => {
      const entrepotAidant = new EntrepotAidantMemoire();
      const entrepotDiagnostic = new EntrepotDiagnosticMemoire();
      const aidant = unAidant().construis();
      await entrepotAidant.persiste(aidant);
      const diagnostic = unDiagnostic().construis();
      await entrepotDiagnostic.persiste(diagnostic);

      const relation = await lieDiagnostic(
        new AdaptateurRelationsEnErreur(),
        entrepotDiagnostic,
        entrepotAidant,
        {
          mailAidant: 'un@mail.com',
          identifiantAidant: aidant.identifiant,
          identifiantDiagnostic: diagnostic.identifiant,
          estPersiste: false,
        }
      );

      expect(relation).toStrictEqual<Relation>({
        ...relation,
        message: 'erreur pendant la persistence',
      });
    });
  });

  describe("si le diagnostic à lier n'est pas trouvé", () => {
    it("ne lie pas le diagnostic à l'aidant et indique l'erreur", async () => {
      const aidant = unAidant().construis();
      const entrepotAvecUnAidant = new EntrepotAidantMemoire();
      await entrepotAvecUnAidant.persiste(aidant);
      const identifiantDiagnosticNonTrouve = crypto.randomUUID();

      const relation = await lieDiagnostic(
        new AdaptateurRelationsEnErreur(),
        new EntrepotDiagnosticMemoire(),
        entrepotAvecUnAidant,
        {
          mailAidant: aidant.email,
          identifiantAidant: aidant.identifiant,
          identifiantDiagnostic: identifiantDiagnosticNonTrouve,
          estPersiste: false,
        }
      );

      expect(relation).toStrictEqual<Relation>({
        ...relation,
        message: `le diagnostic '${identifiantDiagnosticNonTrouve}' n'a pas été trouvé`,
      });
    });
  });

  describe("si l'aidant à lier n'est pas trouvé", () => {
    it("ne lie pas le diagnostic à l'aidant et indique l'erreur", async () => {
      const entrepotAvecUnDiagnostic = new EntrepotDiagnosticMemoire();
      const diagnostic = unDiagnostic().construis();
      await entrepotAvecUnDiagnostic.persiste(diagnostic);
      const identifiantAidantNonTrouve = crypto.randomUUID();

      const relation = await lieDiagnostic(
        new AdaptateurRelationsEnErreur(),
        entrepotAvecUnDiagnostic,
        new EntrepotAidantMemoire(),
        {
          mailAidant: 'un@mail.fr',
          identifiantAidant: identifiantAidantNonTrouve,
          identifiantDiagnostic: diagnostic.identifiant,
          estPersiste: false,
        }
      );

      expect(relation).toStrictEqual<Relation>({
        ...relation,
        message: `l'aidant '${identifiantAidantNonTrouve}' n'a pas été trouvé`,
      });
    });
  });
});
